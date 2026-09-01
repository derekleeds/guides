---
version: alpha
name: Derek's Guides
# Personal publishing family: task-focused technical documentation.
description: Calm, accessible technical documentation with blue navigation, warm reading surfaces, and minimal ornament.
colors:
  primary: "#1F65A6"
  secondary: "#4C5969"
  tertiary: "#143F69"
  accent: "#D0A63B"
  focus: "#966F16"
  neutral: "#F3EFE5"
  surface: "#FFFFFF"
  ink: "#111820"
  on-primary: "#FFFFFF"
  on-tertiary: "#FFFFFF"
typography:
  h1:
    fontFamily: system-ui
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h2:
    fontFamily: system-ui
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.25
  body-md:
    fontFamily: system-ui
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
  code:
    fontFamily: ui-monospace
    fontSize: 0.9rem
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
  content-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  navigation-active:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  focus-ring:
    backgroundColor: "{colors.focus}"
  highlight:
    backgroundColor: "{colors.accent}"
  metadata:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
---

# Derek's Guides Design System

## Overview

Guides is the task-focused documentation member of Derek's personal publishing family. The Starlight information architecture is the product: navigation, search, readable procedures, code samples, and responsive behavior take priority over custom decoration.

Family cohesion comes from blue/navy structure, warm-neutral light surfaces, restrained gold focus emphasis, and direct writing—not from replacing Starlight or reproducing the personal homepage layout.

## Colors

- **Primary ({colors.primary}):** links, controls, and selected documentation states.
- **Secondary ({colors.secondary}):** secondary text and metadata.
- **Tertiary ({colors.tertiary}):** deep structural blue for navigation emphasis.
- **Accent ({colors.accent}):** rare decorative highlights.
- **Focus ({colors.focus}):** the darker gold keyboard indicator that maintains at least 3:1 contrast on current light and dark surfaces.
- **Neutral ({colors.neutral}):** light-mode page background.
- **Surface ({colors.surface}):** primary content surfaces.
- **Ink ({colors.ink}):** light-mode prose.

Dark mode remains first-class and uses the corresponding Starlight dark tokens in `src/styles/custom.css`; do not mechanically invert this light palette.

## Typography

Use Starlight's system interface and prose typography. Monospaced type is for code, commands, and literal values. Headings should be descriptive and scannable rather than ornamental.

## Layout

Preserve Starlight's responsive shell, sidebar, table of contents, and content measure. Use the spacing scale for custom callouts and media. Do not widen prose merely to fill the viewport.

## Elevation & Depth

Prefer Starlight borders and surface contrast. Avoid new box shadows unless a custom overlay or floating control genuinely requires separation.

## Shapes

Use modest rounding for controls and callouts. Full pills are limited to tags and compact statuses. Screenshots and diagrams may use a small radius but must not be cropped for style.

## Components

- `link` carries the normal action signal within prose.
- `navigation-active` identifies current location without depending on color alone.
- `button-primary` is uncommon in documentation and reserved for a true next action.
- `focus-ring` must remain obvious in both light and dark modes.
- `highlight` is decorative and must not carry text or state by itself.

## Do's and Don'ts

- **Do** preserve Starlight accessibility, search, responsive navigation, and dark mode.
- **Do** use semantic Markdown, descriptive link text, alt text, and language-tagged code fences.
- **Do** link to Learn for reflective narratives and to DerekLeeds.com for personal context.
- **Don't** override Starlight components when a token or custom CSS rule is sufficient.
- **Don't** use internal Vault links or homelab-only context in published guides.

## Accessibility and Motion

Maintain Starlight's semantic structure, keyboard navigation, search, responsive sidebar, dark mode, WCAG AA contrast, visible gold focus, and reduced-motion behavior. Test custom styles in both color themes.

## Site-Specific Boundaries

Starlight owns the documentation shell and interaction model. Prefer its tokens and supported configuration over component overrides; family resemblance must not weaken documentation navigation or density.
