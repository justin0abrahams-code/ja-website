export type PackageCategory =
  | "Presentation"
  | "Wedding"
  | "Live Music"
  | "Lighting"
  | "Party"
  | "Sound"
  | "Custom";

export interface RentalPackage {
  slug: string;
  name: string;
  category: PackageCategory;
  bestFor: string;
  eventSize: string;
  startingPrice: string;
  includes: string[];
  addons: string[];
  description: string;
  imageSrc?: string;
  rentalPeriod?: string;
  featured?: boolean;
}
