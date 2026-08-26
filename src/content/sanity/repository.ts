import type { SanityImageSource } from "@sanity/image-url";
import type { ContentRepository } from "@/content/repository";
import { ContentFetchError } from "@/content/errors";
import { createSanityClientBundle } from "@/content/sanity/client";
import {
  mapSanityFaqs,
  mapSanityRentalPackages,
} from "@/content/sanity/mapper";
import {
  faqsQuery,
  rentalPackagesQuery,
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

  return {
    getRentalPackages,

    async getRentalPackage(slug) {
      const rentalPackages = await getRentalPackages();
      return rentalPackages.find((item) => item.slug === slug) ?? null;
    },

    getFaqs,
  };
}

export function createConfiguredSanityContentRepository() {
  return createSanityContentRepository(createSanityClientBundle());
}
