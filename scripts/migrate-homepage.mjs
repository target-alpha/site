import { loadEnvFile } from "node:process";
import { homePageContent, navigation } from "../src/content/site.js";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_WRITE_TOKEN?.trim();
const apiVersion = process.env.SANITY_API_VERSION?.trim() || "2025-02-19";

if (!projectId || !token) throw new Error("SANITY_PROJECT_ID and SANITY_WRITE_TOKEN are required.");

const queryEndpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
queryEndpoint.searchParams.set("query", `*[_type == "siteSettings" && _id == "siteSettings"][0].homeContent`);
const queryResponse = await fetch(queryEndpoint, { headers: { Authorization: `Bearer ${token}` } });
const queryResult = await queryResponse.json();
if (!queryResponse.ok || queryResult.error) throw new Error(queryResult.error?.description || `${queryResponse.status} ${queryResponse.statusText}`);

const legacy = queryResult.result || {};
const page = structuredClone(homePageContent);
page.hero.statement = legacy.hero || page.hero.statement;

const section = (type) => page.sections.find((item) => item._type === type);
if (legacy.eventAnnouncement) {
  Object.assign(section("homeEventAnnouncement"), legacy.eventAnnouncement, { enabled: legacy.eventAnnouncement.visible !== false });
}
if (legacy.about) {
  section("homeStatsSection").summary = legacy.about;
  section("homeAboutSection").body = legacy.about;
}
if (legacy.events) section("homeEventsSection").body = legacy.events;
if (legacy.chapter) section("homeChapterSection").body = legacy.chapter;

const document = {
  _id: "homePage",
  _type: "homePage",
  hero: {
    ...page.hero,
    images: page.hero.images.map(({ src, ...image }) => ({ _type: "homeHeroImage", ...image, imageUrl: src }))
  },
  sections: page.sections.map((item) => ({ ...item, visible: undefined }))
};

const mutationEndpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
const mutationResponse = await fetch(mutationEndpoint, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: [
    { createIfNotExists: document },
    { patch: { id: "siteSettings", setIfMissing: {
      navigation: navigation.map((item, index) => ({
        _type: "navigationItem",
        _key: `navigation-${index}`,
        ...item,
        children: item.children?.map((child, childIndex) => ({ _type: "object", _key: `navigation-${index}-${childIndex}`, ...child }))
      }))
    } } }
  ] })
});
const mutationResult = await mutationResponse.json();
if (!mutationResponse.ok || mutationResult.error) throw new Error(mutationResult.error?.description || `${mutationResponse.status} ${mutationResponse.statusText}`);
console.log("Homepage page-builder document is ready in Sanity.");
