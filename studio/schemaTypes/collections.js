import { defineField, defineType } from "sanity";

const sortOrder = defineField({ name: "sortOrder", title: "Display order", type: "number", initialValue: 0, validation: (rule) => rule.required().integer().min(0) });
const imageFields = [
  defineField({ name: "image", title: "Upload image", type: "image", options: { hotspot: true } }),
  defineField({ name: "imageUrl", title: "Existing image URL", type: "url" })
];

export const event = defineType({
  name: "event", title: "Event", type: "document",
  fields: [
    defineField({ name: "fullTitle", title: "Full title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "acronym", title: "Acronym", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "fullTitle" }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "detailDescription", title: "Detailed description", type: "text", rows: 5 }),
    defineField({ name: "statistic", title: "Statistic", type: "string" }),
    defineField({ name: "partner", title: "Partner copy", type: "text", rows: 3 }),
    defineField({ name: "date", title: "Date", type: "string" }),
    defineField({ name: "registrationState", title: "Registration label", type: "string" }),
    defineField({ name: "registrationUrl", title: "Registration URL or path", type: "string" }),
    defineField({ name: "resourceLabel", title: "Resource label", type: "string" }),
    defineField({ name: "resourceUrl", title: "Resource URL or path", type: "string" }),
    ...imageFields, sortOrder
  ],
  preview: { select: { title: "fullTitle", subtitle: "acronym", media: "image" } }
});

export const judge = defineType({
  name: "judge", title: "Judge", type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 8, validation: (rule) => rule.required() }),
    defineField({ name: "competitions", title: "Competitions", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "note", title: "Display note", type: "text", rows: 3 }),
    defineField({ name: "year", title: "Year label", type: "string" }),
    ...imageFields, sortOrder
  ],
  preview: { select: { title: "name", subtitle: "year", media: "image" } }
});

export const newsItem = defineType({
  name: "newsItem", title: "News item", type: "document",
  fields: [
    defineField({ name: "publication", title: "Publication", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "articleUrl", title: "Article URL", type: "url", validation: (rule) => rule.required() }),
    defineField({ name: "videoUrl", title: "Video URL", type: "url" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    ...imageFields, sortOrder
  ],
  preview: { select: { title: "headline", subtitle: "publication", media: "image" } }
});

export const stat = defineType({
  name: "stat", title: "Homepage statistic", type: "document",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    sortOrder
  ],
  preview: { select: { title: "value", subtitle: "label" } }
});

export const sponsor = defineType({
  name: "sponsor", title: "Sponsor", type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "href", title: "Website", type: "url", validation: (rule) => rule.required() }),
    defineField({ name: "relationship", title: "Relationship with Target Alpha", type: "text", rows: 6,
      description: "Optional public description below this sponsor’s logo: how they support Target Alpha, events supported, or the impact of the relationship. Separate paragraphs with a blank line." }),
    ...imageFields, sortOrder
  ],
  preview: { select: { title: "name", subtitle: "href", media: "image" } }
});

export const partner = defineType({
  name: "partner", title: "Academic partner", type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "shortName", title: "Short name", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 6 }),
    defineField({ name: "href", title: "Website", type: "url", validation: (rule) => rule.required() }),
    ...imageFields, sortOrder
  ],
  preview: { select: { title: "name", subtitle: "subheading", media: "image" } }
});
