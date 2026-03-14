---
title: "OpenClaw Secrets Management with 1Password"
date: 2026-03-14
lastmod: 2026-03-14
authors: ["Derek Leeds"]
categories: [security, infrastructure]
tags: [openclaw, 1password, credentials, security, tutorial]
description: "Step-by-step tutorial for setting up 1Password CLI integration with OpenClaw to eliminate plaintext credentials from your agent configuration."
weight: 20
---
# OpenClaw Secrets Management with 1Password

This guide walks through setting up 1Password as a centralized secret provider for OpenClaw. By the end, every API key, token, and credential in your OpenClaw config will resolve at runtime through 1Password — nothing sensitive stored in plaintext.

## Prerequisites

- OpenClaw installed and running
- 1Password account (personal or business)
- 1Password CLI (`op`) installed
- Basic familiarity with OpenClaw's `openclaw.json` config

## Part 1: Install and Configure 1Password CLI

### Install the CLI

```bash
# Ubuntu/Debian
curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
  sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" | \
  sudo tee /etc/apt/sources.list.d/1password.list

sudo apt update && sudo apt install 1password-cli

# Verify
op --version
```

### Create a Service Account

For non-interactive (agent) access, you need a service account — not a personal sign-in.

1. Go to your 1Password admin console
2. Navigate to **Developer** → **Service Accounts**
3. Create a new service account with access to your vault
4. Copy the service account token

### Set the Token

Add the service account token to your OpenClaw environment:

```bash
# In ~/.openclaw/.env
OP_SERVICE_ACCOUNT_TOKEN=ops_your_service_account_token_here
```

This is the one secret that bootstraps access to everything else. Protect this file with appropriate permissions:

```bash
chmod 600 ~/.openclaw/.env
```

### Verify Access

```bash
# Test that op can authenticate
export OP_SERVICE_ACCOUNT_TOKEN="ops_your_token"
op vault list
op item list --vault "Your-Vault-Name"
```

## Part 2: Create a Vault and Add Credentials

### Create a Dedicated Vault

Keep OpenClaw credentials separate from personal items:

```bash
# Via 1Password web UI or CLI
op vault create "OpenClaw-API-Keys"
```

### Add Credentials

For each API key your OpenClaw instance uses:

```bash
# Create items with the password field
op item create \
  --category=password \
  --title="ANTHROPIC_API_KEY" \
  --vault="OpenClaw-API-Keys" \
  password="sk-ant-your-key-here"

op item create \
  --category=password \
  --title="OPENROUTER_API_KEY" \
  --vault="OpenClaw-API-Keys" \
  password="sk-or-v1-your-key-here"

op item create \
  --category=password \
  --title="DISCORD_TOKEN" \
  --vault="OpenClaw-API-Keys" \
  password="your-discord-bot-token"
```

### Verify Items

```bash
# List all items (titles only, never echo values)
op item list --vault OpenClaw-API-Keys --format json | jq '.[].title'

# Verify a specific item resolves (check existence, not value)
op read "op://OpenClaw-API-Keys/ANTHROPIC_API_KEY/password" > /dev/null && echo "OK" || echo "FAILED"
```

> **Important:** Never echo secret values to terminal, logs, or chat. Always verify with existence checks.

## Part 3: Configure OpenClaw Secret Providers

### Add Exec Providers

In `openclaw.json`, add a `secrets.providers` entry for each credential:

```json
{
  "secrets": {
    "providers": {
      "onepassword_anthropic": {
        "source": "exec",
        "command": "/usr/bin/op",
        "args": ["read", "op://OpenClaw-API-Keys/ANTHROPIC_API_KEY/password"],
        "jsonOnly": false,
        "passEnv": ["HOME", "OP_SERVICE_ACCOUNT_TOKEN"],
        "allowInsecurePath": true
      },
      "onepassword_openrouter": {
        "source": "exec",
        "command": "/usr/bin/op",
        "args": ["read", "op://OpenClaw-API-Keys/OPENROUTER_API_KEY/password"],
        "jsonOnly": false,
        "passEnv": ["HOME", "OP_SERVICE_ACCOUNT_TOKEN"],
        "allowInsecurePath": true
      }
    }
  }
}
```

### Key Configuration Notes

| Field | Purpose | Notes |
|-------|---------|-------|
| `source` | Always `"exec"` for CLI-based providers | |
| `command` | Full path to `op` binary | Use `which op` to find it |
| `args` | Arguments for `op read` | Format: `op://Vault/Item/Field` |
| `jsonOnly` | Set `false` for raw text output | `op read` returns raw text, not JSON |
| `passEnv` | Environment variables to forward | Must include `OP_SERVICE_ACCOUNT_TOKEN` |
| `allowInsecurePath` | Allow non-user-owned binaries | Required because `op` is owned by root |

### Common Field Names

Most 1Password items use `password` as the field name, but watch for variations:

- `password` — Standard for most items
- `credential` — Some items created through web UI
- `token` — Custom field name
- `notesPlain` — Notes field

Check your item's field structure:

```bash
op item get "ITEM_NAME" --vault "OpenClaw-API-Keys" --format json | \
  jq '[.fields[] | select(.value != null) | .label]'
```

## Part 4: Replace Plaintext Values with SecretRefs

### Config-Level Credentials

Replace plaintext apiKey values with SecretRef objects:

**Before:**
```json
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BSA-actual-key-value"
      }
    }
  }
}
```

**After:**
```json
{
  "tools": {
    "web": {
      "search": {
        "apiKey": {
          "source": "exec",
          "provider": "onepassword_brave",
          "id": "value"
        }
      }
    }
  }
}
```

### Skill Credentials

Same pattern for skill configs:

```json
{
  "skills": {
    "entries": {
      "todoist": {
        "apiKey": {
          "source": "exec",
          "provider": "onepassword_todoist",
          "id": "value"
        }
      }
    }
  }
}
```

### Agent Auth Profiles

For model provider credentials, use auth-profiles instead of direct apiKey values.

Create `auth-profiles.json` in each agent's directory (`~/.openclaw/agents/<name>/agent/auth-profiles.json`):

```json
{
  "version": 1,
  "profiles": {
    "openrouter:default": {
      "type": "api_key",
      "provider": "openrouter",
      "keyRef": {
        "source": "exec",
        "provider": "onepassword_openrouter",
        "id": "value"
      }
    },
    "anthropic:default": {
      "type": "token",
      "provider": "anthropic",
      "tokenRef": {
        "source": "exec",
        "provider": "onepassword_anthropic",
        "id": "value"
      }
    },
    "cloudflare-ai-gateway:default": {
      "type": "api_key",
      "provider": "cloudflare-ai-gateway",
      "keyRef": {
        "source": "exec",
        "provider": "onepassword_cloudflare",
        "id": "value"
      }
    }
  }
}
```

Then set the `apiKey` in the agent's `models.json` to `"secretref-managed"`:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "secretref-managed"
    },
    "anthropic": {
      "apiKey": "secretref-managed"
    }
  }
}
```

### Local Services (No Auth Needed)

If a provider doesn't require authentication (local Ollama, local Whisper), remove the `apiKey` field entirely rather than setting a placeholder:

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434",
      "api": "ollama"
    }
  }
}
```

## Part 5: Validate and Restart

### Pre-Flight Backup

Always back up before restarting:

```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d-%H%M%S)
```

### Run the Secrets Audit

```bash
openclaw secrets audit --check
```

Target output:
```
Secrets audit: clean. plaintext=0, unresolved=0, shadowed=0, legacy=0.
```

If you see `REF_UNRESOLVED`, the SecretRef can't resolve. Common causes:

| Error | Cause | Fix |
|-------|-------|-----|
| "returned invalid JSON" | Wrong `id` value (e.g., `"google/apiKey"` instead of `"value"`) | Use `"id": "value"` for `op read` providers |
| "must be owned by current user" | Missing `allowInsecurePath` | Add `"allowInsecurePath": true` |
| "provider not found" | Typo in provider name | Check `secrets.providers` key matches |
| "command failed" | `OP_SERVICE_ACCOUNT_TOKEN` not available | Add to `passEnv` array |

### Restart Gateway

```bash
openclaw gateway restart
```

If things break, restore:

```bash
cp ~/.openclaw/openclaw.json.backup.TIMESTAMP ~/.openclaw/openclaw.json
openclaw gateway restart
```

## Part 6: Best Practices

### Migration Strategy

1. **Start with low-risk credentials** — Skills and non-critical integrations first
2. **Test one at a time** — Validate each SecretRef resolves before moving to the next
3. **Save critical-path credentials for last** — Discord token, primary model provider keys
4. **Back up before every restart** — Revert should always be one command away

### Security Hygiene

- **One vault, one purpose** — Keep OpenClaw credentials in a dedicated vault
- **Service account, not personal** — Don't rely on interactive sign-in for agent access
- **Never echo values** — Verify credentials exist with `> /dev/null && echo OK`, never print them
- **Audit regularly** — Run `openclaw secrets audit --check` after any config change
- **Restrict `.env` permissions** — `chmod 600` on the file containing `OP_SERVICE_ACCOUNT_TOKEN`

### Operational Notes

- **Boot order matters** — The `OP_SERVICE_ACCOUNT_TOKEN` must be available in the environment when OpenClaw starts. If using systemd, ensure the `.env` file is loaded via `EnvironmentFile=`
- **1Password CLI caches** — The CLI caches auth sessions. If you rotate the service account token, restart the gateway to pick up the new one
- **Field name consistency** — Standardize on `password` as the field name when creating vault items. It makes `op read` paths predictable

### Adding New Credentials

When you add a new integration:

1. Create the 1Password vault item
2. Add a `secrets.providers` entry in `openclaw.json`
3. Reference it with a SecretRef in the appropriate config location
4. Run `openclaw secrets audit --check`
5. Restart and verify

## Quick Reference

### SecretRef Format
```json
{
  "source": "exec",
  "provider": "<provider_name>",
  "id": "value"
}
```

### Provider Template
```json
"onepassword_<name>": {
  "source": "exec",
  "command": "/usr/bin/op",
  "args": ["read", "op://OpenClaw-API-Keys/<ITEM_TITLE>/password"],
  "jsonOnly": false,
  "passEnv": ["HOME", "OP_SERVICE_ACCOUNT_TOKEN"],
  "allowInsecurePath": true
}
```

### Useful Commands
```bash
# Audit current state
openclaw secrets audit --check

# List vault items
op item list --vault OpenClaw-API-Keys --format json | jq '.[].title'

# Verify a specific item (never echo the value)
op read "op://OpenClaw-API-Keys/ITEM/password" > /dev/null && echo "resolves: yes"

# Backup config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d-%H%M%S)
```

---

*Written based on a real migration from 127 plaintext credentials to zero on an OpenClaw homelab deployment. March 2026.*
