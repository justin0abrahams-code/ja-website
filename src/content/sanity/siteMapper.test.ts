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
      advanced: { ...f.settings.header, navigationHeading: f.settings.footer.navigationHeading, serviceAreaHeading: f.settings.footer.serviceAreaHeading, footerPackagesLabel: f.settings.footer.packagesLabel, footerQuoteLabel: f.settings.footer.quoteLabel, footerAboutLabel: f.settings.footer.aboutLabel, footerFaqLabel: f.settings.footer.faqLabel, footerServiceAreaDescription: f.settings.footer.serviceAreaDescription, footerCtaLabel: f.settings.footer.ctaLabel, defaultSeoTitle: f.settings.seo.title, defaultSeoDescription: f.settings.seo.description },
    },
    home: {
      _id: "homePage", _type: "homePage", hero: { heading: f.home.hero.heading, tagline: f.home.hero.tagline, description: f.home.hero.description, image: image(f.home.hero.image.alt), imageDescription: f.home.hero.imageDescription }, proofPoints: steps(f.home.proofPoints), featuredPackages: { heading: f.home.featuredPackages.heading, description: f.home.featuredPackages.description }, upgrades: { heading: f.home.upgrades.heading, description: f.home.upgrades.description, items: items(f.home.upgrades.items) }, process: { heading: f.home.process.heading, description: f.home.process.description, image: image(f.home.process.image.alt), steps: steps(f.home.process.steps) }, eventTypes: { heading: f.home.eventTypes.heading, items: items(f.home.eventTypes.items) }, cta: { heading: f.home.cta.heading, description: f.home.cta.description, image: image(f.home.cta.image.alt) },
      advanced: { heroEyebrow: f.home.hero.eyebrow, heroPrimaryLabel: f.home.hero.primaryLabel, heroSecondaryLabel: f.home.hero.secondaryLabel, heroImageEyebrow: f.home.hero.imageEyebrow, featuredEyebrow: f.home.featuredPackages.eyebrow, featuredLinkLabel: f.home.featuredPackages.linkLabel, upgradesEyebrow: f.home.upgrades.eyebrow, upgradesLinkLabel: f.home.upgrades.linkLabel, processEyebrow: f.home.process.eyebrow, processStepLabel: f.home.process.stepLabel, eventTypesEyebrow: f.home.eventTypes.eyebrow, ctaEyebrow: f.home.cta.eyebrow, ctaPrimaryLabel: f.home.cta.primaryLabel, ctaSecondaryLabel: f.home.cta.secondaryLabel, seo: {} },
    },
    about: { _id: "aboutPage", _type: "aboutPage", introduction: { heading: f.about.introduction.heading, description: f.about.introduction.description, secondaryDescription: f.about.introduction.secondaryDescription }, heroImage: image(f.about.heroImage.alt), supportedEvents: { heading: f.about.supportedEvents.heading, items: steps(f.about.supportedEvents.items) }, supportOptions: { heading: f.about.supportOptions.heading, items: steps(f.about.supportOptions.items) }, serviceArea: { heading: f.about.serviceArea.heading, description: f.about.serviceArea.description }, cta: { heading: f.about.cta.heading, description: f.about.cta.description }, advanced: { introductionEyebrow: f.about.introduction.eyebrow, supportedEventsEyebrow: f.about.supportedEvents.eyebrow, supportOptionsEyebrow: f.about.supportOptions.eyebrow, serviceAreaEyebrow: f.about.serviceArea.eyebrow, ctaEyebrow: f.about.cta.eyebrow, ctaPrimaryLabel: f.about.cta.primaryLabel, ctaSecondaryLabel: f.about.cta.secondaryLabel, seo: {} } },
    packages: { _id: "packagesPage", _type: "packagesPage", heading: f.packages.introduction.heading, description: f.packages.introduction.description, advanced: { eyebrow: f.packages.introduction.eyebrow, ...f.packages.labels, seo: {} } },
    quote: { _id: "quotePage", _type: "quotePage", heading: f.quote.introduction.heading, description: f.quote.introduction.description, nextSteps: steps(f.quote.nextSteps), advanced: { eyebrow: f.quote.introduction.eyebrow, nextStepsHeading: f.quote.nextStepsHeading, emailPrompt: f.quote.emailPrompt, seo: {} } },
    faq: { _id: "faqPage", _type: "faqPage", heading: f.faq.introduction.heading, description: f.faq.introduction.description, cta: { heading: f.faq.cta.heading, description: f.faq.cta.description }, advanced: { eyebrow: f.faq.introduction.eyebrow, ctaEyebrow: f.faq.cta.eyebrow, ctaPrimaryLabel: f.faq.cta.primaryLabel, ctaSecondaryLabel: f.faq.cta.secondaryLabel, seo: {} } },
  };
}

const resolveImage = () => "https://cdn.sanity.io/images/project/development/test.jpg";

describe("mapSanitySiteContent", () => {
  it("maps all six singletons, keyed arrays, and required images", () => {
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
