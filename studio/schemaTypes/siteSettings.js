import { defineArrayMember, defineField, defineType } from "sanity";

const stringList = (name, title) => defineField({ name, title, type: "array", of: [{ type: "string" }] });
const imageFields = [
  defineField({ name: "image", title: "Upload image", type: "image", options: { hotspot: true } }),
  defineField({ name: "imageUrl", title: "Existing image URL", type: "url" })
];
const testimonial = defineArrayMember({
  name: "testimonial", title: "Testimonial", type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role", type: "text", rows: 3 }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 8 }),
    ...imageFields
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } }
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings and page copy",
  type: "document",
  fields: [
    defineField({
      name: "site", title: "Organization details", type: "object", fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "shortName", title: "Short name", type: "string" }),
        defineField({ name: "founded", title: "Founded", type: "string" }),
        defineField({ name: "logo", title: "Logo URL", type: "url" }),
        defineField({ name: "social", title: "Social links", type: "object", fields: [
          defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
          defineField({ name: "instagram", title: "Instagram", type: "url" })
        ] }),
        defineField({ name: "newsletter", title: "Newsletter integration", type: "object", fields: [
          defineField({ name: "action", title: "Form action", type: "url" }),
          defineField({ name: "formId", title: "Form ID", type: "string" }),
          defineField({ name: "collectionId", title: "Collection ID", type: "string" })
        ] }),
        defineField({ name: "contact", title: "Contact emails", type: "object", fields: [
          defineField({ name: "chapters", title: "Chapters", type: "email" }),
          defineField({ name: "partnerships", title: "Partnerships", type: "email" }),
          defineField({ name: "judges", title: "Judges", type: "email" }),
          defineField({ name: "academia", title: "Academia", type: "email" }),
          defineField({ name: "academicPartners", title: "Academic partners", type: "email" })
        ] })
      ]
    }),
    defineField({
      name: "homeContent", title: "Homepage copy", type: "object", fields: [
        defineField({ name: "hero", title: "Hero statement", type: "text", rows: 3 }),
        defineField({ name: "about", title: "About summary", type: "text", rows: 5 }),
        defineField({ name: "events", title: "Events summary", type: "text", rows: 5 }),
        defineField({ name: "chapter", title: "Chapter callout", type: "text", rows: 3 })
      ]
    }),
    defineField({
      name: "aboutContent", title: "About page", type: "object", fields: [
        defineField({ name: "introduction", title: "Introduction", type: "text", rows: 6 }),
        defineField({ name: "sections", title: "Sections", type: "array", of: [defineArrayMember({ type: "object", fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "body", title: "Body", type: "text", rows: 6 })
        ], preview: { select: { title: "title", subtitle: "body" } } })] }),
        defineField({ name: "image", title: "Image URL", type: "url" })
      ]
    }),
    defineField({
      name: "regionalOverview", title: "Regional executives page", type: "object", fields: [
        defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4 }),
        stringList("responsibilities", "Responsibilities"),
        defineField({ name: "applicationTitle", title: "Application title", type: "string" }),
        defineField({ name: "applicationStatus", title: "Application status", type: "string" }),
        defineField({ name: "applicationUrl", title: "Application URL", type: "url" }),
        defineField({ name: "testimonials", title: "Testimonials", type: "array", of: [testimonial] })
      ]
    }),
    defineField({
      name: "chapterContent", title: "Chapter registration page", type: "object", fields: [
        defineField({ name: "year", title: "Year", type: "string" }),
        defineField({ name: "introduction", title: "Introduction", type: "text", rows: 8 }),
        defineField({ name: "registrationNotice", title: "Registration notice", type: "text", rows: 5 }),
        defineField({ name: "statement", title: "Statement", type: "string" }),
        defineField({ name: "status", title: "Status banner", type: "string" }),
        defineField({ name: "benefitsIntro", title: "Benefits introduction", type: "string" }),
        stringList("benefits", "Benefits"),
        stringList("steps", "Registration steps"),
        defineField({ name: "links", title: "Links", type: "object", fields: [
          defineField({ name: "handbook", title: "Handbook", type: "url" }),
          defineField({ name: "more", title: "More information", type: "url" }),
          defineField({ name: "registration", title: "Registration status URL", type: "url" }),
          defineField({ name: "registrationForm", title: "Registration form", type: "url" })
        ] }),
        defineField({ name: "testimonials", title: "Testimonials", type: "array", of: [testimonial] }),
        defineField({ name: "image", title: "Hero image URL", type: "url" })
      ]
    }),
    defineField({
      name: "chapterResources", title: "Chapter resources", type: "array", of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "URL", type: "url" }),
        defineField({ name: "kind", title: "Resource type", type: "string" })
      ], preview: { select: { title: "label", subtitle: "kind" } } })]
    }),
    defineField({
      name: "academiaContent", title: "Academia page", type: "object", fields: [
        defineField({ name: "vision", title: "Vision", type: "text", rows: 8 }),
        defineField({ name: "resources", title: "Resources", type: "array", of: [defineArrayMember({ type: "object", fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "body", title: "Description", type: "text", rows: 6 }),
          defineField({ name: "label", title: "Link label", type: "string" }),
          defineField({ name: "href", title: "URL", type: "url" }),
          defineField({ name: "image", title: "Image URL", type: "url" })
        ], preview: { select: { title: "title", subtitle: "label" } } })] })
      ]
    })
  ],
  preview: { prepare: () => ({ title: "Target Alpha site settings" }) }
});
