export const PACKAGE_CATEGORIES = [
  "Presentation",
  "Wedding",
  "Live Music",
  "Lighting",
  "Party",
  "Sound",
  "Custom",
] as const;

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

export interface ContentImage {
  src: string;
  alt: string;
}

export interface RentalPackage {
  slug: string;
  name: string;
  category: PackageCategory;
  bestFor: string;
  eventSize: string;
  includes: string[];
  addons: string[];
  description: string;
  image: ContentImage;
  rentalPeriod?: string;
  featured: boolean;
  displayOrder: number;
}

export interface Faq {
  question: string;
  answer: string;
  displayOrder: number;
}

export interface ContentListItem { key: string; title: string; description: string; }
export interface ContentStep { key: string; text: string; }
export interface SeoContent { title: string; description: string; socialImage: ContentImage; }
export interface PageIntroduction { eyebrow: string; heading: string; description: string; }
export interface CtaContent { eyebrow: string; heading: string; description: string; primaryLabel: string; secondaryLabel?: string; }

export interface SiteSettingsContent {
  businessName: string;
  shortName: string;
  tagline: string;
  serviceArea: string;
  description: string;
  experience: string;
  header: { brandDescriptor: string; packagesLabel?: string; quoteLabel: string; aboutLabel: string; faqLabel: string; galleryLabel: string; ctaLabel: string; };
  footer: { navigationHeading: string; serviceAreaHeading: string; packagesLabel?: string; quoteLabel: string; aboutLabel: string; faqLabel: string; galleryLabel: string; serviceAreaDescription: string; ctaLabel: string; };
  seo: SeoContent;
}

export interface HomePageContent {
  hero: { eyebrow: string; heading: string; tagline: string; description: string; primaryLabel?: string; secondaryLabel: string; image: ContentImage; imageEyebrow: string; imageDescription: string; };
  proofPoints: ContentStep[];
  featuredPackages?: PageIntroduction & { linkLabel: string };
  upgrades: PageIntroduction & { items: ContentListItem[]; linkLabel?: string };
  process: PageIntroduction & { image: ContentImage; steps: ContentStep[]; stepLabel: string };
  eventTypes: Omit<PageIntroduction, "description"> & { items: ContentListItem[] };
  cta: CtaContent & { image: ContentImage };
  seo: SeoContent;
}

export interface AboutPageContent {
  introduction: PageIntroduction & { secondaryDescription: string };
  heroImage: ContentImage;
  supportedEvents: Omit<PageIntroduction, "description"> & { items: ContentStep[] };
  supportOptions: Omit<PageIntroduction, "description"> & { items: ContentStep[] };
  serviceArea: PageIntroduction;
  cta: CtaContent;
  seo: SeoContent;
}

export interface PackageInterfaceLabels {
  bestFor: string; eventSize: string; rentalPeriod: string; includes: string;
  cardAvailability: string; cardDetails: string; backToPackages: string;
  detailIncludes: string; detailAddons: string; detailAvailability: string; detailBrowse: string;
}

export interface PackagesPageContent { introduction: PageIntroduction; labels: PackageInterfaceLabels; seo: SeoContent; }
export interface QuotePageContent { introduction: PageIntroduction; nextStepsHeading: string; nextSteps: ContentStep[]; emailPrompt: string; seo: SeoContent; }
export interface FaqPageContent { introduction: PageIntroduction; cta: CtaContent; seo: SeoContent; }
export interface GalleryPhoto extends ContentImage { key: string; caption?: string; }
export interface GalleryPageContent { introduction: PageIntroduction; photos: GalleryPhoto[]; seo: SeoContent; }
export interface SiteContent { settings: SiteSettingsContent; home: HomePageContent; about: AboutPageContent; packages?: PackagesPageContent; quote: QuotePageContent; faq: FaqPageContent; gallery: GalleryPageContent; }
