# Guides repository instructions

This repository publishes [guides.derekleeds.cloud](https://guides.derekleeds.cloud/), a standalone technical guide site. Do not combine it with `learn.derekleeds.cloud`.

## Stack

- Astro 7.2.2
- Starlight 0.41.7
- Markdown content collections
- Local Keystatic editor
- pnpm 11.19.0
- Cloudflare Pages

## Content locations

- Homepage: `src/content/docs/index.mdx`
- Guides: `src/content/docs/docs/`
- About and privacy: `src/content/docs/about/` and `src/content/docs/privacy/`
- Static assets and discovery files: `public/`
- Starlight navigation: `astro.config.mjs`
- Keystatic collections: `keystatic.config.ts`

The path `src/content/docs/docs/openclaw/example.md` maps to `/docs/openclaw/example/`. Preserve existing slugs and `/docs/...` URLs.

## Writing

- Define an unfamiliar term the first time it appears.
- State the problem a guide solves near the beginning.
- Distinguish active context, conversation history, durable memory, and retrieval.
- Distinguish agent runtimes, tools, skills, plugins, MCP servers, and individual agents.
- Prefer direct, practical prose without marketing language.
- Use primary project documentation for fast-changing commands or compatibility claims.
- Do not invent URLs, commands, product capabilities, or private infrastructure details.
- Use absolute internal links beginning with `/docs/`.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm format:check
```

The local editor runs at `/keystatic` when using `pnpm dev`. It edits the same Markdown files as a text editor.

## Verification

Before publishing:

- run the production build;
- run the formatting check;
- inspect changed pages in a browser;
- check navigation and internal links;
- confirm established URLs still build;
- verify no placeholder text or stale Hugo shortcodes remain.

Do not commit, push, or open a pull request unless the user explicitly authorizes that Git action.
