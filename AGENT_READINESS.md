# Agent discovery files

The public discovery files live in `public/` and are copied into the root of the built site.

## Published files

- `/robots.txt` declares general crawler access and points to the sitemap index. Cloudflare Managed robots.txt adds the zone-level AI training policy at the edge.
- `/sitemap.xml` redirects to Astro's generated `/sitemap-index.xml` for crawlers that assume the conventional filename.
- `/llms.txt` gives agents a concise topic and URL index.

## Not published

The site has no API, MCP server, or installable agent skills, so it does not publish `/.well-known/api-catalog`, an MCP server card, or an agent-skills index. Earlier placeholder versions of those files were removed on 2026-11-24: the MCP card pointed at an endpoint that returned 404, the skills index used all-zero digests, and the API catalog linked a missing page. Add one only when the capability it describes exists and has been verified. The supported discovery surfaces are the sitemap, Pagefind search and `llms.txt` (see `CMS_ARCHITECTURE.md`).

## Source access

The production site publishes HTML, not a parallel `index.md` URL for every page. Canonical Markdown is available in the public GitHub repository under `src/content/docs/`.

## Verification

After deployment, request each file directly and confirm it returns the expected content type. Also verify the generated sitemap index and representative guide URLs.

Cloudflare Pages does not apply the old Netlify header configuration. Any future response-header or content-negotiation requirement needs an explicit Cloudflare edge or Pages implementation rather than a documentation-only claim.

Last reviewed: 2026-11-24
