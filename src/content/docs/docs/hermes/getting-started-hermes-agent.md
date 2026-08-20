---
title: "Getting Started with Hermes Agent"
linkTitle: "Getting Started"
date: 2026-06-13
lastUpdated: 2026-06-13
authors: ["Derek Leeds"]
weight: 1
description:
  "A practical introduction to Hermes Agent: what it is, where it fits, how to
  install it, and how to use it safely as an operational assistant."
categories:
  - Hermes Agent
tags:
  - hermes-agent
  - ai-agents
  - cli
  - desktop
  - homelab
draft: false
---

Hermes Agent is an AI agent runtime for doing real work from the terminal,
Discord, and other messaging platforms. It can call tools, read and write files,
run commands, search the web, use MCP servers, remember durable preferences, and
load reusable skills when a task needs a known workflow.

That makes it more than a chatbot. It is closer to an operator shell with an LLM
attached. Useful, sharp, and worth treating with the same respect you give
`kubectl`, `talosctl`, or a production database prompt.

## Where Hermes Fits

Hermes is the day-to-day operational assistant in my agent stack.

| Layer               | Role                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| **CLI**             | Fast local work, repo edits, debugging, and one-off commands         |
| **Desktop**         | Local chat-first interface for Windows and macOS users               |
| **Discord gateway** | Conversational control plane for homelab operations                  |
| **Tools**           | Terminal, files, browser, web, GitHub, Home Assistant, and more      |
| **Skills**          | Reusable procedures that load only when relevant                     |
| **Memory**          | Durable facts about preferences, environment, and stable conventions |
| **MCP**             | Typed integrations with external systems and internal services       |

OpenClaw is still useful as an orchestration and experimentation lineage. Hermes
is where I put the repeatable operator workflow: investigate, plan, edit the
source of truth, validate, and document the result.

## Install Hermes

For macOS and Windows, start with the official
[Hermes Agent Desktop installer](https://hermes-agent.nousresearch.com/desktop).
The Desktop installer is the recommended path when you want both the local app
and the command-line runtime.

The full
[Hermes Agent installation guide](https://hermes-agent.nousresearch.com/docs/getting-started/installation/)
also covers command-line-only installs for Linux, macOS, WSL2, and
Android/Termux.

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

After installation:

```bash
hermes setup
hermes doctor
hermes
```

`hermes setup` configures providers, tools, terminal behavior, memory, and
messaging integrations. `hermes doctor` checks whether the runtime is healthy.

## First Safe Tasks

Start with low-risk, read-only work:

```text
Summarize this repository's README and identify the build command.
```

```text
Check the current git status and tell me whether the working tree is clean.
```

```text
Search my notes for prior decisions about Hermes profiles.
```

Then move to bounded edits:

```text
Create a draft Markdown outline for a Hermes runbook. Do not modify existing files.
```

```text
Patch this one documentation file to add the new validation step, then show the diff.
```

Avoid starting with broad mutation requests like "fix my cluster" or "clean up
this repo." That is how Old World server folklore gets automated at machine
speed. Give Hermes scope, constraints, and an acceptance test.

## Basic Commands

```bash
# Start an interactive session
hermes

# Ask one question and exit
hermes chat -q "What changed in this git diff?"

# Pick or change the model/provider
hermes model

# Check runtime health
hermes doctor

# List configured tools
hermes tools list

# Resume recent work
hermes --continue
```

Hermes also supports named profiles, skill preloading, cron jobs, webhooks, MCP
servers, and gateway platforms. Treat those as power tools, not first-day
requirements.

## Safety Model

Hermes is most valuable when it can use real tools. That also means the safety
model matters.

- Prefer read-only discovery before mutation.
- Keep secrets in environment variables, 1Password, or SOPS-encrypted files.
- Do not paste API keys into chat.
- Use source control as the change boundary.
- Ask for diffs before applying risky edits.
- Validate with real commands, not vibes.

In my homelab, the rule is simple: Forgejo is the source of truth. Hermes can
help edit and validate it, but runtime state is not the truth just because a
container happens to be running.

## Next Steps

- Read [Hermes Agent Architecture](/docs/hermes/hermes-agent-architecture/)
  to understand the moving parts.
- Read [Skills, Memory, and Context in
  Hermes](/docs/hermes/hermes-skills-memory-context/) before storing
  knowledge in the wrong layer.
- Read [Hermes as a GitOps SRE
  Assistant](/docs/hermes/hermes-gitops-sre-assistant/) for the operational
  workflow I use in the homelab.
