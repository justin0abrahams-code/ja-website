import { defineArrayMember, defineField, defineType } from "sanity";
import { PACKAGES_ENABLED } from "../../src/features";
import { PACKAGE_CATEGORIES } from "../../src/content/domain";

export const rentalPackageType = defineType({
  name: "rentalPackage",
  title: "Rental Package",
  type: "document",
  readOnly: !PACKAGES_ENABLED,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: PACKAGE_CATEGORIES.map((category) => ({
          title: category,
          value: category,
        })),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "bestFor",
      title: "Best for",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "eventSize",
      title: "Event size",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "includes",
      title: "Included items",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.required().min(1),
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "addons",
      title: "Add-ons",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.required().min(1),
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "rentalPeriod",
      title: "Rental period",
      type: "string",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      description: "Lower numbers appear first.",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description: "Describe the image for visitors who cannot see it.",
          type: "string",
          validation: (rule) => rule.required().min(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "image",
    },
  },
});
