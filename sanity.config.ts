import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { WebsitePreviewTool } from "./sanity/preview/WebsitePreviewTool";
import { schemaTypes } from "./sanity/schemaTypes";
import { SINGLETON_TYPES, structure } from "./sanity/structure";

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
  plugins: [structureTool({ structure })],
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
  document: {
    newDocumentOptions: (options) => options.filter((option) => !SINGLETON_TYPES.includes(option.templateId as (typeof SINGLETON_TYPES)[number])),
    actions: (actions, context) => SINGLETON_TYPES.includes(context.schemaType as (typeof SINGLETON_TYPES)[number])
      ? actions.filter((action) => !["delete", "duplicate"].includes(action.action ?? ""))
      : actions,
  },
});
