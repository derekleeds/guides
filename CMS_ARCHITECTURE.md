# Guides CMS architecture decision

- Status: Accepted
- Date: 2026-08-19
- Scope: `guides.derekleeds.cloud`

## Decision

Keep `guides.derekleeds.cloud` and `learn.derekleeds.cloud` as separate sites. Guides remains in the `derekleeds/guides` repository, keeps its existing domain and `/docs/...` URLs, and publishes through Cloudflare Pages.

Use this stack for Guides:

- Astro 7.2.2 as the site framework;
- Starlight 0.41.7 for documentation navigation, search, and page layout;
- Markdown files in Git as the canonical content;
- Keystatic in local mode as an optional editing interface;
- pnpm for JavaScript dependencies and reproducible builds;
- Cloudflare Pages Git integration for builds and deployment.

Cloudflare Pages is the hosting authority. Its Git integration watches the `main` branch, runs `pnpm build`, and publishes `dist/`. Cloudflare also manages the `guides.derekleeds.cloud` custom domain. GitHub remains the source repository but no longer builds or hosts the production site.

## Why

The previous Guides site required Hugo, Go modules, Docsy, npm, custom layouts, and a Hugo-specific deployment workflow. Derek's other active sites already use Astro. Moving Guides to Astro removes a second static-site runtime and its theme-specific maintenance without merging sites that serve different purposes.

Keeping Learn and Guides separate preserves their identities and allows each information architecture to evolve independently. Shared technology does not require shared navigation, content storage, branding, or deployment.

Starlight provides documentation features without maintaining custom equivalents. Keystatic gives local form-based editing while leaving Markdown readable, portable, and reviewable in Git.

## Boundaries and resolved decisions

- Learn is not imported into this repository.
- Guides content is not moved to the Learn domain.
- Guides keeps `https://guides.derekleeds.cloud` as its canonical domain.
- Existing public guide URLs remain under `/docs/...`.
- The sidebar uses explicit top-level topic groups with directory-generated entries inside each group. Section overview frontmatter controls the first entry where ordering matters.
- A static 1200 by 630 pixel social image is the stable fallback for every page. Per-article image generation is deferred to avoid another build dependency.
- JSON-LD includes the site author and website on every page, plus `TechArticle` for dated guide content.
- The existing Apache License 2.0 remains the repository and guide-content license and is linked from the About page.
- The privacy policy is retained and updated for the actual static-site behavior: no analytics, forms, accounts, or cookies, with theme preference stored locally in the browser.
- Guides does not publish RSS. It is a reference library rather than a chronological publication; sitemap, Pagefind, and `llms.txt` are the supported discovery surfaces.
- Keystatic is enabled for local development only and is not a public production CMS.
- Content changes remain normal Git changes and follow the repository review process.

## Migration

The migration copies the existing English guide corpus into the Starlight content collection, converts Hugo section indexes and shortcodes, retains static assets and the custom domain, and replaces the active Hugo deployment with an Astro build on Cloudflare Pages.

The old Hugo, Docsy, Go, Docker, and Netlify implementation is moved to `archive/hugo-docsy/` after the Astro build reproduces the established routes. It is outside every active build path. Remove that archive only after the post-launch observation window, Search Console review, and rollback decision.

The URL, shortcode, and sidebar inventories are stored under `migration/`. No redirects are required because all established routes are preserved.

## Verification

Before deployment:

1. Run `pnpm build` and `pnpm format:check`.
2. Confirm every established guide URL has a generated page.
3. Test the homepage, section navigation, local search, and representative guides.
4. Test the local Keystatic editor and confirm it reads the Markdown collections.
5. Confirm the Cloudflare Pages build, custom domain, robots rules, sitemap, Pagefind, social metadata, and JSON-LD.

After deployment, spot-check the same URLs on `https://guides.derekleeds.cloud` and verify that Learn is unchanged. Cloudflare's production deployment and custom-domain checks are the final launch gates.

## Revisit when

Reconsider the decision if the two sites develop substantial duplicated content, the local editor no longer fits the publishing workflow, or a hosted editorial workflow becomes a requirement. A future review must start from the separation decision rather than assuming that a shared Astro stack implies consolidation.
