import { existsSync } from "node:fs";
import { join } from "node:path";
import { routes } from "../src/content/routes.js";
import { nationalTeams, nationalTeamYears } from "../src/content/team.js";
import { regionalTeams, regionalTeamYears } from "../src/content/regionalExecutives.js";
import { judges } from "../src/content/judges.js";
import { events } from "../src/content/events.js";
import { news } from "../src/content/news.js";
import { partners, sponsorLogos } from "../src/content/site.js";

const issues = [];
const allLinks = [
  ...events.flatMap((item) => [item.registrationUrl, item.resourceUrl]),
  ...news.flatMap((item) => [item.articleUrl, item.videoUrl]),
  ...partners.map((item) => item.href),
  ...sponsorLogos.map((item) => item.href)
].filter(Boolean);

const requireFields = (label, entries, fields) => {
  entries.forEach((entry, index) => {
    fields.forEach((field) => {
      if (!entry[field]) issues.push(`${label} ${index + 1} is missing ${field}`);
    });
  });
};

const nationalMembers = Object.values(nationalTeams).flatMap((cohort) => cohort.members);
const regionalMembers = Object.values(regionalTeams).flatMap((cohort) => cohort.members);
const images = [
  ...nationalMembers,
  ...regionalMembers,
  ...judges,
  ...events,
  ...news,
  ...partners,
  ...sponsorLogos
].map((item) => item.image).filter(Boolean);

if (new Set(routes.map((route) => route.path)).size !== routes.length) issues.push("Duplicate route paths");
if (allLinks.some((link) => link === "#")) issues.push("Placeholder link found");
if (!nationalTeams[nationalTeamYears[0]]?.members.length) issues.push("Current national team is empty");
if (!regionalTeams[regionalTeamYears[0]]?.members.length) issues.push("Current regional team is empty");
if (!judges.length) issues.push("Judges list is empty");
if (!existsSync("index.html") || !existsSync("src/main.js")) issues.push("Application shell is missing");

requireFields("Route", routes, ["path", "type", "title", "description"]);
requireFields("National team member", nationalMembers, ["name", "role", "year", "image"]);
requireFields("Regional team member", regionalMembers, ["name", "role", "year", "image"]);
requireFields("Judge", judges, ["name", "bio", "image"]);
requireFields("Event", events, ["slug", "acronym", "fullTitle", "description", "image"]);
requireFields("News item", news, ["publication", "headline", "articleUrl", "image"]);
requireFields("Partner", partners, ["name", "href", "image"]);
requireFields("Sponsor", sponsorLogos, ["name", "href", "image"]);

images.filter((image) => image.startsWith("/")).forEach((image) => {
  if (!existsSync(join("public", image))) issues.push(`Local image is missing: ${image}`);
});

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`Checks passed: ${routes.length} routes, ${Object.values(nationalTeams).reduce((sum, cohort) => sum + cohort.members.length, 0)} national executives, ${Object.values(regionalTeams).reduce((sum, cohort) => sum + cohort.members.length, 0)} regional executives, ${judges.length} judges.`);
