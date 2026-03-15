---
title: "Memory Management Best Practices for AI Agents"
linkTitle: "Memory Management"
weight: 30
description: "Why AI agents need structured memory, how to set up a three-tier architecture, and the services that make it work."
date: 2026-03-12
lastmod: 2026-03-12
categories: [agents, memory]
tags: [openclaw, qmd, graphthulhu, discrawl, architecture]
---


AI agents without memory are like developers without Stack Overflow - they start fresh every session, forget what they learned, and repeat the same mistakes. This guide shows you how to give your agents a working memory system.

## Why Memory Matters

When you build an AI agent, you quickly run into a basic problem: **the model has no persistence between sessions**. Every conversation starts from zero. Every task requires re-explaining context. Every mistake gets repeated.

A proper memory architecture solves this:

- **Context continuity** - Agents remember what happened yesterday
- **Learning** - Agents accumulate knowledge over time
- **Efficiency** - No need to repeat context in every prompt
- **Autonomy** - Agents can work on multi-day projects

Research backs this up. The Zep team found [properly structured memory improves retrieval by 18.5%](https://www.getzep.com/) compared to flat vector storage.

## The Three-Tier Memory Model

Human memory has distinct systems - episodic (events), semantic (facts), and procedural (skills). AI agents benefit from the same separation.

### Episodic Memory

**What it is:** Time-based logs of events and conversations.

**Where it lives:** `memory/episodic/YYYY-MM-DD.md`

**What it stores:**
- Daily session logs
- Task history
- Decisions made
- Mistakes and corrections

**Example:**
```markdown
# 2026-03-12

## Morning Briefing - 08:00 CST
- Discussed Q4 roadmap planning
- Decision: Use PostgreSQL for new analytics pipeline
- Blocked: Waiting on security review for OAuth implementation

## Session: Container Migration
- Migrated mkdocs-material from pnode200 to openclaw-node01
- Issue: Docker group permissions needed restart
- Resolution: Added user to docker group
```

**When to use it:**
- "What did we decide about X last week?"
- "What's blocking Y?"
- "What happened during the last session?"

### Semantic Memory

**What it is:** Facts, concepts, and knowledge - the "what I know" layer.

**Where it lives:** `memory/semantic/topic.md`

**What it stores:**
- Project overviews
- System architecture
- How things work
- Reference information

**Example:**
```markdown
# Infrastructure

## Nodes

| Node | Role | IP | Services |
|------|------|----|---------|
| pnode200 | Legacy | 100.97.52.86 | (decommissioned) |
| openclaw-node01 | Orchestration | 100.x.x.x | OpenClaw, QMD |
| MS-S1-MAX | GPU Compute | 100.90.135.47 | Ollama, QMD MCP |

## QMD MCP Server

- Location: MS-S1-MAX
- Port: 3000 (proxied via Docktail)
- GPU: AMD ROCm (Vulkan)
- Sync: Every 2 hours from openclaw-node01
```

**When to use it:**
- "What's the architecture for X?"
- "How does Y work?"
- "What's the IP of Z?"

### Procedural Memory

**What it is:** Workflows, processes, and how-to guides - the "how to" layer.

**Where it lives:** `memory/procedural/process.md`

**What it stores:**
- Step-by-step workflows
- Checklists
- Runbooks
- Best practices

**Example:**
```markdown
# Discrawl Setup

## Prerequisites
- Go 1.26+
- Discord bot token

## Installation

```bash
brew tap steipete/tap
brew install steipete/tap/discrawl
```

## Configuration

```bash
discrawl init --from-openclaw ~/.openclaw/openclaw.json
```

## Verification

```bash
discrawl doctor
discrawl sync --full
```
```

**When to use it:**
- "How do I set up X?"
- "What's the workflow for Y?"
- "Run me through the process for Z."

## Setting Up Memory Folders

Create this structure in your agent's workspace:

```bash
mkdir -p memory/{core,episodic,semantic,procedural,references,WIP}
```

```
memory/
├── core/           # Identity, goals (always load)
│   ├── agent-architecture.md
│   ├── installed-skills.md
│   └── self-improvement-requirements.md
├── episodic/       # Daily logs
│   ├── 2026-03-01.md
│   ├── 2026-03-02.md
│   └── ...
├── semantic/       # Knowledge base
│   ├── agents.md
│   ├── infrastructure.md
│   ├── docker-standards.md
│   └── ...
├── procedural/     # Workflows
│   ├── discrawl.md
│   ├── yt-dlp-service.md
│   ├── memory-manager.md
│   └── ...
├── references/     # External docs
│   ├── qmd-mcp-architecture.md
│   ├── openclaw-runbook.md
│   └── ...
├── WIP/            # Active work items
└── MEMORY.md      # Index file
```

### The Index File (MEMORY.md)

Create `MEMORY.md` as your index:

```markdown
# Long-term Memory

## Memory Search
Use QMD for all memory searches:
- `qmd query "search term"` - Semantic search
- `qmd search "search term"` - Keyword search

## Core Memories
- `memory/core/agent-architecture.md` - How agents are structured
- `memory/core/installed-skills.md` - Available skills

## Key Procedural
- `memory/procedural/discrawl.md` - Discord archive search
- `memory/procedural/memory-manager.md` - Memory organization

## Key Semantic
- `memory/semantic/infrastructure.md` - System architecture
- `memory/semantic/agents.md` - Agent inventory
```

## Memory Services

You need more than folders. You need services that make memory usable.

### QMD MCP Server (Semantic Search)

**What it is:** Vector-based semantic search over your memory files.

**Why you need it:** Keyword search fails when you remember *what something means* but not *what it's called*.

**Architecture:**
```
Memory files → QMD embeds → SQLite + vectors → MCP Server → Agent queries
```

**Setup:**
1. Install QMD on a machine with GPU (or CPU)
2. Configure MCP server endpoint
3. Set up memory sync (every 2 hours)

```bash
# Sync memory to GPU node
rsync -avz ~/workspace/memory/ gpu-node:openclaw/memory/

# Update QMD index
qmd update && qmd embed
```

**Usage from agent:**
Agents use `memory_search` tool which queries QMD MCP:
```
memory_search "how did we set up docker networking"
→ Returns relevant memory files with citations
```

**External link:** [QMD on GitHub](https://github.com/.../qmd)

### GraphThulhu (Knowledge Graph)

**What it is:** Graph-based search over Obsidian/Logseq notes.

**Why you need it:** Some knowledge is relational. "What depends on X?" "What's connected to Y?"

**Architecture:**
```
Obsidian vault → GraphThulhu MCP → Agent can query graph structure
```

**Setup:**
```json
// ~/.mcporter/mcporter.json
{
  "mcpServers": {
    "graphthulhu": {
      "command": "/path/to/graphthulhu",
      "args": ["serve", "--backend", "obsidian", "--vault", "/path/to/vault"]
    }
  }
}
```

**Capabilities:**
- Navigate pages by links
- Find knowledge gaps
- Discover topic clusters
- Search with context

**External link:** [GraphThulhu MCP](https://github.com/.../graphthulhu)

### discrawl (Discord Archive)

**What it is:** Searchable archive of Discord messages.

**Why you need it:** Discord history contains decisions, discussions, and context that shouldn't be lost.

**Architecture:**
```
Discord Gateway → discrawl tail → SQLite DB → discrawl search
```

**Setup:**
```bash
# Install
brew tap steipete/tap
brew install steipete/tap/discrawl

# Configure (uses Discord bot token)
discrawl init --from-openclaw ~/.openclaw/openclaw.json

# Sync history
discrawl sync --full

# Live sync (systemd)
sudo systemctl enable --now discrawl-tail
```

**Usage:**
```bash
discrawl search "kubernetes" --channel openclaw --limit 20
discrawl messages --author blue_genes --days 7
```

**External link:** [discrawl on GitHub](https://github.com/steipete/discrawl)

## Memory Sync Across Machines

If you run agents on multiple machines, you need to sync memory.

### Simple: rsync + cron

```bash
# On agent node, sync to GPU node every 2 hours
0 */2 * * * rsync -avz --delete ~/workspace/memory/ gpu-node:memory/
```

### Better: Git + automation

```bash
# Commit memory changes
git add memory/
git commit -m "Memory update: $(date)"
git push
```

### Best: Watch-based sync

Use `fswatch` or `inotifywait` to sync on change instead of on schedule.

## Memory Distillation

Memory grows. Episodic logs pile up. You need a process to distill what matters.

### Weekly Distillation

```markdown
# Distillation Process

## Every Week (Sunday 22:00)
1. Review episodic entries from past 7 days
2. Extract key decisions → semantic memory
3. Document new procedures → procedural memory
4. Archive old episodes to snapshots/
```

### Automation

```bash
# Run distillation
~/.openclaw/skills/memory-distill/distill.sh
```

This reads `memory/episodic/`, extracts patterns, and writes to `memory/semantic/` and `memory/procedural/`.

## Troubleshooting

### QMD not finding results

1. Check index status: `qmd status`
2. Update embeddings: `qmd update && qmd embed`
3. Verify GPU/node sync: Check `qmd-mcp.tailbd8f6.ts.net/health`

### Memory files not syncing

1. Check cron: `crontab -l | grep sync`
2. Verify rsync: `rsync -avzn ~/workspace/memory/ destination:memory/`
3. Check logs: `tail -f ~/workspace/memory/sync.log`

### discrawl missing recent messages

1. Check systemd status: `systemctl status discrawl-tail`
2. Verify bot token: `discrawl doctor`
3. Resync: `discrawl sync --full`

### GraphThulhu connection errors

1. Verify mcpporter running: `mcporter list`
2. Check Obsidian vault path in config
3. Restart: `mcporter daemon restart`

## External References

- [Zep Memory Architecture](https://www.getzep.com/) - Research on structured memory
- [OpenClaw GitHub](https://github.com/openclaw/openclaw) - Agent framework
- [QMD - Queryable Memory Database](https://github.com/.../qmd)
- [GraphThulhu MCP](https://github.com/.../graphthulhu)
- [discrawl - Discord Archive](https://github.com/steipete/discrawl)

## Next Steps

1. **Set up memory folders** - Create the three-tier structure
2. **Install QMD MCP** - Get semantic search working
3. **Add discrawl** - Archive Discord history
4. **Configure GraphThulhu** - Connect your Obsidian vault
5. **Set up sync** - Keep memory consistent across machines
6. **Schedule distillation** - Automate knowledge extraction

---

*This guide covers the memory architecture used by OpenClaw agents. For updates, check the [OpenClaw GitHub](https://github.com/openclaw/openclaw).*