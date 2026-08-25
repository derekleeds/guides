---
title: "AI agent memory architecture: context, durable memory, LCM, and QMD"
linkTitle: "Memory architecture"
date: 2026-03-12
lastUpdated: 2026-08-19
authors: ["Derek Leeds"]
categories: [agents, architecture]
tags: [memory, openclaw, lcm, qmd, mcp, retrieval]
weight: 30
sidebar:
  order: 2
  label: "Earlier four-layer model"
description: "Design AI agent memory by separating live context, durable Markdown, conversation compaction, and searchable retrieval with tools such as Lossless Claw and QMD."
---

:::note[Looking for the current architecture?]
This guide preserves an earlier four-layer model that was valid for its time. Start with [Build a Memory Architecture for AI Agents](/docs/memory-management/current-agent-memory-architecture/) for the current layered approach.
:::

An agent memory system is easier to maintain when each layer has one job.
Problems start when a prompt, a transcript, a notes folder, and a vector index
are all treated as the same kind of memory.

This guide separates four layers:

1. live context for the current model call
2. durable memory written to files
3. conversation history preserved through compaction
4. retrieval indexes used to find relevant documents

OpenClaw, Lossless Context Management, and QMD each fit into a different layer.

## The four memory layers

| Layer                | Question it answers                         | Typical storage                   | Main constraint                                         |
| -------------------- | ------------------------------------------- | --------------------------------- | ------------------------------------------------------- |
| Live context         | What does the model need for this turn?     | Prompt and active session context | Limited by the model's context window and cost          |
| Durable memory       | What should survive a new session?          | Curated Markdown files            | Must be written, reviewed, and kept concise             |
| Conversation history | What happened earlier in this long session? | Transcript plus summaries         | Compaction must preserve enough detail for recovery     |
| Retrieval index      | Which files are relevant to this question?  | Keyword and vector indexes        | Results depend on indexing, metadata, and query quality |

Adding a larger vector database does not fix a bad durable-memory process.
Likewise, a perfect `MEMORY.md` does not prevent a long conversation from
overflowing the model context window.

## Live context

Live context is the material sent to the model for one turn. It may include
system instructions, recent messages, workspace files, tool descriptions, and
retrieved notes.

Context should be selective. Loading an entire knowledge base into every turn
increases cost and makes relevant instructions harder to find. Keep stable
operating rules short, then retrieve detail only when the current task needs it.

## Durable memory in OpenClaw

OpenClaw writes durable memory as plain Markdown in an agent workspace. The
current memory model includes:

- `USER.md` for stable preferences and active user context
- `MEMORY.md` for curated facts, decisions, and short summaries
- `memory/YYYY-MM-DD.md` for detailed daily notes and observations

`MEMORY.md` is loaded at session start within a configured budget. Daily notes
remain on disk and can be searched without injecting the whole archive.

A useful maintenance rule is simple: keep decisions and durable facts in the
curated layer, and keep detailed evidence in dated or topic-specific files.
When a fact changes, update or supersede the old statement rather than adding a
contradiction at the bottom.

Example layout:

```text
workspace/
├── AGENTS.md
├── USER.md
├── MEMORY.md
└── memory/
    ├── 2026-08-18.md
    ├── 2026-08-19.md
    ├── deployment-decisions.md
    └── network-inventory.md
```

## LCM: lossless conversation compaction

LCM means Lossless Context Management. The Lossless Claw plugin is an LCM
implementation for OpenClaw.

The plugin stores conversation messages and builds hierarchical summaries when
the active context approaches its limit. Recent messages stay available while
older material is represented by summaries. The original messages remain in
the plugin's store so an agent can expand a summary and recover detail later.

LCM solves conversation continuity. It does not replace curated memory or a
search index for your document collection.

Use LCM when sessions regularly run long enough to compact and earlier details
still matter. Check the plugin's
[current compatibility notes](https://github.com/Martian-Engineering/lossless-claw)
before installation because OpenClaw's session storage and context-engine APIs
can change between release lines.

## QMD: local hybrid search for documents

QMD means Query Markup Documents. It is a local search engine for Markdown
notes, documentation, meeting transcripts, and other text collections.

QMD supports three search modes:

- `qmd search` uses BM25 keyword search.
- `qmd vsearch` uses vector similarity.
- `qmd query` combines keyword and vector retrieval with query expansion and
  reranking.

That makes QMD useful when an agent needs to find a document but the wording in
the question does not exactly match the wording in the file.

Install QMD and create a collection:

```bash
npm install -g @tobilu/qmd
qmd collection add ~/openclaw/workspace --name agent-memory
qmd context add qmd://agent-memory "OpenClaw workspace memory and operating notes"
qmd embed
```

Search it from the command line:

```bash
qmd search "gateway authentication" -c agent-memory
qmd query "how did we protect the deployment credentials"
```

QMD also exposes an MCP server:

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

Use the default local stdio transport when the AI application and index run on
the same machine. QMD also supports Streamable HTTP for a shared service, but
the HTTP endpoints are unauthenticated. Keep them on loopback or put deliberate
authentication and network controls in front of them.

## Built-in search or QMD

OpenClaw has its own `memory_search` path for workspace memory. QMD is an
additional option when you want one local index across broader document
collections or need its keyword, vector, and reranking pipeline.

Choose one retrieval path first. Running several overlapping indexes creates
more sync jobs, more models, and more failure modes. Add another index only when
you have a search case the current one cannot handle well.

## A practical operating loop

Use this cycle to keep memory useful:

1. Write detailed observations to a dated note while work is active.
2. Promote durable decisions to `MEMORY.md` or a topic file.
3. Re-index changed files.
4. Test retrieval with questions people will actually ask.
5. Remove or supersede stale statements.
6. Review what is loaded into live context and trim material that no longer
   earns its prompt cost.

The storage format matters less than the review loop. A memory system that only
accumulates files eventually becomes an archive the agent cannot trust.

## Primary references

- [Agent systems glossary](/docs/ai/agent-systems-glossary/)
- [OpenClaw memory overview](https://docs.openclaw.ai/concepts/memory)
- [OpenClaw memory search](https://docs.openclaw.ai/concepts/memory-search)
- [Lossless Claw](https://github.com/Martian-Engineering/lossless-claw)
- [QMD](https://github.com/tobi/qmd)
