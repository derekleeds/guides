---
title: "Memory Management Best Practices"
description: "Why AI agents need structured memory, how to set up a three-tier architecture, and the services that make it work."
weight: 30
---

# Memory Management Best Practices

Structured memory makes AI agents useful across sessions. This section covers:

- [Memory Management Best Practices for AI Agents](/posts/memory-management/) — Three-tier memory architecture

## Why This Matters

AI agents without memory start fresh every session, forget what they learned, and repeat mistakes. A proper memory architecture solves:

- **Context continuity** — Agents remember what happened yesterday
- **Learning** — Agents accumulate knowledge over time
- **Efficiency** — No need to repeat context in every prompt
- **Autonomy** — Agents can work on multi-day projects

## The Three-Tier Model

| Memory Type | Purpose | Location |
|-------------|---------|----------|
| **Episodic** | Time-based logs | `memory/episodic/YYYY-MM-DD.md` |
| **Semantic** | Facts and knowledge | `memory/semantic/topic.md` |
| **Procedural** | Workflows and skills | `memory/procedural/process.md` |

## Memory Services

| Service | Purpose |
|---------|---------|
| **QMD MCP Server** | Semantic search over memory files |
| **GraphThulhu** | Knowledge graph for Obsidian/Logseq |
| **discrawl** | Discord archive search |

## Related Documentation

- `memory/procedural/memory-manager/` — Memory management scripts
- `memory/WIP/` — Active work tracking
- [GraphThulhu MCP](https://github.com/skridlevsky/graphthulhu)
- [QMD on GitHub](https://github.com/tobi/qmd)