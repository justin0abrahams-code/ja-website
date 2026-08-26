import type { SiteContent } from "../../src/content/domain";
import { fixtureSiteContent as fallback } from "../../src/content/fixtures/siteContent";
import type { PreviewDocumentStatus, PreviewStatusResult } from "./model";

export type PreviewSingletonKey = "settings" | "home" | "about" | "packages" | "quote" | "faq";
export type PreviewSingletonType = "siteSettings" | "homePage" | "aboutPage" | "packagesPage" | "quotePage" | "faqPage";
export interface PreviewPageState { id: PreviewSingletonType; type: PreviewSingletonType; status: PreviewDocumentStatus; issues: string[]; }
export interface PreviewSiteData {
  content: SiteContent;
  pages: Record<PreviewSingletonKey, PreviewPageState>;
  images: Record<"defaultSocial" | "homeHero" | "homeProcess" | "homeCta" | "aboutHero", Record<string, unknown> | null>;
}

const types: Record<PreviewSingletonKey, PreviewSingletonType> = { settings: "siteSettings", home: "homePage", about: "aboutPage", packages: "packagesPage", quote: "quotePage", faq: "faqPage" };
const labels: Record<PreviewSingletonKey, string> = { settings: "Site Settings", home: "Home Page", about: "About Page", packages: "Packages Page", quote: "Quote Page", faq: "FAQ Page" };
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const record = (value: unknown) => isRecord(value) ? value : {};
const string = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : undefined;
const canonical = (id: string) => id.replace(/^drafts\./, "");
const ids = (value: unknown) => new Set(Array.isArray(value) ? value.flatMap((item) => string(item) ? [canonical(string(item)!)] : []) : []);

function status(id: string, result: PreviewStatusResult): PreviewDocumentStatus {
  const draftIds = ids(result.draftIds);
  if (!draftIds.has(id)) return "published";
  return ids(result.publishedIds).has(id) ? "changed" : "new";
}

function value(raw: unknown, fallbackValue: string, issues: string[], issue: string) {
  const result = string(raw);
  if (!result) issues.push(issue);
  return result ?? fallbackValue;
}

function keyedText(raw: unknown, fallbackValue: readonly { key: string; text: string }[], issues: string[], issue: string, min: number, max: number) {
  const result = Array.isArray(raw) ? raw.flatMap((item, index) => {
    const entry = record(item); const text = string(entry.text);
    return text ? [{ key: string(entry._key) ?? `preview-${index}`, text }] : [];
  }) : [];
  if (result.length < min || result.length > max) issues.push(issue);
  return result.length ? result : [...fallbackValue];
}

function listItems(raw: unknown, fallbackValue: readonly { key: string; title: string; description: string }[], issues: string[], issue: string, min: number, max: number) {
  const result = Array.isArray(raw) ? raw.flatMap((item, index) => {
    const entry = record(item); const title = string(entry.title); const description = string(entry.description);
    return title && description ? [{ key: string(entry._key) ?? `preview-${index}`, title, description }] : [];
  }) : [];
  if (result.length < min || result.length > max) issues.push(issue);
  return result.length ? result : [...fallbackValue];
}

function image(raw: unknown, fallbackAlt: string, issues: string[], issue: string) {
  const item = isRecord(raw) ? raw : null;
  const hasAsset = Boolean(item && isRecord(item.asset) && string(item.asset._ref));
  const alt = item ? string(item.alt) : undefined;
  if (!hasAsset) issues.push(issue);
  if (!alt) issues.push(`${issue}: add alternative text`);
  return { raw: hasAsset ? item : null, value: { src: "", alt: alt ?? fallbackAlt } };
}

export function normalizePreviewSite(input: unknown, statusResult: PreviewStatusResult): PreviewSiteData {
  const root = record(input);
  const documents = record(root.site);
  const raw = Object.fromEntries((Object.keys(types) as PreviewSingletonKey[]).map((key) => [key, record(documents[key])])) as Record<PreviewSingletonKey, Record<string, unknown>>;
  const issueMap = Object.fromEntries((Object.keys(types) as PreviewSingletonKey[]).map((key) => [key, [] as string[]])) as Record<PreviewSingletonKey, string[]>;
  for (const key of Object.keys(types) as PreviewSingletonKey[]) if (!string(raw[key]._id)) issueMap[key].push(`${labels[key]} has not been created in this view`);
  const advanced = Object.fromEntries((Object.keys(types) as PreviewSingletonKey[]).map((key) => [key, record(raw[key].advanced)])) as Record<PreviewSingletonKey, Record<string, unknown>>;
  const settingsImage = image(raw.settings.defaultSocialImage, fallback.settings.seo.socialImage.alt, issueMap.settings, "Choose the default social image");
  const defaultSeo = {
    title: value(advanced.settings.defaultSeoTitle, fallback.settings.seo.title, issueMap.settings, "Add the default SEO title"),
    description: value(advanced.settings.defaultSeoDescription, fallback.settings.seo.description, issueMap.settings, "Add the default SEO description"),
    socialImage: settingsImage.value,
  };
  const pageSeo = (key: Exclude<PreviewSingletonKey, "settings">) => {
    const seo = record(advanced[key].seo);
    const social = isRecord(seo.socialImage) ? image(seo.socialImage, defaultSeo.socialImage.alt, issueMap[key], "Complete the social image override") : null;
    return { title: string(seo.title) ?? defaultSeo.title, description: string(seo.description) ?? defaultSeo.description, socialImage: social?.value ?? defaultSeo.socialImage };
  };
  const homeHero = record(raw.home.hero), featured = record(raw.home.featuredPackages), upgrades = record(raw.home.upgrades), process = record(raw.home.process), eventTypes = record(raw.home.eventTypes), homeCta = record(raw.home.cta);
  const homeHeroImage = image(homeHero.image, fallback.home.hero.image.alt, issueMap.home, "Choose the hero image");
  const homeProcessImage = image(process.image, fallback.home.process.image.alt, issueMap.home, "Choose the process image");
  const homeCtaImage = image(homeCta.image, fallback.home.cta.image.alt, issueMap.home, "Choose the final call-to-action image");
  const aboutIntro = record(raw.about.introduction), supported = record(raw.about.supportedEvents), support = record(raw.about.supportOptions), serviceArea = record(raw.about.serviceArea), aboutCta = record(raw.about.cta);
  const aboutHeroImage = image(raw.about.heroImage, fallback.about.heroImage.alt, issueMap.about, "Choose the About hero image");
  const faqCta = record(raw.faq.cta);

  const content: SiteContent = {
    settings: {
      businessName: value(raw.settings.businessName, fallback.settings.businessName, issueMap.settings, "Add the business name"), shortName: value(raw.settings.shortName, fallback.settings.shortName, issueMap.settings, "Add the short name"), tagline: value(raw.settings.tagline, fallback.settings.tagline, issueMap.settings, "Add the tagline"), serviceArea: value(raw.settings.serviceArea, fallback.settings.serviceArea, issueMap.settings, "Add the service area"), description: value(raw.settings.description, fallback.settings.description, issueMap.settings, "Add the business description"), experience: value(raw.settings.experience, fallback.settings.experience, issueMap.settings, "Add the experience statement"),
      header: { brandDescriptor: value(advanced.settings.brandDescriptor, fallback.settings.header.brandDescriptor, issueMap.settings, "Add the header brand descriptor"), packagesLabel: value(advanced.settings.packagesLabel, fallback.settings.header.packagesLabel, issueMap.settings, "Add the header packages label"), quoteLabel: value(advanced.settings.quoteLabel, fallback.settings.header.quoteLabel, issueMap.settings, "Add the header quote label"), aboutLabel: value(advanced.settings.aboutLabel, fallback.settings.header.aboutLabel, issueMap.settings, "Add the header About label"), faqLabel: value(advanced.settings.faqLabel, fallback.settings.header.faqLabel, issueMap.settings, "Add the header FAQ label"), ctaLabel: value(advanced.settings.ctaLabel, fallback.settings.header.ctaLabel, issueMap.settings, "Add the header call-to-action label") },
      footer: { navigationHeading: value(advanced.settings.navigationHeading, fallback.settings.footer.navigationHeading, issueMap.settings, "Add the footer navigation heading"), serviceAreaHeading: value(advanced.settings.serviceAreaHeading, fallback.settings.footer.serviceAreaHeading, issueMap.settings, "Add the footer service-area heading"), packagesLabel: value(advanced.settings.footerPackagesLabel, fallback.settings.footer.packagesLabel, issueMap.settings, "Add the footer packages label"), quoteLabel: value(advanced.settings.footerQuoteLabel, fallback.settings.footer.quoteLabel, issueMap.settings, "Add the footer quote label"), aboutLabel: value(advanced.settings.footerAboutLabel, fallback.settings.footer.aboutLabel, issueMap.settings, "Add the footer About label"), faqLabel: value(advanced.settings.footerFaqLabel, fallback.settings.footer.faqLabel, issueMap.settings, "Add the footer FAQ label"), serviceAreaDescription: value(advanced.settings.footerServiceAreaDescription, fallback.settings.footer.serviceAreaDescription, issueMap.settings, "Add the footer service-area description"), ctaLabel: value(advanced.settings.footerCtaLabel, fallback.settings.footer.ctaLabel, issueMap.settings, "Add the footer call-to-action label") }, seo: defaultSeo,
    },
    home: {
      hero: { eyebrow: value(advanced.home.heroEyebrow, fallback.home.hero.eyebrow, issueMap.home, "Add the hero eyebrow"), heading: value(homeHero.heading, fallback.home.hero.heading, issueMap.home, "Add the hero heading"), tagline: value(homeHero.tagline, fallback.home.hero.tagline, issueMap.home, "Add the hero tagline"), description: value(homeHero.description, fallback.home.hero.description, issueMap.home, "Add the hero description"), primaryLabel: value(advanced.home.heroPrimaryLabel, fallback.home.hero.primaryLabel, issueMap.home, "Add the hero primary label"), secondaryLabel: value(advanced.home.heroSecondaryLabel, fallback.home.hero.secondaryLabel, issueMap.home, "Add the hero secondary label"), image: homeHeroImage.value, imageEyebrow: value(advanced.home.heroImageEyebrow, fallback.home.hero.imageEyebrow, issueMap.home, "Add the hero image eyebrow"), imageDescription: value(homeHero.imageDescription, fallback.home.hero.imageDescription, issueMap.home, "Add the hero image caption") },
      proofPoints: keyedText(raw.home.proofPoints, fallback.home.proofPoints, issueMap.home, "Add exactly three proof points", 3, 3),
      featuredPackages: { eyebrow: value(advanced.home.featuredEyebrow, fallback.home.featuredPackages.eyebrow, issueMap.home, "Add the featured-packages eyebrow"), heading: value(featured.heading, fallback.home.featuredPackages.heading, issueMap.home, "Add the featured-packages heading"), description: value(featured.description, fallback.home.featuredPackages.description, issueMap.home, "Add the featured-packages description"), linkLabel: value(advanced.home.featuredLinkLabel, fallback.home.featuredPackages.linkLabel, issueMap.home, "Add the featured-packages link label") },
      upgrades: { eyebrow: value(advanced.home.upgradesEyebrow, fallback.home.upgrades.eyebrow, issueMap.home, "Add the upgrades eyebrow"), heading: value(upgrades.heading, fallback.home.upgrades.heading, issueMap.home, "Add the upgrades heading"), description: value(upgrades.description, fallback.home.upgrades.description, issueMap.home, "Add the upgrades description"), items: listItems(upgrades.items, fallback.home.upgrades.items, issueMap.home, "Add one to six complete upgrades", 1, 6), linkLabel: value(advanced.home.upgradesLinkLabel, fallback.home.upgrades.linkLabel, issueMap.home, "Add the upgrades link label") },
      process: { eyebrow: value(advanced.home.processEyebrow, fallback.home.process.eyebrow, issueMap.home, "Add the process eyebrow"), heading: value(process.heading, fallback.home.process.heading, issueMap.home, "Add the process heading"), description: value(process.description, fallback.home.process.description, issueMap.home, "Add the process description"), image: homeProcessImage.value, steps: keyedText(process.steps, fallback.home.process.steps, issueMap.home, "Add two to five process steps", 2, 5), stepLabel: value(advanced.home.processStepLabel, fallback.home.process.stepLabel, issueMap.home, "Add the step label") },
      eventTypes: { eyebrow: value(advanced.home.eventTypesEyebrow, fallback.home.eventTypes.eyebrow, issueMap.home, "Add the event-types eyebrow"), heading: value(eventTypes.heading, fallback.home.eventTypes.heading, issueMap.home, "Add the event-types heading"), items: listItems(eventTypes.items, fallback.home.eventTypes.items, issueMap.home, "Add one to six complete event types", 1, 6) },
      cta: { eyebrow: value(advanced.home.ctaEyebrow, fallback.home.cta.eyebrow, issueMap.home, "Add the final call-to-action eyebrow"), heading: value(homeCta.heading, fallback.home.cta.heading, issueMap.home, "Add the final call-to-action heading"), description: value(homeCta.description, fallback.home.cta.description, issueMap.home, "Add the final call-to-action description"), primaryLabel: value(advanced.home.ctaPrimaryLabel, fallback.home.cta.primaryLabel, issueMap.home, "Add the primary call-to-action label"), secondaryLabel: value(advanced.home.ctaSecondaryLabel, fallback.home.cta.secondaryLabel, issueMap.home, "Add the secondary call-to-action label"), image: homeCtaImage.value }, seo: pageSeo("home"),
    },
    about: {
      introduction: { eyebrow: value(advanced.about.introductionEyebrow, fallback.about.introduction.eyebrow, issueMap.about, "Add the introduction eyebrow"), heading: value(aboutIntro.heading, fallback.about.introduction.heading, issueMap.about, "Add the introduction heading"), description: value(aboutIntro.description, fallback.about.introduction.description, issueMap.about, "Add the introduction"), secondaryDescription: value(aboutIntro.secondaryDescription, fallback.about.introduction.secondaryDescription, issueMap.about, "Add the additional introduction") },
      heroImage: aboutHeroImage.value,
      supportedEvents: { eyebrow: value(advanced.about.supportedEventsEyebrow, fallback.about.supportedEvents.eyebrow, issueMap.about, "Add the supported-events eyebrow"), heading: value(supported.heading, fallback.about.supportedEvents.heading, issueMap.about, "Add the supported-events heading"), items: keyedText(supported.items, fallback.about.supportedEvents.items, issueMap.about, "Add one to eight supported event types", 1, 8) },
      supportOptions: { eyebrow: value(advanced.about.supportOptionsEyebrow, fallback.about.supportOptions.eyebrow, issueMap.about, "Add the support-options eyebrow"), heading: value(support.heading, fallback.about.supportOptions.heading, issueMap.about, "Add the support-options heading"), items: keyedText(support.items, fallback.about.supportOptions.items, issueMap.about, "Add one to eight support options", 1, 8) },
      serviceArea: { eyebrow: value(advanced.about.serviceAreaEyebrow, fallback.about.serviceArea.eyebrow, issueMap.about, "Add the service-area eyebrow"), heading: value(serviceArea.heading, fallback.about.serviceArea.heading, issueMap.about, "Add the service-area heading"), description: value(serviceArea.description, fallback.about.serviceArea.description, issueMap.about, "Add the service-area description") },
      cta: { eyebrow: value(advanced.about.ctaEyebrow, fallback.about.cta.eyebrow, issueMap.about, "Add the call-to-action eyebrow"), heading: value(aboutCta.heading, fallback.about.cta.heading, issueMap.about, "Add the call-to-action heading"), description: value(aboutCta.description, fallback.about.cta.description, issueMap.about, "Add the call-to-action description"), primaryLabel: value(advanced.about.ctaPrimaryLabel, fallback.about.cta.primaryLabel, issueMap.about, "Add the primary call-to-action label"), secondaryLabel: value(advanced.about.ctaSecondaryLabel, fallback.about.cta.secondaryLabel, issueMap.about, "Add the secondary call-to-action label") }, seo: pageSeo("about"),
    },
    packages: {
      introduction: { eyebrow: value(advanced.packages.eyebrow, fallback.packages.introduction.eyebrow, issueMap.packages, "Add the page eyebrow"), heading: value(raw.packages.heading, fallback.packages.introduction.heading, issueMap.packages, "Add the page heading"), description: value(raw.packages.description, fallback.packages.introduction.description, issueMap.packages, "Add the page introduction") },
      labels: Object.fromEntries(Object.entries(fallback.packages.labels).map(([key, fallbackValue]) => [key, value(advanced.packages[key], fallbackValue, issueMap.packages, `Add the ${key} label`)])) as unknown as SiteContent["packages"]["labels"],
      seo: pageSeo("packages"),
    },
    quote: {
      introduction: { eyebrow: value(advanced.quote.eyebrow, fallback.quote.introduction.eyebrow, issueMap.quote, "Add the page eyebrow"), heading: value(raw.quote.heading, fallback.quote.introduction.heading, issueMap.quote, "Add the page heading"), description: value(raw.quote.description, fallback.quote.introduction.description, issueMap.quote, "Add the page introduction") },
      nextStepsHeading: value(advanced.quote.nextStepsHeading, fallback.quote.nextStepsHeading, issueMap.quote, "Add the next-steps heading"),
      nextSteps: keyedText(raw.quote.nextSteps, fallback.quote.nextSteps, issueMap.quote, "Add one to five next steps", 1, 5),
      emailPrompt: value(advanced.quote.emailPrompt, fallback.quote.emailPrompt, issueMap.quote, "Add the email prompt"), seo: pageSeo("quote"),
    },
    faq: {
      introduction: { eyebrow: value(advanced.faq.eyebrow, fallback.faq.introduction.eyebrow, issueMap.faq, "Add the page eyebrow"), heading: value(raw.faq.heading, fallback.faq.introduction.heading, issueMap.faq, "Add the page heading"), description: value(raw.faq.description, fallback.faq.introduction.description, issueMap.faq, "Add the page introduction") },
      cta: { eyebrow: value(advanced.faq.ctaEyebrow, fallback.faq.cta.eyebrow, issueMap.faq, "Add the call-to-action eyebrow"), heading: value(faqCta.heading, fallback.faq.cta.heading, issueMap.faq, "Add the call-to-action heading"), description: value(faqCta.description, fallback.faq.cta.description, issueMap.faq, "Add the call-to-action description"), primaryLabel: value(advanced.faq.ctaPrimaryLabel, fallback.faq.cta.primaryLabel, issueMap.faq, "Add the primary call-to-action label"), secondaryLabel: value(advanced.faq.ctaSecondaryLabel, fallback.faq.cta.secondaryLabel, issueMap.faq, "Add the secondary call-to-action label") }, seo: pageSeo("faq"),
    },
  };

  return {
    content,
    pages: Object.fromEntries((Object.keys(types) as PreviewSingletonKey[]).map((key) => [key, { id: types[key], type: types[key], status: status(types[key], statusResult), issues: [...new Set(issueMap[key])] }])) as PreviewSiteData["pages"],
    images: { defaultSocial: settingsImage.raw, homeHero: homeHeroImage.raw, homeProcess: homeProcessImage.raw, homeCta: homeCtaImage.raw, aboutHero: aboutHeroImage.raw },
  };
}
