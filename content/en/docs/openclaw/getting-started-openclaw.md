---
title: "Getting Started with OpenClaw"
linkTitle: "Getting Started"
date: 2026-03-01
lastmod: 2026-03-13
authors: ["Derek Leeds"]
weight: 1
description: "A quick introduction to OpenClaw agent orchestration and how to set up your first agent."
---

OpenClaw is an open-source agent orchestration platform that helps you build AI agents with persistent memory, skill systems, and multi-agent coordination.

## Core Concepts

### Memory Architecture

OpenClaw uses a three-tier memory model:

- **Episodic** - Daily logs (`memory/episodic/YYYY-MM-DD.md`)
- **Semantic** - Knowledge base (`memory/semantic/topic.md`)
- **Procedural** - Workflows (`memory/procedural/process.md`)

### Skills System

Skills are modular capabilities stored in `~/.openclaw/skills/`. Each skill has:
- `SKILL.md` - Documentation
- Scripts or tools
- Configuration

### Sub-agents

OpenClaw can spawn specialized sub-agents for tasks:
- `homelab-guardian` - Infrastructure management
- `researcher` - Web research and analysis
- `communicator` - Outbound messages
- `orchestrator` - Tool selection

## Quick Start

### Installation

```bash
# Install OpenClaw
npm install -g openclaw

# Initialize workspace
openclaw init
```

### First Agent

```bash
# Create a simple agent
openclaw agent create my-agent

# Run it
openclaw agent run my-agent
```

## Next Steps

- [Memory Management Best Practices](/docs/memory-management/) - Learn about the memory architecture
- [Security Framework](/docs/security/sel-cynefin-framework/) - Understand agent security levels

---

*This guide covers the basics of OpenClaw. For more details, see the [OpenClaw documentation](https://docs.openclaw.ai).*