<div align="center">

# Derek's Guides

**Practical technical documentation for AI agents, memory, MCP, infrastructure, and security.**

[![Status](https://img.shields.io/badge/status-live-2ea44f?style=flat-square)](https://guides.derekleeds.cloud/)
[![Stack](https://img.shields.io/badge/stack-Astro%20Starlight-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://starlight.astro.build/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)](LICENSE)
[![Forgejo](https://img.shields.io/badge/Forgejo-homelab/guides-blue?style=flat-square&logo=forgejo)](http://localhost:3000/homelab/guides)
[![GitHub](https://img.shields.io/badge/GitHub-derekleeds/guides-181717?style=flat-square&logo=github)](https://github.com/derekleeds/guides)

<a href="https://guides.derekleeds.cloud/">
  <img src="public/og-image.png" alt="Derek's Guides" width="900">
</a>

</div>

## About

[guides.derekleeds.cloud](https://guides.derekleeds.cloud/) is a standalone reference site for longer, task-focused documentation. Learn remains the home for journal-style writing; Guides is for material meant to be followed more than once.

## Tech stack

| Component                                                                             | Technology              | Purpose                                                                                  |
| :------------------------------------------------------------------------------------ | :---------------------- | :--------------------------------------------------------------------------------------- |
| <img src="https://cdn.simpleicons.org/astro/BC52EE" alt="Astro" width="28">           | **Astro 7 + Starlight** | Builds the static documentation site, navigation, search, and accessible page structure. |
| <img src="https://cdn.simpleicons.org/markdown/000000" alt="Markdown" width="28">     | **Markdown and MDX**    | Stores durable, reviewable guide content.                                                |
| <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" width="28">           | **React**               | Supports Keystatic and the small interactive surfaces that require it.                   |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" width="28"> | **TypeScript**          | Keeps configuration and content integrations predictable.                                |
| <img src="https://cdn.simpleicons.org/pnpm/F69220" alt="pnpm" width="28">             | **pnpm**                | Installs the pinned dependency graph and runs project checks.                            |
| <img src="https://cdn.simpleicons.org/cloudflare/F38020" alt="Cloudflare" width="28"> | **Cloudflare Pages**    | Publishes the generated static site.                                                     |

## Local development

Requirements:

- Node.js 22.12 or newer
- pnpm 11.19.0

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The site and local Keystatic editor are available at `http://localhost:4321/` and `/keystatic`.

## Content

Guide pages live under `src/content/docs/docs/`. For example:

```text
src/content/docs/docs/openclaw/example.md
  → /docs/openclaw/example/
```

Keep published slugs stable and use absolute site paths such as `/docs/memory-management/` for internal links.

## Production checks

```bash
pnpm build
pnpm format:check
pnpm preview
```

Astro writes the site to `dist/`.

## Project checklist

- [x] Publish a standalone Starlight documentation site
- [x] Separate reusable guides from Learn journal posts
- [x] Organize guides by technical domain
- [x] Provide local Markdown and Keystatic editing
- [x] Preserve stable `/docs/...` routes
- [x] Add search, sitemap, and social metadata
- [x] Keep Forgejo as the source of truth
- [x] Mirror `main` one way to GitHub for Cloudflare Pages deployment
- [x] Publish the production site at `guides.derekleeds.cloud`

## Deployment

| Setting           | Value            |
| :---------------- | :--------------- |
| Production branch | `main`           |
| Build command     | `pnpm build`     |
| Build output      | `dist`           |
| Node.js           | `22.12` or newer |

```text
Forgejo homelab/guides
  → GitHub derekleeds/guides
  → Cloudflare Pages
  → guides.derekleeds.cloud
```

## Architecture and license

Learn and Guides are intentionally separate sites. The decision and migration boundaries are recorded in [CMS_ARCHITECTURE.md](CMS_ARCHITECTURE.md).

Licensed under the [Apache License 2.0](LICENSE).
