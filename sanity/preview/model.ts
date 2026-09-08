import {
  comparePackageMerchandising,
  selectHomepagePackages,
} from "../../src/content/merchandising";
import { normalizePreviewSite, type PreviewSiteData } from "./siteModel";

export type PreviewPerspective = "drafts" | "published";
export type PreviewDocumentStatus = "published" | "changed" | "new";

export interface PreviewPackage {
  id: string;
  sourceId: string;
  status: PreviewDocumentStatus;
  slug: string;
  name: string;
  category: string;
  description: string;
  bestFor: string;
  eventSize: string;
  includes: string[];
  addons: string[];
  rentalPeriod?: string;
  featured: boolean;
  displayOrder: number;
  image: Record<string, unknown> | null;
  imageAlt: string;
  issues: string[];
}

export interface PreviewFaq {
  id: string;
  sourceId: string;
  status: PreviewDocumentStatus;
  question: string;
  answer: string;
  displayOrder: number;
  issues: string[];
}

export interface PreviewContent {
  packages: PreviewPackage[];
  faqs: PreviewFaq[];
  site: PreviewSiteData;
}

export interface PreviewStatusResult {
  draftIds?: unknown;
  publishedIds?: unknown;
}

const FALLBACK_ORDER = Number.MAX_SAFE_INTEGER;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonBlankString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const text = nonBlankString(item);
    return text ? [text] : [];
  });
}

function validDisplayOrder(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : undefined;
}

export function canonicalDocumentId(id: string) {
  return id.replace(/^drafts\./, "");
}

function normalizedIdSet(value: unknown) {
  return new Set(
    stringArray(value).map((id) => canonicalDocumentId(id)),
  );
}

export function getPreviewDocumentStatus(
  sourceId: string,
  statusResult: PreviewStatusResult,
): PreviewDocumentStatus {
  const id = canonicalDocumentId(sourceId);
  const draftIds = normalizedIdSet(statusResult.draftIds);

  if (!draftIds.has(id)) {
    return "published";
  }

  const publishedIds = normalizedIdSet(statusResult.publishedIds);
  return publishedIds.has(id) ? "changed" : "new";
}

function normalizePackage(
  value: unknown,
  statusResult: PreviewStatusResult,
  index: number,
): PreviewPackage {
  const document = isRecord(value) ? value : {};
  const sourceId = nonBlankString(document._id) ?? `preview-package-${index}`;
  const issues: string[] = [];
  const slugValue = isRecord(document.slug)
    ? nonBlankString(document.slug.current)
    : nonBlankString(document.slug);
  const name = nonBlankString(document.name);
  const category = nonBlankString(document.category);
  const description = nonBlankString(document.description);
  const bestFor = nonBlankString(document.bestFor);
  const eventSize = nonBlankString(document.eventSize);
  const includes = stringArray(document.includes);
  const addons = stringArray(document.addons);
  const displayOrder = validDisplayOrder(document.displayOrder);
  const image = isRecord(document.image) ? document.image : null;
  const imageAlt = image ? nonBlankString(image.alt) : undefined;
  const hasImageAsset = Boolean(
    image && isRecord(image.asset) && nonBlankString(image.asset._ref),
  );

  if (!name) issues.push("Add a package name");
  if (!slugValue) issues.push("Generate the website address");
  if (!category) issues.push("Choose a category");
  if (!description) issues.push("Add a description");
  if (!bestFor) issues.push("Add best-for guidance");
  if (!eventSize) issues.push("Add event-size guidance");
  if (includes.length === 0) issues.push("Add at least one included item");
  if (addons.length === 0) issues.push("Add at least one add-on");
  if (displayOrder === undefined) issues.push("Add a valid display order");
  if (!hasImageAsset) issues.push("Choose an image");
  if (!imageAlt) issues.push("Add image alternative text");

  return {
    id: canonicalDocumentId(sourceId),
    sourceId,
    status: getPreviewDocumentStatus(sourceId, statusResult),
    slug: slugValue ?? "package-address",
    name: name ?? "Untitled rental package",
    category: category ?? "Choose a category",
    description:
      description ?? "Add a customer-facing package description in Studio.",
    bestFor: bestFor ?? "Add best-for guidance in Studio.",
    eventSize: eventSize ?? "Add event-size guidance in Studio.",
    includes,
    addons,
    ...(nonBlankString(document.rentalPeriod)
      ? { rentalPeriod: nonBlankString(document.rentalPeriod) }
      : {}),
    featured: document.featured === true,
    displayOrder: displayOrder ?? FALLBACK_ORDER,
    image,
    imageAlt: imageAlt ?? "Image alternative text is missing",
    issues,
  };
}

function normalizeFaq(
  value: unknown,
  statusResult: PreviewStatusResult,
  index: number,
): PreviewFaq {
  const document = isRecord(value) ? value : {};
  const sourceId = nonBlankString(document._id) ?? `preview-faq-${index}`;
  const question = nonBlankString(document.question);
  const answer = nonBlankString(document.answer);
  const displayOrder = validDisplayOrder(document.displayOrder);
  const issues: string[] = [];

  if (!question) issues.push("Add a question");
  if (!answer) issues.push("Add an answer");
  if (displayOrder === undefined) issues.push("Add a valid display order");

  return {
    id: canonicalDocumentId(sourceId),
    sourceId,
    status: getPreviewDocumentStatus(sourceId, statusResult),
    question: question ?? "Untitled FAQ",
    answer: answer ?? "Add the customer-facing answer in Studio.",
    displayOrder: displayOrder ?? FALLBACK_ORDER,
    issues,
  };
}

export function normalizePreviewContent(
  input: unknown,
  statusResult: PreviewStatusResult,
): PreviewContent {
  const result = isRecord(input) ? input : {};
  const packages = Array.isArray(result.packages) ? result.packages : [];
  const faqs = Array.isArray(result.faqs) ? result.faqs : [];

  return {
    packages: packages
      .map((item, index) => normalizePackage(item, statusResult, index))
      .toSorted(comparePackageMerchandising),
    faqs: faqs
      .map((item, index) => normalizeFaq(item, statusResult, index))
      .toSorted(
        (left, right) =>
          left.displayOrder - right.displayOrder ||
          left.question.localeCompare(right.question, "en"),
      ),
    site: normalizePreviewSite(result, statusResult),
  };
}

export function selectPreviewHomepagePackages(
  packages: readonly PreviewPackage[],
) {
  return selectHomepagePackages(packages);
}

export function resolveQuotePackageSlug(
  packages: readonly Pick<PreviewPackage, "slug">[],
  requestedSlug: string | undefined,
) {
  return requestedSlug && packages.some((pkg) => pkg.slug === requestedSlug)
    ? requestedSlug
    : "";
}
