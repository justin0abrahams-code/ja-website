import type { SanityImageSource } from "@sanity/image-url";
import type { ContentRepository } from "@/content/repository";
import { ContentFetchError } from "@/content/errors";
import { createSanityClientBundle } from "@/content/sanity/client";
import {
  mapSanityFaqs,
  mapSanityRentalPackages,
} from "@/content/sanity/mapper";
import { mapSanitySiteContent } from "@/content/sanity/siteMapper";
import {
  faqsQuery,
  rentalPackagesQuery,
  siteContentQuery,
} from "@/content/sanity/queries";

export interface SanityContentClient {
  fetch(query: string): Promise<unknown>;
  resolveImageUrl(source: SanityImageSource): string;
}

export function createSanityContentRepository(
  client: SanityContentClient,
): ContentRepository {
  let rentalPackagesPromise:
    | ReturnType<ContentRepository["getRentalPackages"]>
    | undefined;
  let faqsPromise: ReturnType<ContentRepository["getFaqs"]> | undefined;
  let siteContentPromise: ReturnType<ContentRepository["getSiteContent"]> | undefined;

  function getRentalPackages() {
    rentalPackagesPromise ??= (async () => {
      let response: unknown;

      try {
        response = await client.fetch(rentalPackagesQuery);
      } catch (cause) {
        throw new ContentFetchError(
          "Unable to fetch published rental packages from Sanity.",
          { cause },
        );
      }

      return mapSanityRentalPackages(response, client.resolveImageUrl);
    })();

    return rentalPackagesPromise;
  }

  function getFaqs() {
    faqsPromise ??= (async () => {
      let response: unknown;

      try {
        response = await client.fetch(faqsQuery);
      } catch (cause) {
        throw new ContentFetchError(
          "Unable to fetch published FAQs from Sanity.",
          { cause },
        );
      }

      return mapSanityFaqs(response);
    })();

    return faqsPromise;
  }

  function getSiteContent() {
    siteContentPromise ??= (async () => {
      let response: unknown;
      try {
        response = await client.fetch(siteContentQuery);
      } catch (cause) {
        throw new ContentFetchError("Unable to fetch published site content from Sanity.", { cause });
      }
      return mapSanitySiteContent(response, client.resolveImageUrl);
    })();
    return siteContentPromise;
  }

  return {
    getRentalPackages,

    async getRentalPackage(slug) {
      const rentalPackages = await getRentalPackages();
      return rentalPackages.find((item) => item.slug === slug) ?? null;
    },

    getFaqs,
    getSiteContent,
  };
}

export function createConfiguredSanityContentRepository() {
  return createSanityContentRepository(createSanityClientBundle());
}
