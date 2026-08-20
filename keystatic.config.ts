import { collection, config, fields } from "@keystatic/core";

const storage = { kind: "local" } as const;

const markdownOptions = {
  bold: true,
  italic: true,
  strikethrough: true,
  code: true,
  heading: [2, 3, 4, 5, 6] as const,
  blockquote: true,
  orderedList: true,
  unorderedList: true,
  table: true,
  link: true,
  divider: true,
  codeBlock: true,
};

const guideCollection = (
  label: string,
  path: `src/content/docs/docs/${string}/*`,
) =>
  collection({
    label,
    slugField: "title",
    path,
    columns: ["title", "date", "lastUpdated"],
    entryLayout: "content",
    format: { contentField: "content" },
    schema: {
      title: fields.slug({
        name: { label: "Title", validation: { isRequired: true } },
        slug: {
          label: "URL slug",
          description: "Do not change this after the guide is published.",
        },
      }),
      linkTitle: fields.text({ label: "Short navigation title" }),
      description: fields.text({
        label: "Search description",
        multiline: true,
        validation: { isRequired: true, length: { min: 1, max: 300 } },
      }),
      date: fields.date({ label: "Published date" }),
      lastUpdated: fields.date({ label: "Updated date" }),
      authors: fields.array(fields.text({ label: "Author" }), {
        label: "Authors",
        itemLabel: ({ value }) => value || "Author",
      }),
      categories: fields.array(fields.text({ label: "Category" }), {
        label: "Categories",
        itemLabel: ({ value }) => value || "Category",
      }),
      tags: fields.array(fields.text({ label: "Tag" }), {
        label: "Tags",
        itemLabel: ({ value }) => value || "Tag",
      }),
      weight: fields.integer({ label: "Navigation order" }),
      aliases: fields.array(fields.text({ label: "Legacy path" }), {
        label: "Legacy paths",
        itemLabel: ({ value }) => value || "Path",
      }),
      content: fields.mdx({
        label: "Guide content",
        extension: "md",
        options: markdownOptions,
      }),
    },
  });

export default config({
  storage,
  ui: { brand: { name: "Derek's Guides" } },
  collections: {
    ai: guideCollection("AI and agent guides", "src/content/docs/docs/ai/*"),
    openclaw: guideCollection(
      "OpenClaw guides",
      "src/content/docs/docs/openclaw/*",
    ),
    hermes: guideCollection(
      "Hermes Agent guides",
      "src/content/docs/docs/hermes/*",
    ),
    memory: guideCollection(
      "Memory architecture guides",
      "src/content/docs/docs/memory-management/*",
    ),
    infrastructure: guideCollection(
      "Infrastructure guides",
      "src/content/docs/docs/infrastructure/*",
    ),
    security: guideCollection(
      "Security guides",
      "src/content/docs/docs/security/*",
    ),
  },
});
