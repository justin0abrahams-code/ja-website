import type { ContentRepository } from "@/content/repository";
import {
  fixtureFaqs,
  fixtureRentalPackages,
} from "@/content/fixtures/data";
import { fixtureSiteContent } from "@/content/fixtures/siteContent";

function comparePackages(
  left: (typeof fixtureRentalPackages)[number],
  right: (typeof fixtureRentalPackages)[number],
) {
  return (
    left.displayOrder - right.displayOrder ||
    left.name.localeCompare(right.name, "en")
  );
}

function compareFaqs(
  left: (typeof fixtureFaqs)[number],
  right: (typeof fixtureFaqs)[number],
) {
  return (
    left.displayOrder - right.displayOrder ||
    left.question.localeCompare(right.question, "en")
  );
}

export function createFixtureContentRepository(): ContentRepository {
  const rentalPackages = fixtureRentalPackages.toSorted(comparePackages);
  const faqs = fixtureFaqs.toSorted(compareFaqs);

  return {
    async getRentalPackages() {
      return rentalPackages;
    },

    async getRentalPackage(slug) {
      return rentalPackages.find((item) => item.slug === slug) ?? null;
    },

    async getFaqs() {
      return faqs;
    },

    async getSiteContent() {
      return fixtureSiteContent;
    },
  };
}
