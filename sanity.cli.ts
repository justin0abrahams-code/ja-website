import { defineCliConfig } from "sanity/cli";

function requireStudioEnvironment(
  name: "SANITY_STUDIO_PROJECT_ID" | "SANITY_STUDIO_DATASET",
) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} is required for Sanity schema and TypeGen commands.`,
    );
  }

  return value;
}

export default defineCliConfig({
  api: {
    projectId: requireStudioEnvironment("SANITY_STUDIO_PROJECT_ID"),
    dataset: requireStudioEnvironment("SANITY_STUDIO_DATASET"),
  },
  typegen: {
    path: "./src/content/sanity/queries.ts",
    schema: "./sanity/schema.json",
    generates: "./src/content/sanity/generated.ts",
    overloadClientMethods: true,
  },
});
