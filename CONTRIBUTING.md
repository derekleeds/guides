# Contributing

Contributions should improve the accuracy, clarity, or maintainability of Derek's Guides.

## Content changes

1. Edit the relevant Markdown file under `src/content/docs/`.
2. Define unfamiliar terms and link to primary documentation for changing technical details.
3. Preserve the existing file path unless the change includes a tested redirect.
4. Run `pnpm build` and `pnpm format:check`.
5. Open a pull request in Forgejo `homelab/guides` that describes the reader problem and the proposed change. The GitHub repository is a one-way mirror, so changes made there are overwritten.

## Code changes

Keep the Guides and Learn sites separate. Changes to Astro, Starlight, navigation, or deployment should remain scoped to this repository and preserve the `guides.derekleeds.cloud` domain.

Include local validation results in the pull request. Do not include generated `dist/` or `.astro/` files.
