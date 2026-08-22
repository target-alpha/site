import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes/index.js";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;

if (!projectId) throw new Error("SANITY_STUDIO_PROJECT_ID is required to run or build the Studio.");

export default defineConfig({
  name: "target-alpha",
  title: "Target Alpha Canada",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  basePath: process.env.SANITY_STUDIO_BASE_PATH || "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
});
