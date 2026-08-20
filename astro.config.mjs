import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import keystatic from "@keystatic/astro";
import { defineConfig } from "astro/config";

const keystaticMode = process.env.PUBLIC_KEYSTATIC_MODE;
const enableKeystatic = keystaticMode === "local";

export default defineConfig({
  site: "https://guides.derekleeds.cloud",
  integrations: [
    ...(enableKeystatic ? [keystatic()] : []),
    react(),
    starlight({
      title: "Derek's Guides",
      description:
        "Practical guides to AI agents, agent memory, MCP tooling, homelab infrastructure, and self-hosting.",
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/derekleeds/guides",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/derekleeds/guides/edit/main/",
      },
      customCss: ["./src/styles/custom.css"],
      components: {
        Head: "./src/components/Head.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://guides.derekleeds.cloud/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:width", content: "1200" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:height", content: "630" },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:alt",
            content:
              "Derek's Guides: agent orchestration, memory architecture, and MCP tooling",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: "https://guides.derekleeds.cloud/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image:alt",
            content:
              "Derek's Guides: agent orchestration, memory architecture, and MCP tooling",
          },
        },
      ],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      lastUpdated: true,
      sidebar: [
        { label: "Start here", link: "/" },
        {
          label: "AI and agents",
          items: [{ autogenerate: { directory: "docs/ai" } }],
        },
        {
          label: "Agent orchestration",
          items: [{ autogenerate: { directory: "docs/openclaw" } }],
        },
        {
          label: "Hermes Agent",
          items: [{ autogenerate: { directory: "docs/hermes" } }],
        },
        {
          label: "Memory architecture",
          items: [{ autogenerate: { directory: "docs/memory-management" } }],
        },
        {
          label: "Infrastructure",
          items: [{ autogenerate: { directory: "docs/infrastructure" } }],
        },
        {
          label: "Security",
          items: [{ autogenerate: { directory: "docs/security" } }],
        },
        { label: "About", link: "/about/" },
      ],
    }),
    sitemap(),
  ],
});
