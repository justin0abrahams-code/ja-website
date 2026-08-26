import { defineField, defineType } from "sanity";

export const marketingImageType = defineType({
  name: "marketingImage", title: "Marketing image", type: "image", options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Alternative text", description: "Meaningfully describe the image for visitors who cannot see it.", type: "string", validation: (rule) => rule.required().min(1) })],
  validation: (rule) => rule.required(),
});

export const contentListItemType = defineType({
  name: "contentListItem", title: "Item", type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required().min(1) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const contentStepType = defineType({
  name: "contentStep", title: "Step", type: "object",
  fields: [defineField({ name: "text", title: "Step", type: "string", validation: (rule) => rule.required().min(1) })],
  preview: { select: { title: "text" } },
});

export const seoOverrideType = defineType({
  name: "seoOverride", title: "Search and social sharing", type: "object",
  fields: [
    defineField({ name: "title", title: "Page title", description: "Leave empty to use the Site Settings default.", type: "string", validation: (rule) => rule.max(70) }),
    defineField({ name: "description", title: "Description", description: "Leave empty to use the Site Settings default.", type: "text", rows: 3, validation: (rule) => rule.max(180) }),
    defineField({ name: "socialImage", title: "Social image override", description: "Leave empty to use the Site Settings default social image.", type: "marketingImage" }),
  ],
});
