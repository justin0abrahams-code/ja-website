import { PACKAGES_ENABLED } from "../src/features";
import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = ["siteSettings", "homePage", "aboutPage", "packagesPage", "quotePage", "faqPage", "galleryPage"] as const;
const titles: Record<(typeof SINGLETON_TYPES)[number], string> = { siteSettings: "Site Settings", homePage: "Home Page", aboutPage: "About Page", packagesPage: "Packages Page", quotePage: "Quote Page", faqPage: "FAQ Page", galleryPage: "Gallery Page" };

export const structure: StructureResolver = (S) => S.list().title("Website Content").items([
  ...SINGLETON_TYPES.filter((typeName) => PACKAGES_ENABLED || typeName !== "packagesPage").map((typeName) => S.listItem().title(titles[typeName]).id(typeName).child(S.document().schemaType(typeName).documentId(typeName).title(titles[typeName]))),
  S.divider(),
  ...(PACKAGES_ENABLED ? [S.documentTypeListItem("rentalPackage").title("Rental Packages")] : []),
  S.documentTypeListItem("faq").title("FAQs"),
]);
