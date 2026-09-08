import type { SanityImageSource } from "@sanity/image-url";
import { z } from "zod";
import {
  PACKAGE_CATEGORIES,
  type Faq,
  type RentalPackage,
} from "@/content/domain";
import { ContentValidationError } from "@/content/errors";

const nonEmptyString = z.string().trim().min(1);
const nonNegativeInteger = z.number().int().min(0);

const sanityImageSchema = z
  .object({
    alt: nonEmptyString,
    asset: z.object({
      _ref: nonEmptyString,
    }),
    crop: z
      .object({
        _type: z.string().optional(),
        top: z.number(),
        bottom: z.number(),
        left: z.number(),
        right: z.number(),
      })
      .nullish()
      .transform((value) => value ?? undefined),
    hotspot: z
      .object({
        _type: z.string().optional(),
        x: z.number(),
        y: z.number(),
        height: z.number(),
        width: z.number(),
      })
      .nullish()
      .transform((value) => value ?? undefined),
  })
  .passthrough();

const sanityPackageSchema = z.object({
  _id: nonEmptyString,
  slug: nonEmptyString,
  name: nonEmptyString,
  category: z.enum(PACKAGE_CATEGORIES),
  description: nonEmptyString,
  bestFor: nonEmptyString,
  eventSize: nonEmptyString,
  includes: z.array(nonEmptyString).min(1),
  addons: z.array(nonEmptyString).min(1),
  rentalPeriod: nonEmptyString
    .nullish()
    .transform((value) => value ?? undefined),
  featured: z.boolean(),
  displayOrder: nonNegativeInteger,
  image: sanityImageSchema,
});

const sanityFaqSchema = z.object({
  _id: nonEmptyString,
  question: nonEmptyString,
  answer: nonEmptyString,
  displayOrder: nonNegativeInteger,
});

const sanityPackageCollectionSchema = z.array(sanityPackageSchema).min(1);
const sanityFaqCollectionSchema = z.array(sanityFaqSchema).min(1);
const absoluteUrlSchema = z.string().url();

export type SanityImageUrlResolver = (source: SanityImageSource) => string;

function validationError(label: string, error: z.ZodError) {
  const details = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");

  return new ContentValidationError(
    `Invalid published Sanity ${label}: ${details}`,
  );
}

export function mapSanityRentalPackages(
  input: unknown,
  resolveImageUrl: SanityImageUrlResolver,
): RentalPackage[] {
  const parsed = sanityPackageCollectionSchema.safeParse(input);

  if (!parsed.success) {
    throw validationError("rental packages", parsed.error);
  }

  const seenSlugs = new Set<string>();

  const packages = parsed.data.map((document) => {
    if (seenSlugs.has(document.slug)) {
      throw new ContentValidationError(
        `Invalid published Sanity rental packages: duplicate slug "${document.slug}".`,
      );
    }

    seenSlugs.add(document.slug);

    let resolvedImage: string;

    try {
      resolvedImage = resolveImageUrl(document.image);
    } catch (cause) {
      throw new ContentValidationError(
        `Invalid published Sanity rental package "${document.slug}": image URL could not be resolved.`,
        { cause },
      );
    }

    const imageUrl = absoluteUrlSchema.safeParse(resolvedImage);

    if (!imageUrl.success) {
      throw new ContentValidationError(
        `Invalid published Sanity rental package "${document.slug}": image URL is not absolute.`,
      );
    }

    return {
      slug: document.slug,
      name: document.name,
      category: document.category,
      description: document.description,
      bestFor: document.bestFor,
      eventSize: document.eventSize,
      includes: document.includes,
      addons: document.addons,
      ...(document.rentalPeriod
        ? { rentalPeriod: document.rentalPeriod }
        : {}),
      featured: document.featured,
      displayOrder: document.displayOrder,
      image: {
        src: imageUrl.data,
        alt: document.image.alt,
      },
    };
  });

  return packages.toSorted(
    (left, right) =>
      left.displayOrder - right.displayOrder ||
      left.name.localeCompare(right.name, "en"),
  );
}

export function mapSanityFaqs(input: unknown): Faq[] {
  const parsed = sanityFaqCollectionSchema.safeParse(input);

  if (!parsed.success) {
    throw validationError("FAQs", parsed.error);
  }

  return parsed.data
    .map(({ question, answer, displayOrder }) => ({
      question,
      answer,
      displayOrder,
    }))
    .toSorted(
      (left, right) =>
        left.displayOrder - right.displayOrder ||
        left.question.localeCompare(right.question, "en"),
    );
}
