# Development workflow

## Start a change

Create a feature branch from the current production branch. This repository uses `codex/` for Codex-created branches.

## Edit content

Choose either workflow:

- Edit Markdown in `src/content/docs/`.
- Run `pnpm dev` and use the local editor at `/keystatic`.

Keystatic is a local editing interface, not a second content store. Its changes appear as normal Markdown changes in Git.

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

After review, merge the approved change to `main`. GitHub Actions builds and deploys the site to GitHub Pages. Confirm the workflow passes and spot-check the changed production URLs.
