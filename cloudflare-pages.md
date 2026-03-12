# Cloudflare Pages Deployment

This directory contains Cloudflare Pages deployment configuration.

## Build Settings

| Setting | Value |
|---------|-------|
| **Build command** | `npm install && npm run build` |
| **Build output directory** | `public` |
| **Root directory** | `/` |
| **Node version** | `18` |

## Environment Variables

Set in Cloudflare Pages dashboard:

```
HUGO_VERSION=0.121.0
```

## Domain

- **Production:** `guides.derekleeds.cloud`
- **Branch:** Automatic subdomain from Cloudflare

## Theme

This site uses [Google Docsy](https://github.com/google/docsy) theme as a git submodule.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
hugo server -D

# Build for production
hugo --gc --minify
```