---
title: "Skills, Memory, and Context in Hermes"
linkTitle: "Skills & Memory"
date: 2026-06-13
lastUpdated: 2026-06-13
authors: ["Derek Leeds"]
weight: 3
description:
  "A practical guide to choosing the right knowledge layer in Hermes: skills,
  memory, session search, Obsidian, and source control."
categories:
  - Hermes Agent
tags:
  - hermes-agent
  - skills
  - memory
  - obsidian
  - context
draft: false
---

Hermes has several ways to remember things. They are not interchangeable.
Putting the right information in the right layer is what keeps an agent useful
instead of turning it into a haunted clipboard.

## The Layers

| Layer               | Use it for                                     | Do not use it for                   |
| ------------------- | ---------------------------------------------- | ----------------------------------- |
| **Current context** | The active task and immediate conversation     | Durable knowledge                   |
| **Session search**  | Finding what happened in prior chats           | Source-of-truth documentation       |
| **Memory**          | Stable preferences and environment facts       | Task logs, secrets, temporary state |
| **Skills**          | Repeatable procedures and workflows            | One-off project status              |
| **Obsidian**        | Plans, runbooks, incidents, architecture notes | Code or manifests                   |
| **Git**             | Code, manifests, config, published docs        | Private scratch notes               |

The mistake is treating all of these as "memory." They are different systems
with different jobs.

## Current Context

Current context is what Hermes can see in the active turn. It includes the
conversation, loaded skills, tool outputs, and selected memories. It is fast and
useful, but not durable.

If a decision matters after the session ends, write it somewhere durable:

- Obsidian for operational notes.
- Git for code and manifests.
- Skills for reusable procedures.
- Memory for stable facts and preferences.

## Session Search

Session search is for archaeology. It answers questions like:

```text
What did we decide about Hermes profiles last week?
```

```text
Find the session where we debugged the Obsidian search container.
```

It is useful evidence, not a source of truth. Once a decision is recovered, it
should be written into the appropriate note or repo.

## Durable Memory

Hermes memory should be compact and stable. Good memory saves you from repeating
yourself.

Good examples:

- The guides site is Cloudflare Pages-backed.
- The Obsidian vault path is `/home/derekleeds/obsidian/derekleedscloud`.
- The user prefers concise, validation-backed answers.

Bad examples:

- A commit hash from a task that will be stale next week.
- A temporary bug status.
- A pasted API key.
- A full runbook.

Memory is a scalpel. If it becomes a junk drawer, every future answer gets a
little worse.

## Skills

Skills are reusable operating procedures. A skill should include:

1. When to use it.
2. Exact commands or tool sequence.
3. Safety checks.
4. Common pitfalls.
5. Verification steps.

Skills are ideal for repeated workflows:

- publishing a guide
- deploying a Komodo stack
- checking a Kubernetes incident
- evaluating a new homelab tool
- safely using a specific API

When Hermes solves a tricky workflow, the durable lesson should usually become a
skill. That is how the agent gets better without stuffing every detail into the
base prompt.

## Obsidian

Obsidian is the written operational record. Use it for:

- project plans
- incident reports
- architecture decision records
- runbooks
- investigation notes
- guide mirrors

In my setup, guide posts are mirrored under:

```text
2_Areas/AI_LLM_Work/Guides Posts/
```

That mirror is not a replacement for the published site. It is a local knowledge
copy tied into the rest of the vault.

## Git

Git is the source of truth for things that execute or publish:

- Hugo guide source
- infrastructure manifests
- Helm charts
- Docker Compose stacks
- config templates
- CI workflows

If a change affects runtime or publication, it belongs in Git. Obsidian can link
to it, explain it, and preserve the rationale, but the executable artifact lives
in the repository.

## A Simple Decision Tree

Ask this before saving anything:

1. **Is it a secret?** Put it in 1Password, an env file, or SOPS. Not chat. Not
   memory. Not docs.
2. **Is it code or config?** Put it in Git.
3. **Is it a project decision or runbook?** Put it in Obsidian.
4. **Is it a reusable procedure?** Put it in a skill.
5. **Is it a stable preference or environment fact?** Put it in memory.
6. **Is it temporary task progress?** Leave it in the session or task note.

This keeps Hermes useful across long-running work without turning every session
into a landfill of stale facts.
