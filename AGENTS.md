# Guides repository instructions

This repository publishes [guides.derekleeds.cloud](https://guides.derekleeds.cloud/), a standalone technical guide site. Do not combine it with `learn.derekleeds.cloud`.

## Stack

- Astro 7 and Starlight (exact versions in `package.json`)
- Markdown content collections
- pnpm (version pinned by `packageManager` in `package.json`)
- Cloudflare Pages, built from the GitHub mirror of Forgejo `homelab/guides`

Keystatic was removed on 2026-11-24 and is deprecated. Do not reintroduce it or its React dependencies.

## Content locations

- Homepage: `src/content/docs/index.mdx`
- Guides: `src/content/docs/docs/`
- About and privacy: `src/content/docs/about/` and `src/content/docs/privacy/`
- Static assets and discovery files: `public/`
- Starlight navigation: `astro.config.mjs`

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

## Verification

Before publishing:

- run the production build;
- run the formatting check;
- inspect changed pages in a browser;
- check navigation and internal links;
- confirm established URLs still build;
- verify no placeholder text or stale Hugo shortcodes remain.

Do not commit, push, or open a pull request unless the user explicitly authorizes that Git action.

## Visual contract

Read `DESIGN.md` before visual or component work. Keep it aligned with implementation changes and validate it with `npx -y @google/design.md@0.4.0 lint DESIGN.md`.
