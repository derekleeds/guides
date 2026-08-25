---
title: "Use Obsidian as Human and Agent Memory"
linkTitle: "Obsidian as agent memory"
date: 2026-08-24
lastUpdated: 2026-08-24
authors: ["Derek Leeds"]
categories: [ai, agents]
tags: [ai, agents, obsidian, knowledge-management]
description: "Build a durable, local Markdown knowledge layer that humans can browse and AI agents can search, update, and verify."
weight: 3
---

<figure class="tool-hero">
  <img src="/images/recommended-tools/obsidian.svg" alt="Obsidian logo" width="240" height="240" />
  <figcaption>Obsidian icon from <a href="https://selfh.st/icons/">selfh.st/icons</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</figcaption>
</figure>

Conversation history is not durable knowledge. It is useful context for a session, but important decisions, runbooks, and evidence need an owner that both people and tools can inspect later.

[Obsidian](https://obsidian.md/) is a knowledge application built around local Markdown files. That simple storage model makes it unusually useful for human-and-agent collaboration: people get a strong writing and navigation interface, while agents can work with ordinary text files instead of a proprietary document database.

## Four kinds of context

It helps to separate four things that are often called “memory”:

- **Active context** is what the model can see right now.
- **Conversation history** is the transcript of earlier turns.
- **Durable memory** is knowledge intentionally saved for later use.
- **Retrieval** is the process that finds relevant durable knowledge for a new task.

Obsidian is strongest as the durable layer. Search or agent tools can retrieve from it, but the vault remains useful even when those tools change.

## Why Markdown matters

A Markdown note is readable in Obsidian, a text editor, a Git diff, or a terminal. That gives the knowledge layer several useful properties:

- no single agent runtime owns the content;
- a human can review every proposed change;
- links and metadata can create navigation without hiding the source;
- backups and version history use familiar file tools; and
- notes remain portable if the surrounding AI stack is replaced.

This does not mean “dump every transcript into the vault.” Durable memory should be curated. Save the decision, evidence, owner, and next action—not every token that led there.

## What Obsidian Skills add

The [Obsidian Skills repository](https://github.com/kepano/obsidian-skills) provides reusable instructions for agents working with Obsidian-specific formats and workflows. Its skills cover areas such as Obsidian Markdown, Bases, JSON Canvas, command-line vault operations, and clean web-page extraction.

A **skill** is guidance that teaches an agent how to perform a kind of task. It is not the same thing as an Obsidian community plugin, and it is not automatically permission to edit an entire vault.

Useful agent workflows include:

- search for an existing owner before creating a note;
- read local folder instructions and templates;
- create valid frontmatter and wikilinks;
- update the nearest index when navigation changes;
- preserve attachments and managed blocks; and
- verify that changed links resolve.

## A practical vault boundary

Use the vault for durable narrative knowledge: plans, guides, decisions, investigations, and dated observations.

Do not make it the source of truth for everything. Code and machine-readable desired state belong in their repositories. Current runtime state belongs to the live system. Passwords and tokens belong in a secrets manager such as 1Password.

This division keeps the vault useful without turning it into an inaccurate copy of the rest of the environment.

## Safety and maintenance

An agent that can edit a vault can also delete context, create duplicates, or spread a mistaken claim across many notes. Start with bounded tasks and require a full read before edits.

Good rules include:

- prefer an existing note over a duplicate;
- make the smallest coherent change;
- use explicit links when names are ambiguous;
- record dates and sources for current-state claims;
- keep secrets out of Markdown; and
- verify exact reads and search after writing.

Obsidian works well as agent memory because it does not require people to surrender ownership of the knowledge. The files remain visible, editable, and understandable outside the agent.

## Official resources

- [Obsidian](https://obsidian.md/)
- [Obsidian Help](https://help.obsidian.md/)
- [Obsidian Skills repository](https://github.com/kepano/obsidian-skills)
