import { defineArrayMember, defineField, defineType } from "sanity";

const enabled = defineField({
  name: "enabled",
  title: "Show this section",
  type: "boolean",
  initialValue: true,
  description: "Turn this off to hide the section without deleting its content."
});

const linkFields = [
  defineField({ name: "linkLabel", title: "Link label", type: "string" }),
  defineField({
    name: "href",
    title: "Link destination",
    type: "string",
    description: "Use a site path beginning with / or a complete https:// link.",
    validation: (rule) => rule.custom((value) => !value || value.startsWith("/") || /^https:\/\//i.test(value) || "Use a site path beginning with / or a complete https:// link.")
  })
];

const imageFields = [
  defineField({ name: "image", title: "Upload image", type: "image", options: { hotspot: true } }),
  defineField({ name: "imageUrl", title: "Existing image URL", type: "url" }),
  defineField({ name: "imageAlt", title: "Image description", type: "string", description: "Describe the image for visitors using screen readers." })
];

const preview = (fallback) => ({
  select: { title: "title", enabled: "enabled" },
  prepare: ({ title, enabled: isEnabled }) => ({
    title: title || fallback,
    subtitle: isEnabled === false ? "Hidden" : "Visible"
  })
});

export const homeHero = defineType({
  name: "homeHero",
  title: "Homepage hero",
  type: "object",
  fields: [
    defineField({ name: "statement", title: "Opening statement", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
    defineField({ name: "ctaHref", title: "Button destination", type: "string" }),
    defineField({
      name: "images",
      title: "Hero images",
      type: "array",
      validation: (rule) => rule.max(3),
      of: [defineArrayMember({
        name: "homeHeroImage",
        title: "Hero image",
        type: "object",
        fields: imageFields,
        preview: { select: { title: "imageAlt", media: "image" }, prepare: ({ title, media }) => ({ title: title || "Hero image", media }) }
      })]
    })
  ]
});

export const homeEventAnnouncement = defineType({
  name: "homeEventAnnouncement",
  title: "Event announcement",
  type: "object",
  fields: [
    enabled,
    defineField({
      name: "eventType", title: "Event type", type: "string",
      options: { list: ["Competition", "Conference", "Workshop", "Registration", "Deadline", "Announcement"], layout: "dropdown" },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "status", title: "Status label", type: "string" }),
    defineField({ name: "title", title: "Event title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "details", title: "Short description", type: "text", rows: 3 }),
    defineField({ name: "date", title: "Date or timing", type: "string" }),
    defineField({ name: "location", title: "Location or format", type: "string" }),
    ...linkFields
  ],
  preview: preview("Event announcement")
});

export const homeStatsSection = defineType({
  name: "homeStatsSection",
  title: "Statistics strip",
  type: "object",
  fields: [
    enabled,
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4, description: "Statistics are managed in the Homepage statistic collection." })
  ],
  preview: preview("Statistics strip")
});

export const homeAboutSection = defineType({
  name: "homeAboutSection",
  title: "About section",
  type: "object",
  fields: [
    enabled,
    defineField({ name: "eyebrow", title: "Small label", type: "string" }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 5 }),
    ...linkFields,
    defineField({ name: "yearLabel", title: "Year label", type: "string" }),
    defineField({ name: "yearValue", title: "Year value", type: "string" })
  ],
  preview: preview("About section")
});

export const homeEventsSection = defineType({
  name: "homeEventsSection",
  title: "Events overview",
  type: "object",
  fields: [
    enabled,
    defineField({ name: "eyebrow", title: "Small label", type: "string" }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 5, description: "Event rows are managed in the Event collection." }),
    ...linkFields
  ],
  preview: preview("Events overview")
});

export const homeChapterSection = defineType({
  name: "homeChapterSection",
  title: "Chapter call to action",
  type: "object",
  fields: [
    enabled,
    defineField({ name: "eyebrow", title: "Small label", type: "string" }),
    defineField({ name: "stamp", title: "Background statistic", type: "string", description: "For example: 75+" }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
    ...linkFields,
    ...imageFields
  ],
  preview: { ...preview("Chapter call to action"), select: { title: "title", enabled: "enabled", media: "image" }, prepare: ({ title, enabled: isEnabled, media }) => ({ title: title || "Chapter call to action", subtitle: isEnabled === false ? "Hidden" : "Visible", media }) }
});

export const homeFlexibleSection = defineType({
  name: "homeFlexibleSection",
  title: "Flexible content section",
  type: "object",
  fields: [
    enabled,
    defineField({ name: "eyebrow", title: "Small label", type: "string" }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 7 }),
    defineField({
      name: "theme", title: "Colour treatment", type: "string", initialValue: "paper",
      options: { list: [{ title: "Off-white", value: "paper" }, { title: "Forest green", value: "green" }, { title: "Sage green", value: "sage" }], layout: "radio" }
    }),
    ...linkFields,
    ...imageFields
  ],
  preview: { ...preview("Flexible content section"), select: { title: "title", enabled: "enabled", media: "image" }, prepare: ({ title, enabled: isEnabled, media }) => ({ title: title || "Flexible content section", subtitle: isEnabled === false ? "Hidden" : "Visible", media }) }
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "hero", title: "Hero", type: "homeHero", validation: (rule) => rule.required() }),
    defineField({
      name: "sections",
      title: "Homepage sections",
      type: "array",
      description: "Drag sections to reorder them. Add, duplicate, hide, or remove sections without changing code.",
      of: [
        { type: "homeEventAnnouncement" },
        { type: "homeStatsSection" },
        { type: "homeAboutSection" },
        { type: "homeEventsSection" },
        { type: "homeChapterSection" },
        { type: "homeFlexibleSection" }
      ]
    })
  ],
  preview: { prepare: () => ({ title: "Homepage", subtitle: "Hero and ordered sections" }) }
});
