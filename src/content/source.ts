import { ContentConfigurationError } from "@/content/errors";

export type ContentSource = "fixture" | "sanity";

export function resolveContentSource(
  value: string | undefined = process.env.JA_CONTENT_SOURCE,
): ContentSource {
  const source = value?.trim() || "fixture";

  if (source === "fixture" || source === "sanity") {
    return source;
  }

  throw new ContentConfigurationError(
    'Unsupported JA_CONTENT_SOURCE "' +
      source +
      '". Expected "fixture" or "sanity".',
  );
}
