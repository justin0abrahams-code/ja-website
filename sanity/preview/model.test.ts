import { describe, expect, it } from "vitest";
import {
  getPreviewDocumentStatus,
  normalizePreviewContent,
  resolveQuotePackageSlug,
  selectPreviewHomepagePackages,
} from "./model";

const completePackage = {
  _id: "package-1",
  slug: { current: "package-one" },
  name: "Package One",
  category: "Sound",
  description: "Clear sound for an event.",
  bestFor: "Small events",
  eventSize: "Up to 75 people",
  includes: ["Two speakers"],
  addons: ["Delivery"],
  featured: true,
  displayOrder: 10,
  image: {
    alt: "Speakers in an event room",
    asset: { _ref: "image-example" },
  },
};

describe("Studio website preview model", () => {
  it("keeps incomplete drafts previewable and reports useful issues", () => {
    const result = normalizePreviewContent(
      {
        packages: [{ _id: "drafts.new-package", name: "" }],
        faqs: [{ _id: "drafts.new-faq", question: "" }],
      },
      {
        draftIds: ["drafts.new-package", "drafts.new-faq"],
        publishedIds: [],
      },
    );

    expect(result.packages[0]).toMatchObject({
      id: "new-package",
      name: "Untitled rental package",
      status: "new",
    });
    expect(result.packages[0].issues).toContain("Choose an image");
    expect(result.faqs[0]).toMatchObject({
      id: "new-faq",
      question: "Untitled FAQ",
      status: "new",
    });
  });

  it("distinguishes new drafts, unpublished changes, and published documents", () => {
    const statusResult = {
      draftIds: ["drafts.new", "drafts.changed"],
      publishedIds: ["changed", "published"],
    };

    expect(getPreviewDocumentStatus("drafts.new", statusResult)).toBe("new");
    expect(getPreviewDocumentStatus("drafts.changed", statusResult)).toBe(
      "changed",
    );
    expect(getPreviewDocumentStatus("published", statusResult)).toBe(
      "published",
    );
  });

  it("uses the shared homepage merchandising rule", () => {
    const packages = normalizePreviewContent(
      {
        packages: [
          { ...completePackage, _id: "fourth", name: "Fourth", displayOrder: 40 },
          { ...completePackage, _id: "second", name: "Second", displayOrder: 20 },
          { ...completePackage, _id: "third", name: "Third", displayOrder: 30 },
          { ...completePackage, _id: "first", name: "First", displayOrder: 10 },
        ],
      },
      { publishedIds: ["first", "second", "third", "fourth"] },
    ).packages;

    expect(selectPreviewHomepagePackages(packages).map((pkg) => pkg.name)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
  });

  it("keeps quote preselection only while the package exists", () => {
    const packages = normalizePreviewContent(
      { packages: [completePackage] },
      { publishedIds: ["package-1"] },
    ).packages;

    expect(resolveQuotePackageSlug(packages, "package-one")).toBe("package-one");
    expect(resolveQuotePackageSlug(packages, "missing-package")).toBe("");
  });
});
