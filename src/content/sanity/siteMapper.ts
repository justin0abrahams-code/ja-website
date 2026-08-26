import type { SanityImageSource } from "@sanity/image-url";
import { z } from "zod";
import type { ContentImage, SeoContent, SiteContent } from "@/content/domain";
import { ContentValidationError } from "@/content/errors";

const text = z.string().trim().min(1);
const image = z.object({
  alt: text,
  asset: z.object({ _ref: text }),
  crop: z.object({ _type: z.string().optional(), top: z.number(), bottom: z.number(), left: z.number(), right: z.number() }).nullish(),
  hotspot: z.object({ _type: z.string().optional(), x: z.number(), y: z.number(), height: z.number(), width: z.number() }).nullish(),
}).passthrough();
const keyedText = z.object({ _key: text, text });
const listItem = z.object({ _key: text, title: text, description: text });
const seoOverride = z.object({ title: text.nullish(), description: text.nullish(), socialImage: image.nullish() }).nullish();
const singleton = <T extends string>(id: T, type: T) => ({ _id: z.literal(id), _type: z.literal(type) });

const settingsSchema = z.object({
  ...singleton("siteSettings", "siteSettings"),
  businessName: text, shortName: text, tagline: text, serviceArea: text, description: text, experience: text,
  defaultSocialImage: image,
  advanced: z.object({
    brandDescriptor: text, packagesLabel: text, quoteLabel: text, aboutLabel: text, faqLabel: text, ctaLabel: text,
    navigationHeading: text, serviceAreaHeading: text, footerPackagesLabel: text, footerQuoteLabel: text,
    footerAboutLabel: text, footerFaqLabel: text, footerServiceAreaDescription: text, footerCtaLabel: text,
    defaultSeoTitle: text, defaultSeoDescription: text,
  }),
});

const homeSchema = z.object({
  ...singleton("homePage", "homePage"),
  hero: z.object({ heading: text, tagline: text, description: text, image, imageDescription: text }),
  proofPoints: z.array(keyedText).length(3),
  featuredPackages: z.object({ heading: text, description: text }),
  upgrades: z.object({ heading: text, description: text, items: z.array(listItem).min(1).max(6) }),
  process: z.object({ heading: text, description: text, image, steps: z.array(keyedText).min(2).max(5) }),
  eventTypes: z.object({ heading: text, items: z.array(listItem).min(1).max(6) }),
  cta: z.object({ heading: text, description: text, image }),
  advanced: z.object({
    heroEyebrow: text, heroPrimaryLabel: text, heroSecondaryLabel: text, heroImageEyebrow: text,
    featuredEyebrow: text, featuredLinkLabel: text, upgradesEyebrow: text, upgradesLinkLabel: text,
    processEyebrow: text, processStepLabel: text, eventTypesEyebrow: text,
    ctaEyebrow: text, ctaPrimaryLabel: text, ctaSecondaryLabel: text, seo: seoOverride,
  }),
});

const aboutSchema = z.object({
  ...singleton("aboutPage", "aboutPage"),
  introduction: z.object({ heading: text, description: text, secondaryDescription: text }),
  heroImage: image,
  supportedEvents: z.object({ heading: text, items: z.array(keyedText).min(1).max(8) }),
  supportOptions: z.object({ heading: text, items: z.array(keyedText).min(1).max(8) }),
  serviceArea: z.object({ heading: text, description: text }),
  cta: z.object({ heading: text, description: text }),
  advanced: z.object({ introductionEyebrow: text, supportedEventsEyebrow: text, supportOptionsEyebrow: text, serviceAreaEyebrow: text, ctaEyebrow: text, ctaPrimaryLabel: text, ctaSecondaryLabel: text, seo: seoOverride }),
});

const packagesSchema = z.object({
  ...singleton("packagesPage", "packagesPage"), heading: text, description: text,
  advanced: z.object({ eyebrow: text, bestFor: text, eventSize: text, rentalPeriod: text, includes: text, cardAvailability: text, cardDetails: text, backToPackages: text, detailIncludes: text, detailAddons: text, detailAvailability: text, detailBrowse: text, seo: seoOverride }),
});

const quoteSchema = z.object({
  ...singleton("quotePage", "quotePage"), heading: text, description: text, nextSteps: z.array(keyedText).min(1).max(5),
  advanced: z.object({ eyebrow: text, nextStepsHeading: text, emailPrompt: text, seo: seoOverride }),
});

const faqPageSchema = z.object({
  ...singleton("faqPage", "faqPage"), heading: text, description: text, cta: z.object({ heading: text, description: text }),
  advanced: z.object({ eyebrow: text, ctaEyebrow: text, ctaPrimaryLabel: text, ctaSecondaryLabel: text, seo: seoOverride }),
});

const responseSchema = z.object({ settings: settingsSchema, home: homeSchema, about: aboutSchema, packages: packagesSchema, quote: quoteSchema, faq: faqPageSchema });
const absoluteUrl = z.string().url();
export type SiteImageUrlResolver = (source: SanityImageSource) => string;

function validationError(error: z.ZodError) {
  const details = error.issues.map((issue) => `${issue.path.length ? issue.path.join(".") : "root"}: ${issue.message}`).join("; ");
  return new ContentValidationError(`Invalid published Sanity site content: ${details}`);
}

function resolveImage(value: z.infer<typeof image>, label: string, resolveImageUrl: SiteImageUrlResolver): ContentImage {
  let resolved: string;
  try { resolved = resolveImageUrl(value as SanityImageSource); }
  catch (cause) { throw new ContentValidationError(`Invalid published Sanity ${label}: image URL could not be resolved.`, { cause }); }
  const url = absoluteUrl.safeParse(resolved);
  if (!url.success) throw new ContentValidationError(`Invalid published Sanity ${label}: image URL is not absolute.`);
  return { src: url.data, alt: value.alt };
}

function resolveSeo(value: z.infer<typeof seoOverride>, defaults: SeoContent, label: string, resolveImageUrl: SiteImageUrlResolver): SeoContent {
  return {
    title: value?.title ?? defaults.title,
    description: value?.description ?? defaults.description,
    socialImage: value?.socialImage ? resolveImage(value.socialImage, `${label} social image`, resolveImageUrl) : defaults.socialImage,
  };
}

export function mapSanitySiteContent(input: unknown, resolveImageUrl: SiteImageUrlResolver): SiteContent {
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);

  const { settings, home, about, packages, quote, faq } = parsed.data;
  const defaultSeo: SeoContent = {
    title: settings.advanced.defaultSeoTitle,
    description: settings.advanced.defaultSeoDescription,
    socialImage: resolveImage(settings.defaultSocialImage, "Site Settings default social image", resolveImageUrl),
  };

  return {
    settings: {
      businessName: settings.businessName, shortName: settings.shortName, tagline: settings.tagline,
      serviceArea: settings.serviceArea, description: settings.description, experience: settings.experience,
      header: {
        brandDescriptor: settings.advanced.brandDescriptor, packagesLabel: settings.advanced.packagesLabel,
        quoteLabel: settings.advanced.quoteLabel, aboutLabel: settings.advanced.aboutLabel,
        faqLabel: settings.advanced.faqLabel, ctaLabel: settings.advanced.ctaLabel,
      },
      footer: {
        navigationHeading: settings.advanced.navigationHeading, serviceAreaHeading: settings.advanced.serviceAreaHeading,
        packagesLabel: settings.advanced.footerPackagesLabel, quoteLabel: settings.advanced.footerQuoteLabel,
        aboutLabel: settings.advanced.footerAboutLabel, faqLabel: settings.advanced.footerFaqLabel,
        serviceAreaDescription: settings.advanced.footerServiceAreaDescription, ctaLabel: settings.advanced.footerCtaLabel,
      },
      seo: defaultSeo,
    },
    home: {
      hero: {
        eyebrow: home.advanced.heroEyebrow, heading: home.hero.heading, tagline: home.hero.tagline,
        description: home.hero.description, primaryLabel: home.advanced.heroPrimaryLabel,
        secondaryLabel: home.advanced.heroSecondaryLabel,
        image: resolveImage(home.hero.image, "Home Page hero image", resolveImageUrl),
        imageEyebrow: home.advanced.heroImageEyebrow, imageDescription: home.hero.imageDescription,
      },
      proofPoints: home.proofPoints.map(({ _key, text }) => ({ key: _key, text })),
      featuredPackages: { eyebrow: home.advanced.featuredEyebrow, heading: home.featuredPackages.heading, description: home.featuredPackages.description, linkLabel: home.advanced.featuredLinkLabel },
      upgrades: { eyebrow: home.advanced.upgradesEyebrow, heading: home.upgrades.heading, description: home.upgrades.description, linkLabel: home.advanced.upgradesLinkLabel, items: home.upgrades.items.map(({ _key, title, description }) => ({ key: _key, title, description })) },
      process: { eyebrow: home.advanced.processEyebrow, heading: home.process.heading, description: home.process.description, image: resolveImage(home.process.image, "Home Page process image", resolveImageUrl), stepLabel: home.advanced.processStepLabel, steps: home.process.steps.map(({ _key, text }) => ({ key: _key, text })) },
      eventTypes: { eyebrow: home.advanced.eventTypesEyebrow, heading: home.eventTypes.heading, items: home.eventTypes.items.map(({ _key, title, description }) => ({ key: _key, title, description })) },
      cta: { eyebrow: home.advanced.ctaEyebrow, heading: home.cta.heading, description: home.cta.description, primaryLabel: home.advanced.ctaPrimaryLabel, secondaryLabel: home.advanced.ctaSecondaryLabel, image: resolveImage(home.cta.image, "Home Page final call-to-action image", resolveImageUrl) },
      seo: resolveSeo(home.advanced.seo, defaultSeo, "Home Page", resolveImageUrl),
    },
    about: {
      introduction: { eyebrow: about.advanced.introductionEyebrow, heading: about.introduction.heading, description: about.introduction.description, secondaryDescription: about.introduction.secondaryDescription },
      heroImage: resolveImage(about.heroImage, "About Page hero image", resolveImageUrl),
      supportedEvents: { eyebrow: about.advanced.supportedEventsEyebrow, heading: about.supportedEvents.heading, items: about.supportedEvents.items.map(({ _key, text }) => ({ key: _key, text })) },
      supportOptions: { eyebrow: about.advanced.supportOptionsEyebrow, heading: about.supportOptions.heading, items: about.supportOptions.items.map(({ _key, text }) => ({ key: _key, text })) },
      serviceArea: { eyebrow: about.advanced.serviceAreaEyebrow, heading: about.serviceArea.heading, description: about.serviceArea.description },
      cta: { eyebrow: about.advanced.ctaEyebrow, heading: about.cta.heading, description: about.cta.description, primaryLabel: about.advanced.ctaPrimaryLabel, secondaryLabel: about.advanced.ctaSecondaryLabel },
      seo: resolveSeo(about.advanced.seo, defaultSeo, "About Page", resolveImageUrl),
    },
    packages: {
      introduction: { eyebrow: packages.advanced.eyebrow, heading: packages.heading, description: packages.description },
      labels: {
        bestFor: packages.advanced.bestFor, eventSize: packages.advanced.eventSize,
        rentalPeriod: packages.advanced.rentalPeriod, includes: packages.advanced.includes,
        cardAvailability: packages.advanced.cardAvailability, cardDetails: packages.advanced.cardDetails,
        backToPackages: packages.advanced.backToPackages, detailIncludes: packages.advanced.detailIncludes,
        detailAddons: packages.advanced.detailAddons, detailAvailability: packages.advanced.detailAvailability,
        detailBrowse: packages.advanced.detailBrowse,
      },
      seo: resolveSeo(packages.advanced.seo, defaultSeo, "Packages Page", resolveImageUrl),
    },
    quote: {
      introduction: { eyebrow: quote.advanced.eyebrow, heading: quote.heading, description: quote.description },
      nextStepsHeading: quote.advanced.nextStepsHeading,
      nextSteps: quote.nextSteps.map(({ _key, text }) => ({ key: _key, text })),
      emailPrompt: quote.advanced.emailPrompt,
      seo: resolveSeo(quote.advanced.seo, defaultSeo, "Quote Page", resolveImageUrl),
    },
    faq: {
      introduction: { eyebrow: faq.advanced.eyebrow, heading: faq.heading, description: faq.description },
      cta: { eyebrow: faq.advanced.ctaEyebrow, heading: faq.cta.heading, description: faq.cta.description, primaryLabel: faq.advanced.ctaPrimaryLabel, secondaryLabel: faq.advanced.ctaSecondaryLabel },
      seo: resolveSeo(faq.advanced.seo, defaultSeo, "FAQ Page", resolveImageUrl),
    },
  };
}
