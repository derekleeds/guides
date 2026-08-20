---
title: "Architectural Decisions: Writing Down the Why"
linkTitle: "Architectural Decisions"
date: 2026-07-07
lastUpdated: 2026-07-07
authors: ["Derek Leeds"]
categories: [infrastructure, architecture, gitops]
tags: [architecture, adr, decision-records, gitops, homelab, documentation, sre]
description:
  "A practical guide to architecture decisions and ADRs: when to write them,
  what to include, which template to choose, and how they work in a homelab
  GitOps stack."
weight: 15
---

Most architecture problems are not caused by a bad decision.

They are caused by a decision that nobody remembers making.

Six months later, someone asks why the DNS control plane is shaped a certain
way, why Home Assistant is allowed to observe infrastructure but not mutate it,
or why one service stayed in Compose while another moved to Kubernetes. If the
answer is “it was in a chat somewhere,” congratulations: the system now has
load-bearing folklore.

An **Architecture Decision Record** fixes that.

## The short version

An **Architecture Decision Record** (**ADR**) is a short document that captures:

1. the decision,
2. the context that made the decision necessary,
3. the consequences of choosing it.

An **Architecture Decision Log** (**ADL**) is the collection of those records
for a project, platform, or organization.

Use ADRs when future-you, another engineer, or an AI agent will need to know
**why** a technical choice was made — not just what changed.

## What counts as an architectural decision?

An architectural decision is a choice that meaningfully affects the structure,
operation, security, maintainability, or evolution of a system.

Good candidates:

- choosing a source of truth,
- defining ownership between control planes,
- selecting Kubernetes vs. Docker Compose for a workload,
- setting secret-management boundaries,
- accepting or rejecting a high-risk security exception,
- choosing a data store, queue, ingress model, or identity provider,
- deciding how observability, automation, or deployment authority is split.

Bad candidates:

- trivial implementation details,
- purely temporary experiments,
- decisions already fully covered by an existing standard,
- low-risk changes that are obvious from the code diff,
- “we should document this because documentation is good” paperwork.

The test is simple:

> If someone will ask “why did we do it this way?” later, write the ADR now.

## ADR vs. runbook vs. incident report

These documents answer different questions.

| Document        | Primary question                     | Example                                                                              |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| ADR             | Why did we choose this architecture? | “Home Assistant observes infrastructure but does not mutate GitOps-managed systems.” |
| Runbook         | How do we operate this thing?        | “How to restore the service from backup.”                                            |
| Incident report | What happened and what did we learn? | “Why DNS failed during the cutover.”                                                 |
| Project plan    | What work are we doing next?         | “Migrate this stack from Compose to Kubernetes.”                                     |
| Timeline        | What changed, when, in this repo?    | “Commit history with operational notes and ADR links.”                               |

A good platform needs all of them. An ADR is not a replacement for a runbook. A
runbook is not a replacement for a decision. And a chat thread is not a source
of truth, no matter how confident the scrollback feels.

## The minimum useful ADR

The classic lightweight template, popularized by Michael Nygard, is enough for
most decisions:

```markdown
# 0007. Use Example as the Thing

## Status

Accepted — 2026-07-07

## Context

What issue, constraint, risk, or goal is forcing this decision?

## Decision

What are we deciding?

## Consequences

What becomes easier, harder, safer, riskier, or more expensive because of this?
```

That is it. Do not add ceremony unless the decision deserves it.

## What good ADRs include

A good ADR is:

- **Specific:** one decision, not a bundle of loosely related opinions.
- **Contextual:** explains why the decision exists now.
- **Consequence-oriented:** says what trade-offs follow from the decision.
- **Timestamped:** records when the decision was proposed, accepted, superseded,
  or revisited.
- **Linked:** points to project plans, implementation commits, incidents,
  runbooks, and follow-on ADRs.
- **Reviewable:** small enough that someone can actually read it.

The upstream ADR guidance also emphasizes that architectural decisions should be
communicated to and accepted by the stakeholders who fund, develop, and operate
the system. In a homelab, the stakeholder list is shorter. The blast radius is
not always smaller.

## Status values

Use status to make the decision lifecycle explicit.

| Status       | Meaning                                     |
| ------------ | ------------------------------------------- |
| `proposed`   | Draft decision; not yet accepted            |
| `accepted`   | Current decision of record                  |
| `rejected`   | Considered and intentionally not chosen     |
| `deprecated` | Still historical, but no longer recommended |
| `superseded` | Replaced by a newer ADR                     |

Avoid editing an accepted ADR as if history changed. Add dated updates or create
a new ADR that supersedes the old one. Rewriting history is for unreliable
narrators and very tired change managers.

## Choosing a template

Use the smallest template that captures the decision clearly.

| Template          | Use when                                                                                                                       | Avoid when                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **Nygard**        | Most operational policy and boundary decisions: one context, one decision, concise consequences                                | You need a detailed options comparison     |
| **MADR**          | Alternatives, drivers, pros/cons, and trade-offs must be preserved                                                             | The outcome is obvious or already accepted |
| **Tyree-Akerman** | High-impact decisions need formal traceability, quality attributes, assumptions, constraints, risks, and stakeholder rationale | Routine platform decisions                 |

For homelab GitOps work, the default is:

> Nygard for policy and boundaries, MADR for options and trade-offs,
> Tyree-Akerman for formal or high-blast-radius decisions.

## When to write an ADR

Write an ADR when a decision changes the shape of the system.

### Source of truth boundaries

Examples:

- Forgejo is the source of truth for infrastructure manifests.
- Komodo manages Compose stacks, while ArgoCD manages Kubernetes workloads.
- Home Assistant configuration has its own sanitized repo boundary.

Why it matters: source-of-truth decisions prevent shadow state. Shadow state is
where reproducibility goes to become a ghost story.

### Control-plane boundaries

Examples:

- Home Assistant may observe infrastructure health but must not trigger Komodo,
  ArgoCD, Talos, or UniFi mutations.
- NextDNS and Tailscale changes should start API-first and read-only by default,
  not MCP-write-first.

Why it matters: control planes are high-blast-radius systems. Write down who is
allowed to mutate what.

### Security exceptions and risk acceptance

Examples:

- A CrowdSec operator allowlist exception during a public-edge pilot.
- A decision to suppress or accept scanner findings for privileged networking
  components.

Why it matters: exceptions without written rationale become permanent accidents.

### Platform and tool choices

Examples:

- Whether a workload belongs in Kubernetes or Compose.
- Whether to use a hosted service, local service, or hybrid control plane.
- Whether an MCP server should be read-only, write-capable, or deferred.

Why it matters: the choice is rarely just technical. It affects operations,
security, backups, upgrades, and who gets paged by future-you.

## When not to write an ADR

Skip an ADR when:

- the change is small, local, and obvious from the diff,
- the decision is temporary and captured in a project plan,
- the choice is already dictated by an accepted ADR or standard,
- the work is a reversible experiment with no durable architectural commitment,
- the document would only restate “we followed the existing pattern.”

Do not turn ADRs into paperwork tax. The goal is architecture knowledge, not a
ritual sacrifice to the documentation gods.

## Deferred decisions

Sometimes the right answer is: “This is a real decision, but not yet.”

For deferred decisions:

1. Record the decision question in the active project or investigation note.
2. Capture candidate options and decision drivers.
3. State what evidence is still missing.
4. Identify the likely ADR filename or topic, but do not create an accepted ADR
   yet.
5. Create the ADR only when the decision is actually made.

This is useful for homelab security work. For example, scanner findings on a
privileged networking component may require a future risk-acceptance or
replacement decision. Until the decision is made, the project note should say it
is deferred. No pretend ADRs. No fake certainty.

## How ADRs work in GitOps

In a GitOps environment, ADRs sit above implementation.

```text
ADR: why this architecture is accepted
  ↓
Forgejo change: what declarative state implements it
  ↓
Komodo / ArgoCD / automation: how state is reconciled
  ↓
Runbook / timeline: how operators use and audit it
```

The ADR does not replace the manifest. The manifest does not explain the whole
rationale. You need both.

For homelab work:

- put durable architecture policy in the Obsidian Homelab ADL,
- put implementation manifests in Forgejo,
- link the ADR from relevant repo `TIMELINE.md` entries or project notes,
- link the commit, PR, or path back from the ADR when useful,
- keep secrets out of both places.

## Homelab examples

The active homelab ADL uses numeric Markdown files under:

```text
2_Areas/Homelab/architecture-decision-log/
```

Examples of accepted decisions:

| ADR                                                                      | Decision type                           | Why it matters                                                                                                      |
| ------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `0001. Beszel Agent Token Source of Truth`                               | Secret/source-of-truth boundary         | Defines where per-machine agent tokens live and why 1Password is not used for that specific token class             |
| `0002. Hermes Control Plane and Kanban Orchestration Boundary`           | Agent/control-plane boundary            | Keeps Discord-facing Hermes focused on intake and orchestration rather than direct implementation work              |
| `0005. DNS Control Plane: NextDNS, Tailscale, and Technitium Boundaries` | Network/security control-plane boundary | Keeps high-blast-radius DNS/tailnet changes API-first, reviewable, and not MCP-write-first                          |
| `0006. Home Assistant Observability and Config Source Boundary`          | Observability/source-of-truth boundary  | Allows Home Assistant to observe homelab health while preventing it from becoming a competing GitOps mutation plane |

These are good ADRs because they preserve the **why** behind control-plane
boundaries. A future agent can read them and avoid “helpfully” wiring Home
Assistant directly to the big red deploy button. Humanity has suffered enough.

## A practical ADR workflow

Use this sequence:

1. **Identify the decision.** What choice is being made?
2. **Check if it already exists.** Search the ADL, project notes, and repo docs.
3. **Choose the smallest template.** Nygard by default; MADR for trade-offs;
   Tyree-Akerman for formal/high-risk decisions.
4. **Write context before decision.** If the context is weak, the decision will
   be weak.
5. **State consequences honestly.** Include trade-offs and new obligations.
6. **Link implementation.** Reference repo path, PR, commit, runbook, or project
   plan when available.
7. **Update the index.** An ADR that cannot be found may as well be a napkin.
8. **Revisit when reality changes.** Supersede, deprecate, or amend with dated
   notes.

## A compact homelab ADR template

```markdown
---
title: "0007. Short Decision Title"
created: 2026-07-07
updated: 2026-07-07
type: adr
status: accepted
tags:
  - architecture
  - adr
  - homelab
aliases:
  - Short Decision Alias
forgejo_ref: "homelab/infrastructure@commit-or-path-if-applicable"
---

# 0007. Short Decision Title

## Status

Accepted — 2026-07-07

## Context

What situation, constraint, risk, or goal requires a durable decision?

## Decision

What decision is accepted?

## Consequences

Positive:

- What becomes easier, safer, more maintainable, or more reproducible?

Trade-offs:

- What becomes harder, slower, more expensive, or more constrained?

Guardrails:

- What must future operators or agents not do without a follow-on decision?

## References

- Project note: [[...]]
- Forgejo path or commit: `org/repo:path` or `org/repo@commit`
- Related ADR: [[...]]
```

## ADR checklist

Before accepting an ADR, check:

- [ ] Is this one decision?
- [ ] Is the decision architecturally significant?
- [ ] Is the context specific enough to explain why now?
- [ ] Are the consequences honest?
- [ ] Are alternatives captured if they matter?
- [ ] Is the status clear?
- [ ] Is it linked from the ADL index?
- [ ] Are implementation refs included or deferred explicitly?
- [ ] Does it avoid plaintext secrets, tokens, private IDs, and unnecessary
      telemetry?
- [ ] Does it tell a future human or agent what not to do?

## Bottom line

Architectural decisions are where teams preserve intent.

Code shows what exists. Git shows what changed. Runbooks show how to operate it.
ADRs explain why the system is shaped that way.

Write ADRs for durable choices, source-of-truth boundaries, control-plane
ownership, security exceptions, and high-impact platform trade-offs. Keep them
short, honest, linked, and findable.

Future-you will still complain about past-you. But at least past-you will have
left receipts.

## Sources

- [Architecture decision record repository](https://github.com/architecture-decision-record/architecture-decision-record)
- [Raw ADR README](https://raw.githubusercontent.com/architecture-decision-record/architecture-decision-record/master/README.md)
- Local Homelab Architecture Decision Log:
  `2_Areas/Homelab/architecture-decision-log/`
- Local LLM Wiki ADR templates: Nygard, MADR, and Tyree-Akerman
