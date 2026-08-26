import { describe, expect, it } from "vitest";
import { ContentValidationError } from "@/content/errors";
import {
  mapSanityFaqs,
  mapSanityRentalPackages,
} from "@/content/sanity/mapper";

function publishedPackage(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    _id: "rental-package-1",
    slug: "package-one",
    name: "Package One",
    category: "Sound",
    description: "Clear sound for an event.",
    bestFor: "Small events",
    eventSize: "Up to 75 people",
    includes: ["Two speakers"],
    addons: ["Delivery"],
    rentalPeriod: "Per day",
    featured: true,
    displayOrder: 20,
    image: {
      alt: "Two speakers set up in an event room",
      asset: {
        _ref: "image-example-1600x900-jpg",
      },
    },
    ...overrides,
  };
}

const resolveImageUrl = () =>
  "https://cdn.sanity.io/images/example/production/example-1600x900.jpg";

describe("Sanity rental package mapping", () => {
  it("maps and deterministically orders valid published documents", () => {
    const result = mapSanityRentalPackages(
      [
        publishedPackage(),
        publishedPackage({
          _id: "rental-package-2",
          slug: "package-two",
          name: "Alpha Package",
          displayOrder: 10,
        }),
        publishedPackage({
          _id: "rental-package-3",
          slug: "package-three",
          name: "Beta Package",
          displayOrder: 10,
        }),
      ],
      resolveImageUrl,
    );

    expect(result.map((item) => item.slug)).toEqual([
      "package-two",
      "package-three",
      "package-one",
    ]);
    expect(result[0].image).toEqual({
      src: resolveImageUrl(),
      alt: "Two speakers set up in an event room",
    });
    expect(result[0]).not.toHaveProperty("_id");
  });

  it.each([
    ["missing required fields", { name: undefined }],
    ["blank included items", { includes: [""] }],
    ["invalid display order", { displayOrder: -1 }],
    ["missing image alt text", { image: { asset: { _ref: "image-ref" } } }],
  ])("rejects %s", (_label, overrides) => {
    expect(() =>
      mapSanityRentalPackages(
        [publishedPackage(overrides)],
        resolveImageUrl,
      ),
    ).toThrow(ContentValidationError);
  });

  it("rejects duplicate slugs", () => {
    expect(() =>
      mapSanityRentalPackages(
        [
          publishedPackage(),
          publishedPackage({ _id: "rental-package-2" }),
        ],
        resolveImageUrl,
      ),
    ).toThrow(/duplicate slug "package-one"/);
  });

  it("accepts null for optional values projected by GROQ", () => {
    const [result] = mapSanityRentalPackages(
      [
        publishedPackage({
          rentalPeriod: null,
          image: {
            alt: "Two speakers set up in an event room",
            asset: { _ref: "image-example-1600x900-jpg" },
            crop: null,
            hotspot: null,
          },
        }),
      ],
      resolveImageUrl,
    );

    expect(result).not.toHaveProperty("rentalPeriod");
  });

  it("rejects malformed and empty collections", () => {
    expect(() =>
      mapSanityRentalPackages({ documents: [] }, resolveImageUrl),
    ).toThrow(ContentValidationError);
    expect(() => mapSanityRentalPackages([], resolveImageUrl)).toThrow(
      ContentValidationError,
    );
  });

  it("rejects an invalid resolved image URL", () => {
    expect(() =>
      mapSanityRentalPackages([publishedPackage()], () => "/local-image.jpg"),
    ).toThrow(/image URL is not absolute/);
  });
});

describe("Sanity FAQ mapping", () => {
  it("maps and deterministically orders FAQs", () => {
    expect(
      mapSanityFaqs([
        {
          _id: "faq-2",
          question: "Second?",
          answer: "Second answer.",
          displayOrder: 20,
        },
        {
          _id: "faq-1",
          question: "First?",
          answer: "First answer.",
          displayOrder: 10,
        },
      ]),
    ).toEqual([
      {
        question: "First?",
        answer: "First answer.",
        displayOrder: 10,
      },
      {
        question: "Second?",
        answer: "Second answer.",
        displayOrder: 20,
      },
    ]);
  });

  it("rejects missing fields and empty collections", () => {
    expect(() =>
      mapSanityFaqs([
        {
          _id: "faq-1",
          question: "Question?",
          displayOrder: 10,
        },
      ]),
    ).toThrow(ContentValidationError);
    expect(() => mapSanityFaqs([])).toThrow(ContentValidationError);
  });
});
