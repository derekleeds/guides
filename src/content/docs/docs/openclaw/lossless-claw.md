---
title: "Lossless Context Management with Lossless Claw"
linkTitle: "Lossless Claw"
date: 2026-03-15
lastUpdated: 2026-08-19
authors: ["Derek Leeds"]
weight: 10
description: "How Lossless Claw preserves OpenClaw conversation history with SQLite, hierarchical summaries, and tools that recover compacted messages."
---

Long-running AI agent sessions eventually run out of context. The usual response is compaction: older conversation turns are summarized so recent work can stay in the model's active context window. That keeps the session moving, but an ordinary summary may omit a decision, command result, or constraint that matters later.

Lossless Claw is a context engine plugin for OpenClaw. It stores the full conversation in SQLite and replaces one-way compaction with a hierarchy of summaries. The agent can search that history and expand a summary back toward the underlying messages when it needs more detail.

This guide explains where Lossless Context Management, or LCM, fits in an agent memory architecture and how to evaluate it without confusing conversation history with durable memory.

## What LCM solves

A model can process only a limited number of tokens at once. In a long session, the runtime must decide what remains in the active prompt.

With a simple sliding window, old messages fall out of context:

```text
[older messages] [recent messages] [current request]
       removed when the context window fills
```

With LCM, the active prompt contains recent messages plus summaries of older sections:

```text
[summary branch] [summary branch] [recent messages] [current request]
       |                |
       +---- stored raw messages and lower-level summaries
```

Lossless Claw persists raw messages and links them to summaries in a directed acyclic graph. As a session grows, it can summarize older material again at a higher level while retaining the lower levels in storage.

That design helps with:

- decisions made early in a long session;
- tool output that no longer fits in active context;
- the reason behind a current implementation choice;
- searches across compacted conversation history.

It does not make the model remember everything automatically. The agent still has to search or expand the right history, and a weak summary can make relevant material harder to notice.

## LCM is not the whole memory system

LCM manages conversation history. It does not replace durable project notes, source-controlled documentation, or a retrieval index over a knowledge base.

| Layer                | Main question                                                        | Example                                           |
| -------------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| Active context       | What can the model see right now?                                    | Recent turns and selected summaries               |
| Conversation history | What happened earlier in this session?                               | Lossless Claw and its SQLite store                |
| Durable memory       | What should survive across sessions as an explicit fact or decision? | OpenClaw memory files, runbooks, or project notes |
| Retrieval            | Which existing documents are relevant to this request?               | OpenClaw memory search or QMD                     |

Use LCM when losing the detail of a long working session is the problem. Use durable memory when a fact should be curated and carried into future sessions. Use a retrieval tool such as QMD when the agent needs to search a larger document collection. The [agent memory architecture guide](/docs/memory-management/) explains how these layers work together.

## Check compatibility first

Lossless Claw and OpenClaw are both changing. OpenClaw's session storage work and the plugin's release line can affect compatibility. Before installing or upgrading, read the [current Lossless Claw compatibility notes](https://github.com/Martian-Engineering/lossless-claw) and compare them with your installed OpenClaw version.

Test the plugin on a noncritical agent before enabling it for long-lived production sessions. Back up the OpenClaw configuration and any existing LCM database first.

## Install the plugin

Install the current release through the OpenClaw plugin command:

```bash
openclaw plugins install @martian-engineering/lossless-claw@latest
openclaw gateway restart
```

The installer normally selects Lossless Claw for the `contextEngine` slot. Confirm the resulting configuration rather than copying a large configuration block from an older guide.

If the slot was not selected, the relevant portion of `~/.openclaw/openclaw.json` should identify the plugin as the context engine:

```json
{
  "plugins": {
    "slots": {
      "contextEngine": "lossless-claw"
    }
  }
}
```

Restart the gateway after a manual configuration change.

## Start with the defaults

At the time of this update, the documented defaults protect 64 recent messages, begin compaction at 75 percent of the context window, and use one level of incremental condensation:

```json
{
  "freshTailCount": 64,
  "contextThreshold": 0.75,
  "incrementalMaxDepth": 1
}
```

Treat these as a starting point, not universal tuning advice. The right values depend on model context size, average tool output, session length, and the amount of recent verbatim detail an agent needs.

- A larger `freshTailCount` keeps more recent messages untouched but consumes more active context.
- A lower `contextThreshold` compacts sooner and leaves more headroom for the next response or tool result.
- More summary depth supports longer sessions but makes retrieval depend on additional summary layers.

Change one setting at a time and test with a realistic session. Avoid copying older examples that set unlimited depth unless the current documentation and your test results support it.

## Recover compacted history

Lossless Claw exposes tools the agent can use when the active summary is not enough:

- `lcm_grep` searches messages and summaries.
- `lcm_describe` returns details about a summary node.
- `lcm_expand` opens a summary to reveal lower-level summaries or messages.

A useful workflow is to search for a distinctive project term, inspect the matching summary, then expand only the branch that contains the needed detail. This is cheaper and less noisy than restoring an entire old conversation to active context.

The plugin also provides status and inspection commands. Use the current project documentation for exact CLI syntax because it may change between releases.

## Storage and backups

Every retained message adds to the local SQLite database. That is the feature, but it creates operational responsibilities:

- include the database in an appropriate backup plan;
- protect it like any other file containing conversation history and tool output;
- monitor disk use for agents with long or frequent sessions;
- avoid opening the live database with tools that may hold a write lock;
- define a retention policy for sensitive or obsolete sessions.

The database may contain secrets that appeared in prompts or tool results. LCM preserves history; it does not sanitize it. Prevent secrets from entering agent conversations and restrict filesystem access to the store.

## Validate before relying on it

Run a controlled test that is long enough to trigger compaction:

1. Record a distinctive decision early in the session.
2. Continue until Lossless Claw creates summaries.
3. Ask the agent to recover the decision and its supporting detail.
4. Confirm that search locates the right branch.
5. Expand that branch and compare the recovered messages with the original.
6. Restart the gateway and confirm the expected history remains available.

Also test failure cases: unavailable summary model, full disk, locked database, plugin disabled, and rollback to the built-in context engine. A successful installation is not the same as verified recovery.

## Rollback

Before changing the context engine, stop active work and back up the configuration and LCM data. Disable the plugin or restore the previous `contextEngine` slot, then restart the gateway.

Keep the database until you have confirmed that the replacement configuration is stable and that no conversation history is still needed. Do not delete it as part of the first rollback step.

## When to use Lossless Claw

LCM is a good fit for agents that handle long investigations, multi-hour implementation sessions, or recurring operational work where the sequence of decisions matters. It adds less value to short, disposable conversations.

The practical test is simple: if ordinary compaction regularly removes details that the agent needs later in the same working history, LCM addresses that specific problem. If the real problem is finding information across a note collection or preserving a reviewed fact between unrelated sessions, improve retrieval or durable memory instead.

## References

- [Lossless Claw repository and current compatibility notes](https://github.com/Martian-Engineering/lossless-claw)
- [Lossless Context Management paper](https://papers.voltropy.com/LCM)
- [Agent memory architecture guide](/docs/memory-management/)
