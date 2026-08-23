import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const apiVersion = process.env.SANITY_API_VERSION?.trim() || "2025-02-19";

const query = `{
  "homePage": *[_type == "homePage" && _id == "homePage"][0]{
    "hero": hero{
      statement, ctaLabel, ctaHref,
      "images": images[]{_key, imageAlt, "src": coalesce(image.asset->url, imageUrl)}
    },
    "sections": sections[]{
      ...,
      "image": coalesce(image.asset->url, imageUrl)
    }
  },
  "nationalTeams": *[_type == "team" && teamType == "national"] | order(sortOrder asc) {
    year, path,
    "members": members[]{name, role, profileRole, department, "year": ^.year, legacyPath, bio, "image": coalesce(image.asset->url, imageUrl)}
  },
  "regionalTeams": *[_type == "team" && teamType == "regional"] | order(sortOrder asc) {
    year, path,
    "members": members[]{name, role, profileRole, department, "year": ^.year, legacyPath, bio, "image": coalesce(image.asset->url, imageUrl)}
  },
  "events": *[_type == "event"] | order(sortOrder asc) {
    "slug": slug.current, acronym, fullTitle, description, detailDescription, statistic, partner, date, registrationState,
    registrationUrl, resourceLabel, resourceUrl, "image": coalesce(image.asset->url, imageUrl)
  },
  "judges": *[_type == "judge"] | order(sortOrder asc) {
    name, bio, competitions, note, year, "image": coalesce(image.asset->url, imageUrl)
  },
  "news": *[_type == "newsItem"] | order(sortOrder asc) {
    publication, headline, articleUrl, videoUrl, date, "image": coalesce(image.asset->url, imageUrl)
  },
  "stats": *[_type == "stat"] | order(sortOrder asc) {value, label},
  "partners": *[_type == "partner"] | order(sortOrder asc) {
    name, shortName, subheading, description, href, "image": coalesce(image.asset->url, imageUrl)
  },
  "sponsorLogos": *[_type == "sponsor"] | order(sortOrder asc) {
    name, href, "image": coalesce(image.asset->url, imageUrl)
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    site,
    navigation,
    homeContent,
    aboutContent,
    "regionalOverview": regionalOverview{
      ...,
      "testimonials": testimonials[]{name, role, quote, "image": coalesce(image.asset->url, imageUrl)}
    },
    "chapterContent": chapterContent{
      ...,
      "testimonials": testimonials[]{name, role, quote, "image": coalesce(image.asset->url, imageUrl)}
    },
    chapterResources,
    academiaContent
  }
}`;

export function getSanityQueryUrl() {
  if (!projectId) return "";
  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  endpoint.searchParams.set("query", query);
  return endpoint.href;
}

export async function fetchSanityContent() {
  const endpoint = getSanityQueryUrl();
  if (!endpoint) {
    console.log("Sanity is not configured; using repository content.");
    return {};
  }

  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Sanity returned ${response.status} ${response.statusText}`);
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error.description || payload.error.message);
    console.log(`Loaded published content from Sanity dataset ${dataset}.`);
    return payload.result || {};
  } catch (error) {
    if (process.env.SANITY_REQUIRED === "true") throw error;
    console.warn(`Could not load Sanity content (${error.message}); using repository content.`);
    return {};
  }
}
