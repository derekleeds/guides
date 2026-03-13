---
title: "Security & Autonomy"
description: "Security Execution Levels and domain classification for AI agent autonomy"
weight: 20
---

# Security & Autonomy

Know when agents can act autonomously and when they need human approval. This section covers:

- [SEL × Cynefin Framework](/posts/security/sel-cynefin-framework/) — Security Execution Levels combined with Cynefin domain classification

## Why This Matters

AI agents need two things before acting:

1. **What tools can I use?** — Security Execution Level (SEL)
2. **How autonomous can I be?** — Cynefin domain classification

The combination prevents both over-restriction (agents stuck waiting for approvals on routine tasks) and under-restriction (agents running unchecked with dangerous capabilities).

## The Framework at a Glance

| Level | Tools | When to Use |
|-------|-------|-------------|
| **SEL-0** | Read-only | Research, information gathering |
| **SEL-1** | Standard | Content creation, workspace operations |
| **SEL-2** | Elevated | Infrastructure changes (with approval) |
| **SEL-3** | Quarantine | Untrusted code, sandboxed execution |

| Domain | Autonomy |
|--------|----------|
| **Clear** | Autonomous within SEL |
| **Complicated** | Recommend + approve |
| **Complex** | Report uncertainty |
| **Chaotic** | Escalate immediately |

## Implementation

All skills in OpenClaw have SEL + Cynefin classification in their `SKILL.md` frontmatter. New skills go through the skill-vetter which validates these fields.

## Related Documentation

- [Security Execution Levels framework](https://journal.derekleeds.cloud/security-execution-levels/) — Blog post on the journey
- `memory/procedural/security-execution-levels.md` — Full framework documentation
- `memory/procedural/domain-classification.md` — Cynefin classification guide