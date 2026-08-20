---
title: "OpenClaw agent orchestration: runtime, tools, skills, and agents"
linkTitle: "OpenClaw overview"
date: 2026-03-01
lastUpdated: 2026-08-19
authors: ["Derek Leeds"]
categories: [agents]
tags: [openclaw, agent-orchestration, tools, skills, multi-agent]
weight: 1
sidebar:
  order: 1
  label: "OpenClaw overview"
description: "Understand how OpenClaw coordinates models, workspaces, tools, skills, plugins, sessions, and multiple agents before you configure a production setup."
---

OpenClaw is an open-source agent runtime and gateway. It connects a language
model to a workspace, tools, skills, sessions, and communication channels, then
coordinates the loop that turns a request into actions and a response.

That coordination is agent orchestration. It is less mysterious than it sounds.
OpenClaw decides which agent receives a request, assembles the context that
agent can see, exposes the allowed capabilities, runs tool calls, and stores the
session state.

OpenClaw is not the model itself. It is also not a general-purpose memory
database or a replacement for an API. Those systems can sit behind the runtime,
but they solve different problems.

## What OpenClaw coordinates

A typical request moves through these parts:

1. A user sends a message through the dashboard, terminal, or a configured
   channel.
2. Routing selects an agent and session.
3. OpenClaw loads that agent's workspace instructions and available memory.
4. The runtime sends the assembled context and tool definitions to the selected
   model.
5. The model may answer directly or request a tool call.
6. OpenClaw executes an allowed tool, returns the result to the model, and
   repeats the loop when needed.
7. The runtime stores session state and sends the final response back through
   the original channel.

The model proposes the next step. OpenClaw controls the environment in which
that proposal can run.

## Tools, skills, plugins, and agents

These terms describe different parts of the system.

| Part   | What it is                                                          | Use it when                                                                           |
| ------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Tool   | A typed function the model can call                                 | The agent must read data, run a command, search, or take an action                    |
| Skill  | A `SKILL.md` instruction pack                                       | The tools already exist, but the agent needs a repeatable workflow or operating rules |
| Plugin | A package that can add tools, providers, channels, hooks, or skills | OpenClaw needs a capability the core runtime does not provide                         |
| Agent  | A workspace, model configuration, auth state, and session store     | A workload needs its own identity, data boundary, or tool policy                      |

A skill does not grant access by itself. It teaches the agent how to use the
tools that survive the active permissions and policy. A plugin can add new
runtime capabilities, but those capabilities should still be scoped to the
agents that need them.

## Workspace and memory

Each agent has a workspace that acts as its default working directory. OpenClaw
loads a small set of workspace files when a session starts:

- `AGENTS.md` contains operating instructions.
- `SOUL.md` defines persona and behavioral boundaries.
- `USER.md` can hold stable user preferences and active context.
- `MEMORY.md` holds curated long-term facts and decisions.
- `memory/YYYY-MM-DD.md` files hold detailed daily notes that can be searched
  without loading every note into each prompt.

The model only remembers durable information if it is written somewhere the
next session can read. OpenClaw does not hide a second memory inside the model.

This file layer is different from conversation compaction and document search.
[Lossless Context Management](/docs/openclaw/lossless-claw/) preserves long
conversation history. [QMD and other retrieval indexes](/docs/memory-management/)
help find relevant material across larger document collections.

## One agent or several

Start with one agent unless you need a real boundary.

A second agent is useful when a workload needs a separate workspace, model,
credentials, channel identity, or tool policy. OpenClaw can run several isolated
agents through one Gateway and route messages through explicit bindings.

Examples include:

- a personal assistant and an operations agent with different credentials
- a public chat agent with a narrow tool set
- a coding agent whose workspace is limited to one repository

Do not add agents only to create job titles. A researcher, writer, and reviewer
can be separate runs or skills if they share the same trust boundary. Multiple
persistent agents add routing, authentication, and maintenance work.

## Install and verify OpenClaw

Check the [official OpenClaw quickstart](https://docs.openclaw.ai/quickstart)
before installing because runtime requirements and onboarding commands can
change. The current quickstart supports the official shell installer on macOS
and Linux:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

On Windows, the project provides a PowerShell installer and a native Hub app.
After installation, run onboarding and install the Gateway service:

```bash
openclaw onboard --install-daemon
openclaw gateway status
```

Verify three things before adding plugins or additional agents:

1. The Gateway starts cleanly.
2. The selected model can return a simple response.
3. The workspace files are in the directory you expect.

Add one capability at a time after the base system works. Test its read path,
then its write path, then its failure behavior.

## Where MCP fits

MCP is the Model Context Protocol. An MCP server can expose tools and resources
to an AI application through a standard interface. OpenClaw can use MCP as one
integration boundary, but MCP is not the orchestration layer itself.

Use an MCP server when an agent needs to discover structured capabilities or
retrieve context at runtime. Use a direct API or scheduled job when the workflow
is fixed and repeatable. The guide to [APIs, MCP, and command-line interfaces](/docs/ai/apis-mcp-and-clis/)
has a practical decision tree.

## A maintainable first configuration

Keep the first production setup boring:

- one agent
- one clearly owned workspace
- the minimum tool set required
- read-only access for new integrations
- secrets outside the repository and prompt
- logs for actions that change another system
- a short `MEMORY.md` and searchable detail in `memory/`

Add another agent, plugin, or memory service only when you can name the problem
it solves. This keeps the runtime understandable when something fails.

## Primary references

- [Agent systems glossary](/docs/ai/agent-systems-glossary/)
- [OpenClaw agent runtime](https://docs.openclaw.ai/concepts/agent)
- [OpenClaw tools, skills, and plugins](https://docs.openclaw.ai/tools)
- [OpenClaw memory overview](https://docs.openclaw.ai/concepts/memory)
- [OpenClaw multi-agent routing](https://docs.openclaw.ai/concepts/multi-agent)
