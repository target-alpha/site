import { defineArrayMember, defineField, defineType } from "sanity";

const imageFields = [
  defineField({ name: "image", title: "Upload image", type: "image", options: { hotspot: true } }),
  defineField({ name: "imageUrl", title: "Existing image URL", type: "url", description: "Use this only while an image remains hosted elsewhere." })
];

export const team = defineType({
  name: "team",
  title: "Team",
  type: "document",
  fields: [
    defineField({ name: "teamType", title: "Team type", type: "string", validation: (rule) => rule.required(), options: { layout: "radio", list: [{ title: "National", value: "national" }, { title: "Regional", value: "regional" }] } }),
    defineField({ name: "year", title: "Year", type: "string", description: "Use the format 2026-27.", validation: (rule) => rule.required().regex(/^\d{4}-\d{2}$/) }),
    defineField({ name: "path", title: "Page path", type: "string", description: "For example: /team26-27", validation: (rule) => rule.required().regex(/^\/[a-z0-9-]+$/) }),
    defineField({ name: "sortOrder", title: "Display order", type: "number", initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({
      name: "members",
      title: "Members",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [defineArrayMember({
        name: "person",
        title: "Person",
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "role", title: "Role", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "profileRole", title: "Full profile role", type: "string" }),
          defineField({ name: "department", title: "Department", type: "string" }),
          defineField({ name: "legacyPath", title: "Profile path", type: "string", description: "Keep existing profile paths unchanged to preserve links.", validation: (rule) => rule.regex(/^\/[a-z0-9-]+$/) }),
          ...imageFields,
          defineField({ name: "bio", title: "Biography", type: "text", rows: 8, validation: (rule) => rule.required() })
        ],
        preview: { select: { title: "name", subtitle: "role", media: "image" } }
      })]
    })
  ],
  preview: {
    select: { year: "year", teamType: "teamType" },
    prepare: ({ year, teamType }) => ({ title: `${year || "Untitled"} ${teamType || "team"}` })
  }
});
