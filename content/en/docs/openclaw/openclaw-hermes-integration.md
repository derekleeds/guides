---
title: "OpenClaw + Hermes: Multi-Agent Infrastructure"
date: 2026-04-14
description: "Connect OpenClaw (Clawdia) to Hermes Agent for delegating infrastructure tasks via HTTP API. Manage Docker, Kubernetes, and GitOps through conversational commands."
author: "Derek Leeds"
categories:
  - OpenClaw
  - Infrastructure
tags:
  - multi-agent
  - gitops
  - api-integration
  - homelab
  - docker
  - komodo
draft: false
---

Connect OpenClaw (Clawdia) to Hermes Agent for delegating infrastructure tasks via HTTP API. This lets you manage Docker, Kubernetes, and GitOps operations through conversational commands.

## What You'll Learn

- When to use multi-agent architecture for infrastructure tasks
- How to connect OpenClaw to Hermes via HTTP API
- Configuring the Hermes integration skill
- Querying Docker, deploying stacks, and managing GitOps
- Security considerations for agent-to-agent communication

## Why Multi-Agent?

Running everything in one agent creates a security problem. Infrastructure tasks need terminal and Docker access—capabilities you don't want tied to your general-purpose assistant.

| Agent | Scope | Tools |
|-------|-------|-------|
| **OpenClaw (Clawdia)** | General tasks, user interaction | Web search, Discord, skills |
| **Hermes** | Infrastructure, GitOps | Terminal, Docker, kubectl, Komodo API |

Splitting these concerns means:
- Hermes can have elevated host access while staying isolated
- OpenClaw delegates infrastructure work through a controlled API
- Each agent does what it's designed for

Both agents run on the same host (`openclaw-node01`) and communicate over localhost.

## The Architecture

```
┌─────────────────┐         HTTP API          ┌─────────────────┐
│   OpenClaw      │  ═══════════════════════► │     Hermes      │
│   (Clawdia)     │    localhost:8642         │   (SRE Agent)   │
│                 │  ◄═══════════════════════ │                 │
│  - Skills       │    JSON responses         │  - Terminal     │
│  - Memory       │                           │  - Docker       │
│  - Subagents    │                           │  - Komodo API   │
└─────────────────┘                           │  - kubectl      │
                                              └─────────────────┘
```

Communication stays on `127.0.0.1:8642`—no external exposure needed.

## Prerequisites

- OpenClaw running (see [Getting Started with OpenClaw](https://guides.derekleeds.cloud/docs/openclaw/getting-started-openclaw/))
- Hermes Agent installed with GitOps configured
- Python 3.10+ with `httpx`
- Hermes API key (stored in 1Password or secrets manager)

## Step 1: Configure Hermes API Server

Hermes exposes an OpenAI-compatible HTTP API that OpenClaw uses to delegate tasks.

### 1.1 Configure Environment

Add to `~/.hermes/.env`:

```bash
# Enable API server
API_SERVER_ENABLED=true
API_SERVER_KEY=${HSM_HERMES_API_KEY}

# Bind to localhost only
API_SERVER_HOST=127.0.0.1
API_SERVER_PORT=8642
```

> **Security**: `127.0.0.1` restricts access to the local machine only. Hermes has full terminal access—don't expose this port externally.

### 1.2 Start the Server

Via Komodo:

```yaml
services:
  hermes-api:
    image: hermes-agent:latest
    command: hermes gateway
    env_file: ~/.hermes/.env
    ports:
      - "127.0.0.1:8642:8642"  # Bind to localhost only
    restart: unless-stopped
```

Or run directly:

```bash
hermes gateway
```

### 1.3 Verify

```bash
curl http://127.0.0.1:8642/health
```

Expected: `{"status": "ok"}`

## Step 2: Install the OpenClaw Skill

The Hermes skill lives at `~/.openclaw/skills/hermes/`.

### 2.1 Set API Key

```bash
# In ~/.openclaw/.env
export HERMES_API_KEY=$(op read op://OpenClaw/hermes-api/key)
```

### 2.2 Skill Structure

The skill provides a Python client (`hermes.py`) and configuration (`SKILL.md`). Place the skill files in:

```
~/.openclaw/skills/hermes/
├── SKILL.md          # Skill definition
├── hermes.py         # Python client
└── README.md         # Usage docs
```

### 2.3 Restart OpenClaw

```bash
openclaw gateway restart
```

## Step 3: Test the Integration

### Example: Check Docker Status

```python
from hermes import HermesClient

async def check_containers():
    hermes = HermesClient()
    
    result = await hermes.chat(
        message="Run 'docker ps' and show running containers",
        system_prompt="Execute commands and report results concisely."
    )
    
    print(result)
    await hermes.close()
```

**What happens:**
1. OpenClaw sends the request to Hermes via HTTP API
2. Hermes executes `docker ps` using its terminal tool
3. Results return formatted through the API

## Available Tools

Hermes exposes these capabilities through the API:

| Category | Tools | Use Case |
|----------|-------|----------|
| **Infrastructure** | `terminal`, `process`, `file_read`, `file_write` | Run commands, manage files |
| **Docker** | Via terminal | Container lifecycle |
| **GitOps** | `delegate_task`, `skill_view` | Deploy stacks, manage repos |
| **Observability** | `web_search`, `web_extract` | Debug issues |
| **State** | `memory`, `todo` | Track tasks |

## Common Usage Patterns

### Pattern 1: One-Shot Infrastructure Query

For quick checks where you just need the answer:

```python
result = await hermes.chat(
    message="How much disk space is left on /var/lib/docker?",
    system_prompt="Run 'df -h /var/lib/docker' and report the result."
)
```

### Pattern 2: Stateful Multi-Turn Conversation

For complex tasks requiring context:

```python
from hermes import HermesSession

session = HermesSession(hermes, "postgres-deploy-001")

# First message establishes context
await session.send("I need to deploy a PostgreSQL database")

# Subsequent messages have full context
await session.send("Use the template from /opt/stacks/templates/postgres")
await session.send("Set the password from my secrets manager")
```

### Pattern 3: Stream Long Operations

```python
async for chunk in hermes.chat_stream("Deploy nextcloud stack"):
    print(chunk, end="")  # Live progress updates
```

## API Reference

### HermesClient

```python
class HermesClient:
    def __init__(
        self,
        base_url: str = "http://127.0.0.1:8642",
        api_key: Optional[str] = None,
        timeout: float = 300.0  # 5 minutes for long operations
    )
    
    async def chat(
        self,
        message: str,
        system_prompt: Optional[str] = None,
        stream: bool = False
    ) -> str
    
    async def chat_stream(
        self,
        message: str
    ) -> AsyncGenerator[str, None]
    
    async def close(self)
```

### Error Handling

```python
from httpx import HTTPStatusError, ConnectError

try:
    result = await hermes.chat("Deploy stack")
except ConnectError:
    print("Hermes API not running. Start with: hermes gateway")
except HTTPStatusError as e:
    if e.response.status_code == 401:
        print("Invalid API key. Check HERMES_API_KEY")
    else:
        print(f"API error: {e}")
```

## Security Best Practices

### Authentication
- Store `API_SERVER_KEY` in 1Password or similar—never in code
- Use environment variable injection, not hardcoded strings
- Rotate keys periodically

### Network Security
- **Always bind to `127.0.0.1`**—never `0.0.0.0` or public interfaces
- Both agents should run on the same trusted host
- Consider firewall rules to block external access to port 8642

### Scope of Access
Remember: Hermes has **full terminal access** to your host. Be intentional about:
- Which OpenClaw agents can invoke Hermes
- What commands you're delegating
- Using read-only operations when possible for safety

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | Hermes API not running | Start with `hermes gateway` |
| 401 Unauthorized | Invalid API key | Verify `HERMES_API_KEY` is set and matches Hermes config |
| Timeout errors | Long-running command | Increase `timeout` parameter in `HermesClient` (default 300s) |
| Import errors | Missing dependencies | Install httpx: `pip install httpx` |

### Known Issue: Import Variable Not Defined

**Error:** `NameError: name 'HAS_REQUESTS' is not defined`

**Cause:** The client tries multiple HTTP libraries but doesn't initialize fallback variables properly.

**Fix:** Initialize all flags before the try blocks:

```python
# In hermes.py
HAS_HTTPX = False
HAS_REQUESTS = False

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    pass

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    pass
```

## Real-World Examples

### Deploy a Stack via Komodo

```python
result = await hermes.chat(
    message="Deploy the 'nextcloud' stack using Komodo. Ensure volumes are created first.",
    system_prompt="You are a GitOps SRE. Use the Komodo API to deploy Docker Compose stacks."
)
```

### Check Kubernetes Pod Status

```python
result = await hermes.chat(
    message="Check the status of pods in the monitoring namespace",
    system_prompt="Use kubectl to get pod status and report any issues."
)
```

### File Operations with Safety

```python
result = await hermes.chat(
    message="Show me the last 50 lines of /var/log/syslog",
    system_prompt="Read the file and display the content. Do not make changes."
)
```

## Next Steps

- Add specialized agents for other domains
- Automate infrastructure checks with cron
- Set up alerts for Hermes-reported issues
- Document your own runbooks as delegatable tasks

## Resources

- [Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server)
- [OpenClaw Skills Framework](https://docs.openclaw.ai/tools/skills)
- [AgentSkills Specification](https://agentskills.io/specification)
- [Hermes-Clawdia Integration Notes](https://obsidian.derekleeds.cloud/OpenClaw%20%26%20AI%20work/OpenClaw/Hermes-Clawdia%20Integration)

---

*Last updated: April 14, 2026*

Have questions or feedback? Open an issue on the [guides repository](https://github.com/derekleeds/guides).
