---
title: "Use DESIGN.md to Keep AI-Built Interfaces Cohesive"
linkTitle: "Use DESIGN.md for Cohesive Interfaces"
date: 2026-09-01
lastUpdated: 2026-09-01
authors: ["Derek Leeds"]
categories: [ai, development]
tags: [design-md, design-systems, design-tokens, ai-agents, accessibility]
description: "Decide whether a project needs DESIGN.md, model its visual system with tokens and rationale, validate it, and keep the contract close to the interface it governs."
weight: 7
---

AI coding agents are good at producing a plausible interface. They are less reliable at remembering why one site uses square editorial cards, another uses rounded documentation callouts, and a third reserves lime for conversion actions.

`DESIGN.md` gives that intent a durable home. Google's format combines machine-readable design tokens in YAML front matter with human-readable rationale in Markdown. Tokens provide exact values; prose explains how and why to use them. The current specification is explicitly **alpha**, so treat the file as a useful contract that may evolve, not a standards tablet carried down from the mountain. [Google's DESIGN.md repository](https://github.com/google-labs-code/design.md) documents the format and CLI.

## Decide whether you need one

Create a `DESIGN.md` when at least one of these is true:

- agents repeatedly invent colors, radii, spacing, or component treatments;
- the design intent is scattered across CSS, screenshots, and a maintainer's memory;
- several contributors or agents need to extend the same interface;
- a product has variants that must remain related without becoming identical;
- visual regressions are easy to introduce and expensive to review manually;
- accessibility expectations need to survive beyond one implementation session.

Skip it when the project has no meaningful visual system, is a disposable prototype, or is a redirect-only site with no rendered interface. A file that merely restates five obvious CSS variables creates another copy to maintain without improving decisions.

## Choose the correct scope

The lazy answer is not always “one file for everything.” Put the contract at the smallest scope that owns a coherent visual language.

| Situation                                 | Recommended scope                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| One product and one interface family      | One root `DESIGN.md`                                                                     |
| Monorepo with one shared design system    | One root contract, with narrowly documented variants                                     |
| Related sites with different repositories | One root file per active repository; repeat only the family-level invariants that matter |
| Distinct brands or audiences              | Separate contracts                                                                       |
| Redirect, API, or non-visual repository   | No `DESIGN.md`                                                                           |

A single cross-repository master file sounds tidy, but it creates a synchronization dependency before the sites share an actual token pipeline. Start with repository-local contracts. Extract shared tooling only after real drift proves that duplication costs more than coordination.

## Start from the implemented interface

For an existing site, do not invent an aspirational design system first. Audit what users actually receive:

1. Inspect the rendered site at desktop and mobile widths.
2. Read the CSS variables, framework theme, typography, breakpoints, and focus styles.
3. Identify repeated component behavior: buttons, cards, navigation, code blocks, forms, and callouts.
4. Separate intentional variants from accidental drift.
5. Record the smallest coherent contract that describes the current system.

A community collection such as [Awesome DESIGN.md](https://github.com/VoltAgent/awesome-design-md) can show useful levels of detail, but another brand's file is evidence of structure, not a palette to copy.

## Write the file

Place `DESIGN.md` at the project root. The YAML front matter is normative; the Markdown body explains intent.

```md
---
version: alpha
name: Example Product
description: Calm technical documentation with one restrained interaction color.
colors:
  primary: "#17375E"
  accent: "#D0A63B"
  neutral: "#F3EFE5"
  surface: "#FFFFFF"
  on-primary: "#FFFFFF"
typography:
  h1:
    fontFamily: system-ui
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.15
  body-md:
    fontFamily: system-ui
    fontSize: 1rem
    lineHeight: 1.7
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
---

## Overview

Describe the intended mood, audience, and design constraints.

## Colors

Explain the semantic role of each color.

## Typography

Explain hierarchy, font roles, and fallbacks.

## Layout

Document rhythm, measure, grids, and responsive behavior.

## Elevation & Depth

State whether depth comes from borders, contrast, shadows, or layers.

## Shapes

Define where rounding is appropriate and where it is not.

## Components

Describe component emphasis and state behavior.

## Do's and Don'ts

Record the few guardrails most likely to prevent drift.
```

The specification's canonical body order is Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, then Do's and Don'ts. Token references use dotted paths such as `{colors.primary}`. Component variants are sibling entries—`button-primary-hover`, not a nested `hover` object. Hex colors and negative dimensions should be quoted. [The specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) is the authority for the current schema.

## Validate before trusting it

The official CLI checks structure, token references, section order, and color contrast:

```bash
npx -y @google/design.md@0.4.0 lint DESIGN.md
```

Treat broken references as errors. Resolve contrast warnings rather than documenting inaccessible combinations as intentional. The linter cannot prove that the implementation matches the contract, so compare token values against source CSS during review.

For tools that consume W3C-style design tokens, export a DTCG file:

```bash
npx -y @google/design.md@0.4.0 export --format dtcg DESIGN.md > tokens.json
```

Tailwind exports are also available. Do not wire generated output into a production build merely because it exists; add that dependency only when the site is ready to make `DESIGN.md` its token source rather than a reviewed contract.

## Keep accessibility in the contract

At minimum, document and preserve:

- text and control contrast;
- visible `:focus-visible` treatment;
- semantic HTML and heading order;
- reduced-motion behavior;
- readable line length and responsive reflow;
- alt text and non-color state cues;
- minimum usable target sizes for interactive controls.

The CLI's contrast check is valuable, but it sees only declared foreground/background pairs. Keyboard behavior, state communication, dark mode, and real component composition still require rendered testing.

## Maintain it without creating a second design system

Update `DESIGN.md` in the same change that deliberately alters a governed token or component rule. During review, ask two questions:

1. Does the implementation still match the contract?
2. Is the contract describing an intentional system rather than preserving accidental history?

Use repository-local files until multiple projects truly share generated tokens or components. At that point, centralize the source and generate or distribute project-specific outputs. Before that point, a “universal design platform” is mostly a new place for drift to hide.

## A practical adoption sequence

```text
rendered interface
  -> source token audit
  -> repository-local DESIGN.md
  -> lint and contrast checks
  -> one small cohesion change
  -> build and visual verification
  -> review after real use
```

The goal is not to document every pixel. It is to preserve the decisions an agent is most likely to guess incorrectly.
