---
title: "Lossless Claw: Never Lose Context Again"
linkTitle: "Lossless Claw"
date: 2026-03-15
lastmod: 2026-03-15
authors: ["Derek Leeds"]
weight: 10
description: "A practical guide to installing and configuring Lossless Context Management for OpenClaw - never lose conversation history to compaction again."
---

Every LLM has a context window — a maximum number of tokens it can process. When a conversation exceeds this limit, most agents simply truncate older messages. **Lossless Claw** replaces truncation with a DAG-based summarization system that preserves every message while keeping active context within model token limits.

## What You'll Learn

- Why context loss happens and why it matters
- How LCM (Lossless Context Management) preserves every message
- Step-by-step installation and configuration
- Best practices for long-lived agent sessions

## The Problem: Context Loss

When context exceeds the token limit:

```
[message 1] [message 2] ... [message 150]
                    ↓ Context window exceeded
[message 120] [message 121] ... [message 150]  ← First 119 messages LOST
```

**What you lose:**

- Earlier instruction context
- Decisions made at session start
- Tool outputs and results
- The "why" behind current work

## The Solution: Lossless Context Management

Lossless Claw preserves every message through hierarchical summarization:

```
[raw messages 1-8]    → leaf_summary_1
[raw messages 9-16]   → leaf_summary_2
...
[leaf_summary_1-4]    → condensed_summary
```

Raw messages are never deleted — they're stored in SQLite and linked to summaries. Agents can drill down through the DAG to recover any original message using `lcm_grep`, `lcm_describe`, or `lcm_expand`.

## Key Benefits

| Feature | Benefit |
|---------|---------|
| **Nothing lost** | Every message preserved in SQLite database |
| **Searchable history** | `lcm_grep`, `lcm_describe`, `lcm_expand` tools |
| **Configurable depth** | Unlimited condensation with `incrementalMaxDepth: -1` |
| **Large file handling** | Big attachments stored separately, summarized |
| **Cost control** | Use cheaper models for summarization |

## Installation

### Prerequisites

- OpenClaw with plugin context engine support
- Node.js 22+
- LLM provider configured

### Install via OpenClaw CLI

```bash
openclaw plugins install @martian-engineering/lossless-claw
```

### Restart Gateway

```bash
openclaw gateway restart
```

## Configuration

### Basic Configuration

Add to your `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "allow": ["lossless-claw"],
    "slots": {
      "contextEngine": "lossless-claw"
    },
    "entries": {
      "lossless-claw": {
        "enabled": true,
        "config": {
          "freshTailCount": 64,
          "contextThreshold": 0.70,
          "incrementalMaxDepth": -1
        }
      }
    }
  }
}
```

### Key Settings Explained

| Setting | Value | Purpose |
|---------|-------|---------|
| `freshTailCount` | `64` | Last N messages protected from compaction |
| `contextThreshold` | `0.70` | Start compaction at 70% of context window |
| `incrementalMaxDepth` | `-1` | Unlimited condensation depth |

### Cost Optimization

Summaries don't need top-tier reasoning. Use a cheaper model for compaction:

```bash
# Add to ~/.openclaw/.env
LCM_SUMMARY_MODEL=ollama-cloud/glm-5
LCM_SUMMARY_PROVIDER=ollama-cloud
```

This uses GLM-5 for summarization while your main conversation uses a more capable model.

## Extend Session Lifetime

LCM preserves context, but OpenClaw still resets sessions. Extend the idle timeout:

```json
{
  "session": {
    "reset": {
      "mode": "idle",
      "idleMinutes": 10080
    }
  }
}
```

**Common values:**

- `1440` = 1 day
- `10080` = 7 days
- `43200` = 30 days

## Agent Tools

LCM provides three tools for agents to recall compacted history:

### `lcm_grep`

Search across all messages and summaries:

```bash
lcm_grep(query: "kubernetes", mode: "regex", allConversations: true)
```

### `lcm_describe`

Get details about a specific summary:

```bash
lcm_describe(id: "sum_abc123")
```

### `lcm_expand`

Drill down into a summary to recover original messages:

```bash
lcm_expand(summaryIds: ["sum_abc123"], includeMessages: true)
```

## Storage

### Database Location

```
~/.openclaw/lcm.db
```

### Size Considerations

- Every message is stored
- SQLite database grows linearly
- No built-in pruning (manual cleanup available via TUI)

### Backup

```bash
# Simple backup
cp ~/.openclaw/lcm.db ~/.openclaw/lcm.db.backup
```

## Best Practices

1. **Set `freshTailCount` appropriately** - Higher values protect more recent context at cost of earlier compaction
2. **Use cost-effective summary models** - GLM-5, local Ollama models
3. **Monitor database size** - Check `~/.openclaw/lcm.db` periodically
4. **Extend session lifetime** - Match `idleMinutes` to your work patterns
5. **Test with long sessions** - Verify compaction behavior before production

## Comparison to Alternatives

| Solution | Context Preservation | Searchable | Setup Complexity |
|----------|---------------------|------------|------------------|
| **LCM (Lossless Claw)** | ✅ Full DAG | ✅ Built-in tools | Low (plugin) |
| Sliding window | ❌ Lost | ❌ No | None |
| External memory files | ⚠️ Manual | ⚠️ Manual grep | High |
| Vector DB (QMD) | ✅ Embeddings | ✅ Semantic | Medium |

## Common Issues

### Plugin not loading

```
[plugins.allow is empty; discovered non-bundled plugins may auto-load
```

**Fix:** Add explicit allowlist:

```json
{
  "plugins": {
    "allow": ["lossless-claw"]
  }
}
```

### Summarization failing

Check your LLM provider configuration:

```bash
openclaw models list
```

### Database locked

Close any database viewers and restart gateway:

```bash
openclaw gateway restart
```

## Rollback

To disable LCM:

```json
{
  "plugins": {
    "slots": {},
    "entries": {
      "lossless-claw": {
        "enabled": false
      }
    }
  }
}
```

Then restart gateway. Your `lcm.db` is preserved.

## Resources

- [Lossless Claw GitHub](https://github.com/Martian-Engineering/lossless-claw)
- [LCM Paper](https://papers.voltropy.com/LCM)
- [Animated Visualization](https://losslesscontext.ai)
- [Configuration Guide](https://github.com/Martian-Engineering/lossless-claw/blob/main/docs/configuration.md)

## Next Steps

1. Install and configure (above)
2. Run a long session (2+ hours)
3. Use `lcm_grep "topic"` to test recall
4. Check `~/.openclaw/lcm.db` size after heavy use
5. Adjust `contextThreshold` and `freshTailCount` to taste

---

*Now your agent never forgets. Because it doesn't have to.*