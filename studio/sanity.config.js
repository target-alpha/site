import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes/index.js";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const singletonTypes = new Set(["homePage", "siteSettings"]);

const structure = (S) => S.list()
  .title("Content")
  .items([
    S.listItem().title("Homepage").child(S.document().schemaType("homePage").documentId("homePage")),
    S.listItem().title("Site settings and page copy").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    S.divider(),
    ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId()))
  ]);

if (!projectId) throw new Error("SANITY_STUDIO_PROJECT_ID is required to run or build the Studio.");

export default defineConfig({
  name: "target-alpha",
  title: "Target Alpha Canada",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  basePath: process.env.SANITY_STUDIO_BASEPATH || "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !singletonTypes.has(template.schemaType))
  },
  document: {
    actions: (actions, context) => singletonTypes.has(context.schemaType)
      ? actions.filter(({ action }) => ["publish", "discardChanges", "restore"].includes(action))
      : actions
  }
});
