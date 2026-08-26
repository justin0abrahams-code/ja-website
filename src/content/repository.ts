import "server-only";
import { cache } from "react";
import type { Faq, RentalPackage } from "@/content/domain";
import { resolveContentSource } from "@/content/source";
import { createFixtureContentRepository } from "@/content/fixtures/repository";

export interface ContentRepository {
  getRentalPackages(): Promise<RentalPackage[]>;
  getRentalPackage(slug: string): Promise<RentalPackage | null>;
  getFaqs(): Promise<Faq[]>;
}

const getSelectedRepository = cache(
  async (): Promise<ContentRepository> => {
    const source = resolveContentSource();

    if (source === "fixture") {
      return createFixtureContentRepository();
    }

    const { createConfiguredSanityContentRepository } = await import(
      "@/content/sanity/repository"
    );

    return createConfiguredSanityContentRepository();
  },
);

export const getRentalPackages = cache(async () => {
  const repository = await getSelectedRepository();
  return repository.getRentalPackages();
});

export const getRentalPackage = cache(async (slug: string) => {
  const repository = await getSelectedRepository();
  return repository.getRentalPackage(slug);
});

export const getFaqs = cache(async () => {
  const repository = await getSelectedRepository();
  return repository.getFaqs();
});
