---
title: "Getting Started with OpenClaw"
date: 2026-03-01
author: Derek Leeds
categories: ["OpenClaw"]
tags: ["openclaw", "agents", "getting-started", "setup"]
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

Specialized agents for different tasks:
- **researcher** - Web research
- **communicator** - Writing and messaging
- **code-crafter** - Development
- **homelab-guardian** - Infrastructure

## Installation

```bash
# Install OpenClaw
npm install -g openclaw

# Initialize workspace
openclaw init

# Start the agent
openclaw start
```

## Configuration

Key files in `~/.openclaw/`:

| File | Purpose |
|------|---------|
| `openclaw.json` | Main configuration |
| `workspace/` | Agent workspace |
| `workspace/MEMORY.md` | Memory index |
| `workspace/AGENTS.md` | Agent coordination |

## Next Steps

1. Read [Memory Management Best Practices](/post/memory-management/) to understand the memory system
2. Explore available skills with `openclaw skills list`
3. Try spawning a sub-agent for a task

## Resources

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Documentation](https://docs.openclaw.ai)
- [Community Discord](https://discord.com/invite/clawd)