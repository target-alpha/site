import { nationalTeams } from "../src/content/team.js";
import { loadEnvFile } from "node:process";
import { regionalOverview, regionalTeams } from "../src/content/regionalExecutives.js";
import { events } from "../src/content/events.js";
import { judges } from "../src/content/judges.js";
import { news } from "../src/content/news.js";
import { stats } from "../src/content/stats.js";
import {
  aboutContent,
  academiaContent,
  chapterContent,
  chapterResources,
  homeContent,
  homePageContent,
  navigation,
  partners,
  site,
  sponsorLogos,
  sponsorsContent
} from "../src/content/site.js";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_WRITE_TOKEN?.trim();
const apiVersion = process.env.SANITY_API_VERSION?.trim() || "2025-02-19";

if (!projectId || !token) {
  throw new Error("SANITY_PROJECT_ID and SANITY_WRITE_TOKEN are required for the one-time import.");
}

const idPart = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const keyFor = (value, index) => `${idPart(value || "item").slice(0, 48)}-${index}`;
const asImageUrl = ({ image, ...entry }) => ({ ...entry, imageUrl: image });
const asPerson = (member, index) => ({ _type: "person", _key: keyFor(member.name, index), ...asImageUrl(member) });
const asTeam = (teamType, cohort, index) => ({
  _id: `team-${teamType}-${idPart(cohort.year)}`,
  _type: "team",
  teamType,
  year: cohort.year,
  path: cohort.path,
  sortOrder: index,
  members: cohort.members.map(asPerson)
});
const asCollection = (type, entries, titleField, transform = (entry) => entry) => entries.map((entry, index) => ({
  _id: `${type}-${idPart(entry[titleField])}`,
  _type: type,
  sortOrder: index,
  ...transform(entry)
}));
const keyedObjects = (entries, label = "title") => entries?.map((entry, index) => ({
  _type: "object",
  _key: keyFor(entry[label] || entry.name || entry.label, index),
  ...entry
}));
const keyedTestimonials = (entries) => entries?.map((entry, index) => ({
  _type: "testimonial",
  _key: keyFor(entry.name, index),
  ...asImageUrl(entry)
}));

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  site,
  navigation: navigation.map((item, index) => ({
    _type: "navigationItem",
    _key: keyFor(item.label, index),
    ...item,
    children: item.children?.map((child, childIndex) => ({ _type: "object", _key: keyFor(child.label, childIndex), ...child }))
  })),
  homeContent,
  sponsorsContent,
  aboutContent: { ...aboutContent, sections: keyedObjects(aboutContent.sections) },
  regionalOverview: { ...regionalOverview, testimonials: keyedTestimonials(regionalOverview.testimonials) },
  chapterContent: { ...chapterContent, testimonials: keyedTestimonials(chapterContent.testimonials) },
  chapterResources: keyedObjects(chapterResources, "label"),
  academiaContent: { ...academiaContent, resources: keyedObjects(academiaContent.resources) }
};

const homePage = {
  _id: "homePage",
  _type: "homePage",
  hero: {
    ...homePageContent.hero,
    images: homePageContent.hero.images.map(({ src, ...image }) => ({ _type: "homeHeroImage", ...image, imageUrl: src }))
  },
  sections: homePageContent.sections.map(({ visible, ...section }) => section)
};

const documents = [
  siteSettings,
  homePage,
  ...Object.values(nationalTeams).map((cohort, index) => asTeam("national", cohort, index)),
  ...Object.values(regionalTeams).map((cohort, index) => asTeam("regional", cohort, index)),
  ...asCollection("event", events, "slug", (entry) => ({ ...asImageUrl(entry), slug: { _type: "slug", current: entry.slug } })),
  ...asCollection("judge", judges, "name", asImageUrl),
  ...asCollection("newsItem", news, "headline", asImageUrl),
  ...asCollection("stat", stats, "label"),
  ...asCollection("sponsor", sponsorLogos, "name", asImageUrl),
  ...asCollection("partner", partners, "name", asImageUrl)
];

const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ mutations: documents.map((document) => ({ createOrReplace: document })) })
});
const result = await response.json();
if (!response.ok || result.error) throw new Error(result.error?.description || `${response.status} ${response.statusText}`);
console.log(`Imported ${documents.length} documents into Sanity dataset ${dataset}.`);
