# Agent discovery files

The public discovery files live in `public/` and are copied into the root of the built site.

## Published files

- `/robots.txt` declares crawler access and points to the sitemap index.
- `/llms.txt` gives agents a concise topic and URL index.
- `/.well-known/api-catalog` describes API discovery links.
- `/.well-known/agent-skills/index.json` describes available skills metadata.
- `/.well-known/mcp/server-card.json` describes MCP discovery metadata.

## Source access

The production site publishes HTML, not a parallel `index.md` URL for every page. Canonical Markdown is available in the public GitHub repository under `src/content/docs/`.

## Verification

After deployment, request each file directly and confirm it returns the expected content type. Also verify the generated sitemap index and representative guide URLs.

GitHub Pages does not apply the old Netlify header configuration. Any future response-header or content-negotiation requirement needs an explicit edge or hosting implementation rather than a documentation-only claim.

Last reviewed: 2026-08-19
