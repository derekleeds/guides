# Derek's Guides

[guides.derekleeds.cloud](https://guides.derekleeds.cloud/) is a standalone technical guide site about AI agents, agent memory, MCP tooling, homelab infrastructure, and security.

The site uses Astro 7, Starlight, Markdown content, and a local Keystatic editor. Cloudflare Pages publishes the production build.

## Local development

Requirements:

- Node.js 22.12 or newer
- pnpm 11.19.0

Install dependencies and start the site:

```bash
pnpm install
pnpm dev
```

The local Keystatic editor is available at `/keystatic`. It edits the same Markdown files used by Starlight.

Run the production checks before publishing:

```bash
pnpm build
pnpm format:check
```

## Content

Guide pages live under `src/content/docs/docs/`. A file such as:

```text
src/content/docs/docs/openclaw/lossless-claw.md
```

publishes at:

```text
https://guides.derekleeds.cloud/docs/openclaw/lossless-claw/
```

Keep existing slugs stable. Use absolute site paths for internal links, such as `/docs/memory-management/`.

## Publishing

A push to `main` triggers Cloudflare Pages to install dependencies, run `pnpm build`, and publish the generated `dist/` directory. Cloudflare manages the `guides.derekleeds.cloud` custom domain.

## Architecture

Learn and Guides are intentionally separate sites. The decision and migration boundaries are recorded in [CMS_ARCHITECTURE.md](CMS_ARCHITECTURE.md).
