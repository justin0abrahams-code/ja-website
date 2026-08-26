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
