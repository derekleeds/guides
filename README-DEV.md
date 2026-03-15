# Development Workflow

This document describes the GitOps workflow for contributing to the guides.

## Quick Start

```bash
# Clone the repo
git clone https://forgejo.tailbd8f6.ts.net/homelab/guides.git
cd guides

# Start local development server
npm install
npm run serve
```

Open http://localhost:1313 to preview.

## Branch Strategy

- `main` - Production (requires PR to merge)
- `dev` - Staging (requires PR to merge from feature branches)
- `feature/*` - Feature branches (create from dev)

## Workflow

### 1. Create Feature Branch

```bash
git checkout dev
git pull
git checkout -b feature/my-topic
```

### 2. Make Changes

Edit files in `content/en/docs/`:
- Create new `.md` files for new guides
- Update existing guides
- Add images to `assets/`

### 3. Preview Locally

```bash
npm run serve
```

Open http://localhost:1313 to verify changes.

### 4. Commit and Push

```bash
git add -A
git commit -m "Add guide for X"
git push origin feature/my-topic
```

### 5. Create Pull Request

1. Go to https://forgejo.tailbd8f6.ts.net/homelab/guides
2. Click "Compare & Pull Request"
3. Set: `feature/my-topic` → `dev`
4. Describe changes
5. Submit PR

### 6. Merge to Production (After Testing)

Once changes are verified on staging:

1. Create PR: `dev` → `main`
2. Review and merge
3. Production deploys automatically

## Directory Structure

```
guides-docsy/
├── content/en/
│   ├── about/           # About page
│   ├── docs/            # Documentation
│   │   ├── infrastructure/
│   │   ├── memory-management/
│   │   ├── openclaw/
│   │   └── security/
│   └── privacy/         # Privacy policy
├── assets/              # Images, SCSS
├── layouts/             # Custom layouts
└── hugo.yaml            # Hugo config
```

## Adding a New Guide

1. Create `content/en/docs/<section>/<topic>.md`
2. Add front matter:
   ```yaml
   ---
   title: "Guide Title"
   linkTitle: "Short Title"
   weight: 10
   description: "Brief description"
   date: 2026-03-15
   ---
   ```
3. Write content in Markdown
4. Preview, commit, PR

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run serve` | Local dev server (live reload) |
| `npm run build:production` | Production build |
| `npm run build:preview` | Preview build |