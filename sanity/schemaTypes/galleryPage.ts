import { defineArrayMember, defineField, defineType } from "sanity";
import { fixtureSiteContent } from "../../src/content/fixtures/siteContent";

const content = fixtureSiteContent.gallery;

export const galleryPageType = defineType({
  name: "galleryPage",
  title: "Gallery Page",
  type: "document",
  initialValue: {
    heading: content.introduction.heading,
    description: content.introduction.description,
    photos: [],
    advanced: { eyebrow: content.introduction.eyebrow, seo: { title: content.seo.title, description: content.seo.description } },
  },
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().min(1) }),
    defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required().min(1) }),
    defineField({
      name: "photos", title: "Gallery photos", type: "array",
      description: "Add up to 10 photos. Drag to change their order on the website. Publish, then rebuild the website to show your changes.",
      validation: (rule) => rule.required().max(10),
      of: [defineArrayMember({
        name: "galleryPhoto", title: "Photo", type: "image", options: { hotspot: true },
        validation: (rule) => rule.required().assetRequired(),
        fields: [
          defineField({ name: "alt", title: "Alternative text", description: "Describe what is visible for visitors using a screen reader.", type: "string", validation: (rule) => rule.required().min(1) }),
          defineField({ name: "caption", title: "Caption", type: "string", validation: (rule) => rule.max(160) }),
        ],
        preview: { select: { title: "caption", subtitle: "alt", media: "asset" }, prepare: ({ title, subtitle, media }) => ({ title: title || subtitle || "Gallery photo", subtitle, media }) },
      })],
    }),
    defineField({
      name: "advanced", title: "Advanced labels and SEO", type: "object",
      options: { collapsible: true, collapsed: true }, validation: (rule) => rule.required(),
      fields: [
        defineField({ name: "eyebrow", title: "Page eyebrow", type: "string", validation: (rule) => rule.required().min(1) }),
        defineField({ name: "seo", title: "Search and social sharing", type: "seoOverride" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Gallery Page" }) },
});
