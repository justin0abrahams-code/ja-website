import { createClient } from "@sanity/client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { ContentConfigurationError } from "@/content/errors";

export const SANITY_API_VERSION = "2026-08-24";

export interface SanityBuildConfig {
  projectId: string;
  dataset: string;
  token?: string;
}

export interface SanityEnvironment {
  SANITY_STUDIO_PROJECT_ID?: string;
  SANITY_STUDIO_DATASET?: string;
  SANITY_READ_TOKEN?: string;
}

function requiredValue(
  env: SanityEnvironment,
  name: "SANITY_STUDIO_PROJECT_ID" | "SANITY_STUDIO_DATASET",
) {
  const value = env[name]?.trim();

  if (!value) {
    throw new ContentConfigurationError(
      `JA_CONTENT_SOURCE is "sanity", but ${name} is not configured.`,
    );
  }

  return value;
}

export function getSanityBuildConfig(
  env: SanityEnvironment = process.env as unknown as SanityEnvironment,
): SanityBuildConfig {
  const token = env.SANITY_READ_TOKEN?.trim();

  return {
    projectId: requiredValue(env, "SANITY_STUDIO_PROJECT_ID"),
    dataset: requiredValue(env, "SANITY_STUDIO_DATASET"),
    ...(token ? { token } : {}),
  };
}

export function createSanityClientBundle(
  config: SanityBuildConfig = getSanityBuildConfig(),
) {
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: SANITY_API_VERSION,
    perspective: "published",
    useCdn: false,
    ...(config.token ? { token: config.token } : {}),
  });
  const imageBuilder = createImageUrlBuilder(client);

  return {
    fetch(query: string) {
      return client.fetch(query);
    },
    resolveImageUrl(source: SanityImageSource) {
      return imageBuilder.image(source).width(1600).fit("max").url();
    },
  };
}
