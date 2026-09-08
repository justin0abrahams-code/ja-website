import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      description: "Lower numbers appear first.",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "question", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});
