import { describe, expect, it } from "vitest";
import { fixtureSiteContent as f } from "@/content/fixtures/siteContent";
import { mapSanitySiteContent } from "@/content/sanity/siteMapper";

const image = (alt: string) => ({ alt, asset: { _ref: "image-test-1200x800-jpg" } });
const items = (values: readonly { key: string; title: string; description: string }[]) => values.map(({ key, ...value }) => ({ _key: key, ...value }));
const steps = (values: readonly { key: string; text: string }[]) => values.map(({ key, ...value }) => ({ _key: key, ...value }));

function validInput() {
  return {
    settings: {
      _id: "siteSettings", _type: "siteSettings", businessName: f.settings.businessName, shortName: f.settings.shortName,
      tagline: f.settings.tagline, serviceArea: f.settings.serviceArea, description: f.settings.description,
      experience: f.settings.experience, defaultSocialImage: image(f.settings.seo.socialImage.alt),
      advanced: { ...f.settings.header, navigationHeading: f.settings.footer.navigationHeading, serviceAreaHeading: f.settings.footer.serviceAreaHeading, footerPackagesLabel: f.settings.footer.packagesLabel, footerQuoteLabel: f.settings.footer.quoteLabel, footerAboutLabel: f.settings.footer.aboutLabel, footerFaqLabel: f.settings.footer.faqLabel, footerGalleryLabel: f.settings.footer.galleryLabel, footerServiceAreaDescription: f.settings.footer.serviceAreaDescription, footerCtaLabel: f.settings.footer.ctaLabel, defaultSeoTitle: f.settings.seo.title, defaultSeoDescription: f.settings.seo.description },
    },
    home: {
      _id: "homePage", _type: "homePage", hero: { heading: f.home.hero.heading, tagline: f.home.hero.tagline, description: f.home.hero.description, image: image(f.home.hero.image.alt), imageDescription: f.home.hero.imageDescription }, proofPoints: steps(f.home.proofPoints), featuredPackages: { heading: f.home.featuredPackages.heading, description: f.home.featuredPackages.description }, upgrades: { heading: f.home.upgrades.heading, description: f.home.upgrades.description, items: items(f.home.upgrades.items) }, process: { heading: f.home.process.heading, description: f.home.process.description, image: image(f.home.process.image.alt), steps: steps(f.home.process.steps) }, eventTypes: { heading: f.home.eventTypes.heading, items: items(f.home.eventTypes.items) }, cta: { heading: f.home.cta.heading, description: f.home.cta.description, image: image(f.home.cta.image.alt) },
      advanced: { heroEyebrow: f.home.hero.eyebrow, heroPrimaryLabel: f.home.hero.primaryLabel, heroSecondaryLabel: f.home.hero.secondaryLabel, heroImageEyebrow: f.home.hero.imageEyebrow, featuredEyebrow: f.home.featuredPackages.eyebrow, featuredLinkLabel: f.home.featuredPackages.linkLabel, upgradesEyebrow: f.home.upgrades.eyebrow, upgradesLinkLabel: f.home.upgrades.linkLabel, processEyebrow: f.home.process.eyebrow, processStepLabel: f.home.process.stepLabel, eventTypesEyebrow: f.home.eventTypes.eyebrow, ctaEyebrow: f.home.cta.eyebrow, ctaPrimaryLabel: f.home.cta.primaryLabel, ctaSecondaryLabel: f.home.cta.secondaryLabel, seo: {} },
    },
    about: { _id: "aboutPage", _type: "aboutPage", introduction: { heading: f.about.introduction.heading, description: f.about.introduction.description, secondaryDescription: f.about.introduction.secondaryDescription }, heroImage: image(f.about.heroImage.alt), supportedEvents: { heading: f.about.supportedEvents.heading, items: steps(f.about.supportedEvents.items) }, supportOptions: { heading: f.about.supportOptions.heading, items: steps(f.about.supportOptions.items) }, serviceArea: { heading: f.about.serviceArea.heading, description: f.about.serviceArea.description }, cta: { heading: f.about.cta.heading, description: f.about.cta.description }, advanced: { introductionEyebrow: f.about.introduction.eyebrow, supportedEventsEyebrow: f.about.supportedEvents.eyebrow, supportOptionsEyebrow: f.about.supportOptions.eyebrow, serviceAreaEyebrow: f.about.serviceArea.eyebrow, ctaEyebrow: f.about.cta.eyebrow, ctaPrimaryLabel: f.about.cta.primaryLabel, ctaSecondaryLabel: f.about.cta.secondaryLabel, seo: {} } },
    gallery: { _id: "galleryPage", _type: "galleryPage", heading: f.gallery.introduction.heading, description: f.gallery.introduction.description, photos: f.gallery.photos.map((photo) => ({ _key: photo.key, ...image(photo.alt), caption: photo.caption })), advanced: { eyebrow: f.gallery.introduction.eyebrow, seo: {} } },
    packages: { _id: "packagesPage", _type: "packagesPage", heading: f.packages.introduction.heading, description: f.packages.introduction.description, advanced: { eyebrow: f.packages.introduction.eyebrow, ...f.packages.labels, seo: {} } },
    quote: { _id: "quotePage", _type: "quotePage", heading: f.quote.introduction.heading, description: f.quote.introduction.description, nextSteps: steps(f.quote.nextSteps), advanced: { eyebrow: f.quote.introduction.eyebrow, nextStepsHeading: f.quote.nextStepsHeading, emailPrompt: f.quote.emailPrompt, seo: {} } },
    faq: { _id: "faqPage", _type: "faqPage", heading: f.faq.introduction.heading, description: f.faq.introduction.description, cta: { heading: f.faq.cta.heading, description: f.faq.cta.description }, advanced: { eyebrow: f.faq.introduction.eyebrow, ctaEyebrow: f.faq.cta.eyebrow, ctaPrimaryLabel: f.faq.cta.primaryLabel, ctaSecondaryLabel: f.faq.cta.secondaryLabel, seo: {} } },
  };
}

const resolveImage = () => "https://cdn.sanity.io/images/project/development/test.jpg";

describe("mapSanitySiteContent", () => {
  it("preserves gallery order and accepts ten photos without leaking asset references", () => {
    const input = validInput();
    input.gallery.photos = Array.from({ length: 10 }, (_, index) => ({ _key: `photo-${index}`, ...image(`Event photo ${index + 1}`), caption: `Caption ${index + 1}` }));
    const result = mapSanitySiteContent(input, resolveImage);
    expect(result.gallery.photos).toHaveLength(10);
    expect(result.gallery.photos[9]).toEqual({ key: "photo-9", src: resolveImage(), alt: "Event photo 10", caption: "Caption 10" });
    expect(result.gallery.photos[0]).not.toHaveProperty("asset");
  });

  it("rejects more than ten photos, duplicate keys, and inaccessible gallery images", () => {
    const oversized = validInput();
    oversized.gallery.photos = Array.from({ length: 11 }, (_, index) => ({ _key: `photo-${index}`, ...image("Event photo"), caption: "" }));
    expect(() => mapSanitySiteContent(oversized, resolveImage)).toThrow(/gallery.photos/);
    const duplicate = validInput();
    duplicate.gallery.photos[1]._key = duplicate.gallery.photos[0]._key;
    expect(() => mapSanitySiteContent(duplicate, resolveImage)).toThrow(/keys must be unique/);
    const missingAlt = validInput();
    missingAlt.gallery.photos[0].alt = " ";
    expect(() => mapSanitySiteContent(missingAlt, resolveImage)).toThrow(/gallery.photos.0.alt/);
    const missingAsset = validInput();
    missingAsset.gallery.photos[0].asset._ref = "";
    expect(() => mapSanitySiteContent(missingAsset, resolveImage)).toThrow(/gallery.photos.0.asset/);
  });

  it("allows an explicitly empty gallery without substituting fixture photos", () => {
    const input = validInput();
    input.gallery.photos = [];
    expect(mapSanitySiteContent(input, resolveImage).gallery.photos).toEqual([]);
  });

  it("does not require or expose paused package content", () => {
    const input = validInput();
    delete (input as Record<string, unknown>).packages;
    delete (input.home as Record<string, unknown>).featuredPackages;
    for (const key of ["featuredEyebrow", "featuredLinkLabel", "heroPrimaryLabel", "upgradesLinkLabel"]) {
      delete (input.home.advanced as Record<string, unknown>)[key];
    }
    for (const key of ["packagesLabel", "footerPackagesLabel"]) delete (input.settings.advanced as Record<string, unknown>)[key];
    for (const page of [input.home, input.about, input.faq]) delete (page.advanced as Record<string, unknown>).ctaSecondaryLabel;
    const result = mapSanitySiteContent(input, resolveImage);
    expect(result.packages).toBeUndefined();
    expect(result.home.featuredPackages).toBeUndefined();
    expect(result.settings.header.packagesLabel).toBeUndefined();
  });

  it("ignores malformed dormant content while validating active content", () => {
    const input = { ...validInput(), packages: { invalid: true } };
    expect(mapSanitySiteContent(input, resolveImage).packages).toBeUndefined();
    input.home.featuredPackages = { heading: "", description: "" };
    expect(mapSanitySiteContent(input, resolveImage).home.featuredPackages).toBeUndefined();
    input.quote.description = "";
    expect(() => mapSanitySiteContent(input, resolveImage)).toThrow(/quote.description/);
  });

  it("maps active singletons, keyed arrays, and required images", () => {
    const result = mapSanitySiteContent(validInput(), resolveImage);
    expect(result.home.proofPoints).toEqual(f.home.proofPoints);
    expect(result.home.upgrades.items).toEqual(f.home.upgrades.items);
    expect(result.about.supportOptions).toEqual(f.about.supportOptions);
    expect(result.home.hero.image.src).toMatch(/^https:\/\//);
  });

  it("inherits page SEO from Site Settings one field at a time", () => {
    const input = validInput();
    input.about.advanced.seo = { title: "Custom About Title" };
    const result = mapSanitySiteContent(input, resolveImage);
    expect(result.about.seo.title).toBe("Custom About Title");
    expect(result.about.seo.description).toBe(f.settings.seo.description);
    expect(result.about.seo.socialImage.alt).toBe(f.settings.seo.socialImage.alt);
  });

  it("fails clearly when a singleton is missing", () => {
    const input = validInput() as Record<string, unknown>;
    input.quote = null;
    expect(() => mapSanitySiteContent(input, resolveImage)).toThrow(/quote/);
  });

  it("rejects missing image alt text and invalid ordered-array counts", () => {
    const missingAlt = validInput();
    missingAlt.about.heroImage.alt = "";
    expect(() => mapSanitySiteContent(missingAlt, resolveImage)).toThrow(/heroImage.alt/);
    const badCount = validInput();
    badCount.home.proofPoints = badCount.home.proofPoints.slice(0, 2);
    expect(() => mapSanitySiteContent(badCount, resolveImage)).toThrow(/proofPoints/);
  });
});
