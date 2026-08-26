import { defineArrayMember, defineField, defineType } from "sanity";
import { fixtureSiteContent as f } from "../../src/content/fixtures/siteContent";

const advancedOptions = { collapsible: true, collapsed: true } as const;
const requiredString = (name: string, title: string) => defineField({ name, title, type: "string", validation: (rule) => rule.required().min(1) });
const requiredText = (name: string, title: string, rows = 3) => defineField({ name, title, type: "text", rows, validation: (rule) => rule.required().min(1) });
const label = (name: string) => requiredString(name, name.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()));
const listItems = (items: readonly { key: string; title: string; description: string }[]) => items.map((item) => ({ _key: item.key, _type: "contentListItem", title: item.title, description: item.description }));
const steps = (items: readonly { key: string; text: string }[]) => items.map((item) => ({ _key: item.key, _type: "contentStep", text: item.text }));
const seo = (value: { title: string; description: string }) => ({ _type: "seoOverride", title: value.title, description: value.description });
const seoField = defineField({ name: "seo", title: "Search and social sharing", type: "seoOverride" });

export const siteSettingsType = defineType({
  name: "siteSettings", title: "Site Settings", type: "document",
  initialValue: {
    businessName: f.settings.businessName, shortName: f.settings.shortName, tagline: f.settings.tagline,
    serviceArea: f.settings.serviceArea, description: f.settings.description, experience: f.settings.experience,
    advanced: {
      _type: "object", ...f.settings.header, navigationHeading: f.settings.footer.navigationHeading,
      serviceAreaHeading: f.settings.footer.serviceAreaHeading, footerPackagesLabel: f.settings.footer.packagesLabel,
      footerQuoteLabel: f.settings.footer.quoteLabel, footerAboutLabel: f.settings.footer.aboutLabel,
      footerFaqLabel: f.settings.footer.faqLabel, footerServiceAreaDescription: f.settings.footer.serviceAreaDescription,
      footerCtaLabel: f.settings.footer.ctaLabel, defaultSeoTitle: f.settings.seo.title,
      defaultSeoDescription: f.settings.seo.description,
    },
  },
  fields: [
    requiredString("businessName", "Business name"), requiredString("shortName", "Short name"),
    requiredString("tagline", "Tagline"), requiredString("serviceArea", "Service area"),
    requiredText("description", "Business description", 4), requiredString("experience", "Experience statement"),
    defineField({ name: "defaultSocialImage", title: "Default social image", type: "marketingImage", validation: (rule) => rule.required() }),
    defineField({ name: "advanced", title: "Advanced labels and SEO", type: "object", options: advancedOptions, validation: (rule) => rule.required(), fields: [
      label("brandDescriptor"), label("packagesLabel"), label("quoteLabel"), label("aboutLabel"), label("faqLabel"), label("ctaLabel"),
      label("navigationHeading"), label("serviceAreaHeading"), label("footerPackagesLabel"), label("footerQuoteLabel"),
      label("footerAboutLabel"), label("footerFaqLabel"), requiredText("footerServiceAreaDescription", "Footer service area description"),
      label("footerCtaLabel"),
      defineField({ name: "defaultSeoTitle", title: "Default page title", type: "string", validation: (rule) => rule.required().min(1).max(70) }),
      defineField({ name: "defaultSeoDescription", title: "Default SEO description", type: "text", rows: 3, validation: (rule) => rule.required().min(1).max(180) }),
    ] }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export const homePageType = defineType({
  name: "homePage", title: "Home Page", type: "document",
  initialValue: {
    hero: { _type: "object", heading: f.home.hero.heading, tagline: f.home.hero.tagline, description: f.home.hero.description, imageDescription: f.home.hero.imageDescription },
    proofPoints: steps(f.home.proofPoints),
    featuredPackages: { _type: "object", heading: f.home.featuredPackages.heading, description: f.home.featuredPackages.description },
    upgrades: { _type: "object", heading: f.home.upgrades.heading, description: f.home.upgrades.description, items: listItems(f.home.upgrades.items) },
    process: { _type: "object", heading: f.home.process.heading, description: f.home.process.description, steps: steps(f.home.process.steps) },
    eventTypes: { _type: "object", heading: f.home.eventTypes.heading, items: listItems(f.home.eventTypes.items) },
    cta: { _type: "object", heading: f.home.cta.heading, description: f.home.cta.description },
    advanced: { _type: "object", heroEyebrow: f.home.hero.eyebrow, heroPrimaryLabel: f.home.hero.primaryLabel, heroSecondaryLabel: f.home.hero.secondaryLabel, heroImageEyebrow: f.home.hero.imageEyebrow, featuredEyebrow: f.home.featuredPackages.eyebrow, featuredLinkLabel: f.home.featuredPackages.linkLabel, upgradesEyebrow: f.home.upgrades.eyebrow, upgradesLinkLabel: f.home.upgrades.linkLabel, processEyebrow: f.home.process.eyebrow, processStepLabel: f.home.process.stepLabel, eventTypesEyebrow: f.home.eventTypes.eyebrow, ctaEyebrow: f.home.cta.eyebrow, ctaPrimaryLabel: f.home.cta.primaryLabel, ctaSecondaryLabel: f.home.cta.secondaryLabel, seo: seo(f.home.seo) },
  },
  fields: [
    defineField({ name: "hero", title: "Hero", type: "object", validation: (rule) => rule.required(), fields: [
      requiredString("heading", "Heading"), requiredString("tagline", "Tagline"), requiredText("description", "Description"),
      defineField({ name: "image", title: "Image", type: "marketingImage", validation: (rule) => rule.required() }),
      requiredText("imageDescription", "Image caption", 2),
    ] }),
    defineField({ name: "proofPoints", title: "Proof points", type: "array", of: [defineArrayMember({ type: "contentStep" })], validation: (rule) => rule.required().length(3) }),
    defineField({ name: "featuredPackages", title: "Featured package introduction", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description")] }),
    defineField({ name: "upgrades", title: "Popular upgrades", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description"), defineField({ name: "items", title: "Upgrades", type: "array", of: [defineArrayMember({ type: "contentListItem" })], validation: (rule) => rule.required().min(1).max(6) })] }),
    defineField({ name: "process", title: "How it works", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description"), defineField({ name: "image", title: "Image", type: "marketingImage", validation: (rule) => rule.required() }), defineField({ name: "steps", title: "Steps", type: "array", of: [defineArrayMember({ type: "contentStep" })], validation: (rule) => rule.required().min(2).max(5) })] }),
    defineField({ name: "eventTypes", title: "Event types", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), defineField({ name: "items", title: "Event types", type: "array", of: [defineArrayMember({ type: "contentListItem" })], validation: (rule) => rule.required().min(1).max(6) })] }),
    defineField({ name: "cta", title: "Final call to action", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description"), defineField({ name: "image", title: "Image", type: "marketingImage", validation: (rule) => rule.required() })] }),
    defineField({ name: "advanced", title: "Advanced labels and SEO", type: "object", options: advancedOptions, validation: (rule) => rule.required(), fields: [
      ...["heroEyebrow", "heroPrimaryLabel", "heroSecondaryLabel", "heroImageEyebrow", "featuredEyebrow", "featuredLinkLabel", "upgradesEyebrow", "upgradesLinkLabel", "processEyebrow", "processStepLabel", "eventTypesEyebrow", "ctaEyebrow", "ctaPrimaryLabel", "ctaSecondaryLabel"].map(label), seoField,
    ] }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});

export const aboutPageType = defineType({
  name: "aboutPage", title: "About Page", type: "document",
  initialValue: {
    introduction: { _type: "object", heading: f.about.introduction.heading, description: f.about.introduction.description, secondaryDescription: f.about.introduction.secondaryDescription },
    supportedEvents: { _type: "object", heading: f.about.supportedEvents.heading, items: steps(f.about.supportedEvents.items) },
    supportOptions: { _type: "object", heading: f.about.supportOptions.heading, items: steps(f.about.supportOptions.items) },
    serviceArea: { _type: "object", heading: f.about.serviceArea.heading, description: f.about.serviceArea.description },
    cta: { _type: "object", heading: f.about.cta.heading, description: f.about.cta.description },
    advanced: { _type: "object", introductionEyebrow: f.about.introduction.eyebrow, supportedEventsEyebrow: f.about.supportedEvents.eyebrow, supportOptionsEyebrow: f.about.supportOptions.eyebrow, serviceAreaEyebrow: f.about.serviceArea.eyebrow, ctaEyebrow: f.about.cta.eyebrow, ctaPrimaryLabel: f.about.cta.primaryLabel, ctaSecondaryLabel: f.about.cta.secondaryLabel, seo: seo(f.about.seo) },
  },
  fields: [
    defineField({ name: "introduction", title: "Introduction", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Introduction", 4), requiredText("secondaryDescription", "Additional introduction", 4)] }),
    defineField({ name: "heroImage", title: "Hero image", type: "marketingImage", validation: (rule) => rule.required() }),
    defineField({ name: "supportedEvents", title: "Supported event types", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), defineField({ name: "items", title: "Event types", type: "array", of: [defineArrayMember({ type: "contentStep" })], validation: (rule) => rule.required().min(1).max(8) })] }),
    defineField({ name: "supportOptions", title: "Support options", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), defineField({ name: "items", title: "Options", type: "array", of: [defineArrayMember({ type: "contentStep" })], validation: (rule) => rule.required().min(1).max(8) })] }),
    defineField({ name: "serviceArea", title: "Service-area copy", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description", 4)] }),
    defineField({ name: "cta", title: "Final call to action", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description")] }),
    defineField({ name: "advanced", title: "Advanced labels and SEO", type: "object", options: advancedOptions, validation: (rule) => rule.required(), fields: [
      ...["introductionEyebrow", "supportedEventsEyebrow", "supportOptionsEyebrow", "serviceAreaEyebrow", "ctaEyebrow", "ctaPrimaryLabel", "ctaSecondaryLabel"].map(label), seoField,
    ] }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});

export const packagesPageType = defineType({
  name: "packagesPage", title: "Packages Page", type: "document",
  initialValue: { heading: f.packages.introduction.heading, description: f.packages.introduction.description, advanced: { _type: "object", eyebrow: f.packages.introduction.eyebrow, ...f.packages.labels, seo: seo(f.packages.seo) } },
  fields: [
    requiredString("heading", "Heading"), requiredText("description", "Introduction", 4),
    defineField({ name: "advanced", title: "Advanced labels and SEO", type: "object", options: advancedOptions, validation: (rule) => rule.required(), fields: [
      ...["eyebrow", "bestFor", "eventSize", "rentalPeriod", "includes", "cardAvailability", "cardDetails", "backToPackages", "detailIncludes", "detailAddons", "detailAvailability", "detailBrowse"].map(label), seoField,
    ] }),
  ],
  preview: { prepare: () => ({ title: "Packages Page" }) },
});

export const quotePageType = defineType({
  name: "quotePage", title: "Quote Page", type: "document",
  initialValue: { heading: f.quote.introduction.heading, description: f.quote.introduction.description, nextSteps: steps(f.quote.nextSteps), advanced: { _type: "object", eyebrow: f.quote.introduction.eyebrow, nextStepsHeading: f.quote.nextStepsHeading, emailPrompt: f.quote.emailPrompt, seo: seo(f.quote.seo) } },
  fields: [
    requiredString("heading", "Heading"), requiredText("description", "Introduction", 4),
    defineField({ name: "nextSteps", title: "What happens next", type: "array", of: [defineArrayMember({ type: "contentStep" })], validation: (rule) => rule.required().min(1).max(5) }),
    defineField({ name: "advanced", title: "Advanced labels and SEO", type: "object", options: advancedOptions, validation: (rule) => rule.required(), fields: [label("eyebrow"), label("nextStepsHeading"), label("emailPrompt"), seoField] }),
  ],
  preview: { prepare: () => ({ title: "Quote Page" }) },
});

export const faqPageType = defineType({
  name: "faqPage", title: "FAQ Page", type: "document",
  initialValue: { heading: f.faq.introduction.heading, description: f.faq.introduction.description, cta: { _type: "object", heading: f.faq.cta.heading, description: f.faq.cta.description }, advanced: { _type: "object", eyebrow: f.faq.introduction.eyebrow, ctaEyebrow: f.faq.cta.eyebrow, ctaPrimaryLabel: f.faq.cta.primaryLabel, ctaSecondaryLabel: f.faq.cta.secondaryLabel, seo: seo(f.faq.seo) } },
  fields: [
    requiredString("heading", "Heading"), requiredText("description", "Introduction", 4),
    defineField({ name: "cta", title: "Final call to action", type: "object", validation: (rule) => rule.required(), fields: [requiredString("heading", "Heading"), requiredText("description", "Description")] }),
    defineField({ name: "advanced", title: "Advanced labels and SEO", type: "object", options: advancedOptions, validation: (rule) => rule.required(), fields: [label("eyebrow"), label("ctaEyebrow"), label("ctaPrimaryLabel"), label("ctaSecondaryLabel"), seoField] }),
  ],
  preview: { prepare: () => ({ title: "FAQ Page" }) },
});
