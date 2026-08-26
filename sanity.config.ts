import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { WebsitePreviewTool } from "./sanity/preview/WebsitePreviewTool";
import { schemaTypes } from "./sanity/schemaTypes";

function requireStudioEnvironment(
  name: "SANITY_STUDIO_PROJECT_ID" | "SANITY_STUDIO_DATASET",
) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} is required to start or build JA Event Production Studio.`,
    );
  }

  return value;
}

export default defineConfig({
  name: "ja-event-production",
  title: "JA Event Production",
  projectId: requireStudioEnvironment("SANITY_STUDIO_PROJECT_ID"),
  dataset: requireStudioEnvironment("SANITY_STUDIO_DATASET"),
  plugins: [structureTool()],
  tools: (previousTools) => [
    ...previousTools,
    {
      name: "websitePreview",
      title: "Website Preview",
      component: WebsitePreviewTool,
    },
  ],
  schema: {
    types: schemaTypes,
  },
});
