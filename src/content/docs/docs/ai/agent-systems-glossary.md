---
title: "Agent systems glossary: orchestration, memory, and MCP terms"
linkTitle: "Agent systems glossary"
date: 2026-08-19
lastUpdated: 2026-08-19
authors: ["Derek Leeds"]
categories: [agents, architecture]
tags: [openclaw, lcm, qmd, mcp, api, cli, memory]
description: "Plain-language definitions for OpenClaw, LCM, QMD, MCP, agent orchestration, context, durable memory, tools, skills, plugins, APIs, and CLIs."
---

Agent systems borrow terms from software development, search, and AI research.
Some names describe a general pattern while others refer to one product. This
glossary keeps those categories separate.

## Agent and orchestration terms

### AI agent

An AI agent combines a model with instructions, tools, and a loop that can take
several steps toward a goal. The model decides what to do next, but the runtime
controls which tools exist, what data they can access, and when work stops.

### Agent orchestration

Agent orchestration is the coordination layer around one or more agents. It
routes messages, selects models and workspaces, exposes tools, manages sessions,
and applies permission boundaries. Orchestration is a system responsibility,
not a special ability inside the language model.

### OpenClaw

OpenClaw is an agent runtime and gateway. It connects models to workspaces,
tools, skills, plugins, sessions, and communication channels. It can also route
work to isolated agents with different instructions and access.

### Tool

A tool is a callable capability such as reading a file, searching a service,
or updating a task. Good tool design uses a narrow input schema, a clear trust
boundary, and output that can be verified.

### Skill

A skill is reusable guidance for carrying out a kind of work. It tells an agent
which process, references, or tools to use. A skill may describe tools, but it
does not have to provide the executable integration itself.

### Plugin

A plugin adds runtime behavior or bundles capabilities into an application.
Depending on the host, it may register tools, skills, hooks, routes, or a new
context engine. Check the host's plugin contract instead of assuming every
plugin system works the same way.

## Context and memory terms

### Context window

The context window is the amount of material a model can process in one call.
It may contain instructions, recent messages, tool descriptions, retrieved
notes, and documents. Context is temporary and limited.

### Compaction

Compaction replaces older conversation detail with a smaller representation,
usually a summary. It makes room in the context window. Ordinary compaction may
discard details unless the runtime preserves the underlying messages elsewhere.

### Durable memory

Durable memory is reviewed information stored outside the active prompt so it
can survive a session restart. Markdown notes, decision records, and runbooks
are common examples. Durable memory should be curated rather than treated as a
dump of every conversation.

### LCM

LCM means Lossless Context Management. It is an approach to compacting a long
conversation while retaining the underlying messages and a path back to them.
Lossless Claw implements LCM for OpenClaw with SQLite, hierarchical summaries,
and tools for searching or expanding compacted history.

LCM handles conversation continuity. It does not replace durable memory or a
search index over a document collection.

### Retrieval

Retrieval finds material that may be relevant to the current request and adds a
selected portion to active context. Keyword search, vector similarity, filters,
and reranking are retrieval techniques. Retrieval quality depends on the index,
metadata, query, and source quality.

### QMD

QMD means Query Markup Documents. It is a local search engine for Markdown and
other text collections. QMD combines BM25 keyword search, vector search, query
expansion, and reranking. It can be used from its CLI or exposed to an AI
application through MCP.

## Integration terms

### API

An application programming interface, or API, is a contract for software to
request data or actions from another system. APIs are usually the most direct
choice for stable, repeatable automation.

### CLI

A command-line interface, or CLI, packages a workflow into terminal commands.
People, scripts, and agents can all use a CLI. The CLI may call an API behind
the scenes while providing authentication, validation, and readable output.

### MCP

The Model Context Protocol, or MCP, is a standard connection between an AI
application and servers that expose tools, resources, or prompts. MCP defines
how capabilities are described and called. It does not decide the agent's goal,
provide orchestration by itself, or guarantee that a server's data is current.

## Where to continue

- [OpenClaw agent orchestration](/docs/openclaw/getting-started-openclaw/)
- [AI agent memory architecture](/docs/memory-management/)
- [APIs, MCP, and CLIs](/docs/ai/apis-mcp-and-clis/)
- [Lossless Context Management with Lossless Claw](/docs/openclaw/lossless-claw/)
