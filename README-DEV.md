# Development workflow

## Start a change

Create a feature branch from `main` in Forgejo `homelab/guides`, the canonical repository.

## Edit content

Edit Markdown in `src/content/docs/` and preview it with `pnpm dev`.

## Preview and validate

```bash
pnpm dev
pnpm build
pnpm format:check
```

The production check validates Astro and TypeScript before building all pages. Review navigation, code blocks, internal links, mobile layout, and any changed images in a browser.

## Add a guide

1. Choose the appropriate directory under `src/content/docs/docs/`.
2. Create a Markdown file with a stable, lowercase slug.
3. Add a descriptive title and a search-focused description.
4. Define unfamiliar terms in the opening section.
5. Link to the relevant section overview and related guides.
6. Run the production checks.

Example frontmatter:

```yaml
---
title: "Guide title"
description: "A specific description of the question this guide answers."
date: 2026-08-19
lastmod: 2026-08-19
authors: ["Derek Leeds"]
---
```

## Preserve URLs

The Astro migration keeps the established `/docs/...` paths. Do not rename a content file or section directory without adding and testing a redirect.

## Publish

Open a pull request in Forgejo. After review, merge the approved change to `main`. Forgejo mirrors `main` to GitHub, and Cloudflare Pages builds and deploys it from there. Spot-check the changed production URLs after the deployment.
