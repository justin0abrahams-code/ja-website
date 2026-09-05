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

export const siteContentQuery = defineQuery(`{
  "settings": *[_id == "siteSettings" && _type == "siteSettings"][0],
  "home": *[_id == "homePage" && _type == "homePage"][0],
  "about": *[_id == "aboutPage" && _type == "aboutPage"][0],
  "quote": *[_id == "quotePage" && _type == "quotePage"][0],
  "gallery": *[_id == "galleryPage" && _type == "galleryPage"][0],
  "faq": *[_id == "faqPage" && _type == "faqPage"][0]
}`);

export const siteContentWithPackagesQuery = defineQuery(`{
  "settings": *[_id == "siteSettings" && _type == "siteSettings"][0],
  "home": *[_id == "homePage" && _type == "homePage"][0],
  "about": *[_id == "aboutPage" && _type == "aboutPage"][0],
  "packages": *[_id == "packagesPage" && _type == "packagesPage"][0],
  "quote": *[_id == "quotePage" && _type == "quotePage"][0],
  "gallery": *[_id == "galleryPage" && _type == "galleryPage"][0],
  "faq": *[_id == "faqPage" && _type == "faqPage"][0]
}`);
