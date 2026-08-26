import { defineQuery } from "groq";

export const rentalPackagesQuery = defineQuery(`*[
  _type == "rentalPackage"
] | order(displayOrder asc, name asc) {
  _id,
  "slug": slug.current,
  name,
  category,
  description,
  bestFor,
  eventSize,
  includes,
  addons,
  rentalPeriod,
  featured,
  displayOrder,
  image {
    alt,
    asset,
    crop,
    hotspot
  }
}`);

export const faqsQuery = defineQuery(`*[
  _type == "faq"
] | order(displayOrder asc, question asc) {
  _id,
  question,
  answer,
  displayOrder
}`);
