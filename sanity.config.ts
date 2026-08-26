import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { WebsitePreviewTool } from "./sanity/preview/WebsitePreviewTool";
import { schemaTypes } from "./sanity/schemaTypes";

function requireStudioEnvironment(
  value: string | undefined,
  name: "SANITY_STUDIO_PROJECT_ID" | "SANITY_STUDIO_DATASET",
) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(
      `${name} is required to start or build JA Event Production Studio.`,
    );
  }

  return normalizedValue;
}

const projectId = requireStudioEnvironment(
  process.env.SANITY_STUDIO_PROJECT_ID,
  "SANITY_STUDIO_PROJECT_ID",
);
const dataset = requireStudioEnvironment(
  process.env.SANITY_STUDIO_DATASET,
  "SANITY_STUDIO_DATASET",
);

export default defineConfig({
  name: "ja-event-production",
  title: "JA Event Production",
  projectId,
  dataset,
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
