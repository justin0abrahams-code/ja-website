import { defineCliConfig } from "sanity/cli";

function requireStudioEnvironment(
  value: string | undefined,
  name: "SANITY_STUDIO_PROJECT_ID" | "SANITY_STUDIO_DATASET",
) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(
      `${name} is required for Sanity schema and TypeGen commands.`,
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

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  typegen: {
    path: "./src/content/sanity/queries.ts",
    schema: "./sanity/schema.json",
    generates: "./src/content/sanity/generated.ts",
    overloadClientMethods: true,
  },
});
