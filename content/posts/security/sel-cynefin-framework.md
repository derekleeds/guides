---
title: "SEL × Cynefin: Security and Autonomy for AI Agents"
date: 2026-03-13
lastmod: 2026-03-13
authors: ["Derek Leeds"]
categories: [agents, security]
tags: [openclaw, cynefin, security, autonomy, framework]
description: "A practical framework for classifying agent capabilities by security level and domain complexity. Know when agents can act autonomously and when they need human approval."
weight: 20
---

AI agents need to know two things before acting:
1. **What tools can I use?** (Security Execution Level)
2. **How autonomous can I be in this domain?** (Cynefin classification)

This guide shows you how to implement both, with OpenClaw-specific examples and prompts.

## Prerequisites

- OpenClaw installed and configured
- Basic understanding of AI agents
- Familiarity with [Cynefin framework](https://en.wikipedia.org/wiki/Cynefin_framework)

## Background

### The Problem

When you have 150+ agents (like we do after installing Agency), you need answers to:

- Can the `researcher` agent run `docker restart`?
- Should the `homelab-guardian` agent be able to delete files?
- Does the `code-crafter` need approval before pushing to GitHub?
- When should an agent escalate to a human?

The answer isn't binary. It depends on both the **tools** available and the **domain** complexity.

### Related Reading

- [Domain Classification for Agent Autonomy](https://journal.derekleeds.cloud/domain-classification-agent-autonomy/) — First principles of Cynefin for agents
- [Security Execution Levels](https://journal.derekleeds.cloud/security-execution-levels/) — How we developed this framework
- [MCP Bridge paper](https://arxiv.org/abs/2504.08999) — Inspiration for security levels

---

## Part 1: Security Execution Levels (SEL)

SEL defines **what tools** an agent can use:

### SEL-0: Read-only

**Tools:** `read`, `web_fetch`, `web_search`, `memory_search`, `qmd`

**Use for:** Information gathering agents that should never modify state.

**Example agents:** `researcher`, `qa-reviewer`

```yaml
sel:
  default: 0
  sandbox_required: false
capabilities:
  allowed_tools: [web_search, web_fetch, memory_search, memory_get]
  denied_tools: [exec, write, edit, message, gateway]
```

### SEL-1: Standard

**Tools:** SEL-0 + `write` (workspace files), `exec` (non-destructive commands)

**Use for:** Agents that create content but shouldn't touch the system.

**Example agents:** `communicator`, `librarian`

```yaml
sel:
  default: 1
  sandbox_required: false
capabilities:
  allowed_tools: [read, write, web_search, web_fetch, memory_*]
  denied_tools: [exec, edit]  # Edit may include system files
```

### SEL-2: Elevated

**Tools:** SEL-1 + `exec` (destructive), `edit` (any file), `gateway` (config changes)

**Use for:** Infrastructure agents that need to modify the system.

**Requires:** `/approve` before destructive operations

**Example agents:** `homelab-guardian`, `devops-engineer`

```yaml
sel:
  default: 1
  elevated_to: 2
  elevated_for: [docker_restart, docker_rm, package_install]
  sandbox_required: false
```

### SEL-3: Quarantine

**Tools:** Arbitrary code execution, untrusted API calls

**Use for:** Running untrusted code, processing untrusted input

**Requires:** Per-operation approval + Docker sandbox

**Example uses:** Running user-provided scripts, processing unknown files

```yaml
sel:
  default: 3
  sandbox_required: true
capabilities:
  allowed_tools: [exec_sandbox]  # Only sandboxed execution
  network:
    allowed_domains: []
    denied_domains: ["*"]
```

---

## Part 2: Cynefin Domain Classification

Cynefin defines **how autonomous** an agent can be in a given domain:

### Clear Domain

**Characteristics:** Best practices exist, cause-effect is obvious, predictable outcomes.

**Agent behavior:** Autonomous execution

**Human role:** Exception handling only

### Complicated Domain

**Characteristics:** Expert analysis needed, multiple valid approaches.

**Agent behavior:** Recommend with analysis, wait for approval

**Human role:** Approve and implement

### Complex Domain

**Characteristics:** Patterns emerge in retrospect, no single right answer.

**Agent behavior:** Probabilistic prediction, flag uncertainty

**Human role:** Interpret, decide, adjust

### Chaotic Domain

**Characteristics:** Unknown unknowns, no discernible cause-effect.

**Agent behavior:** Contain, escalate, document

**Human role:** Diagnose, respond, learn

---

## Part 3: SEL × Cynefin Matrix

The combination determines agent behavior:

| Cynefin \ SEL | SEL-0 | SEL-1 | SEL-2 | SEL-3 |
|---------------|-------|-------|-------|-------|
| **Clear** | ✅ Autonomous | ✅ Autonomous | ⚠️ Approve first | ❌ Escalate |
| **Complicated** | ✅ Autonomous | ⚠️ Approve | ⚠️ Approve | ❌ Escalate |
| **Complex** | ✅ Research | ⚠️ Uncertainty | ❌ Human required | ❌ Escalate |
| **Chaotic** | ✅ Observe | ❌ Escalate | ❌ Escalate | ❌ Full stop |

### Decision Logic

```
IF domain is Clear AND tool SEL ≤ 1:
    → Execute autonomously

IF domain is Clear AND tool SEL = 2:
    → Request approval, explain cause-effect, execute on /approve

IF domain is Complicated AND tool SEL ≤ 0:
    → Execute autonomously (research/analysis)

IF domain is Complicated AND tool SEL = 1+:
    → Recommend with analysis, wait for approval

IF domain is Complex:
    → Report findings with uncertainty estimates, defer decisions

IF domain is Chaotic:
    → Immediately escalate, contain if possible, document everything
```

---

## Part 4: Implementation in OpenClaw

### Step 1: Classify Your Skills

Add `cynefin` and `sel` blocks to each skill's `SKILL.md`:

```yaml
---
name: homelab-guardian
description: Infrastructure automation and security for homelab
cynefin:
  primary: complicated
  subdomains:
    monitoring: clear      # Health checks are predictable
    management: complicated  # Requires analysis
    failure_recovery: complex # Emergent patterns
  rationale: "Infrastructure operations require expertise. Multiple valid approaches exist."
  autonomous: false
  human_approval: on_elevation
  confidence: medium
sel:
  default: 1
  elevated_to: 2
  elevated_for: [docker_restart, docker_rm, package_install]
  sandbox_required: false
capabilities:
  allowed_tools: [exec, read, write, edit]
  rate_limits:
    exec: "1 per 5s"
---
```

### Step 2: Define Agent SEL Ceilings

In your agent coordination config:

```yaml
agents:
  researcher:
    max_SEL: 0  # Can only use SEL-0 tools
    
  communicator:
    max_SEL: 1  # Can use SEL-0 and SEL-1
    
  homelab-guardian:
    max_SEL: 2  # Can use SEL-0, SEL-1, SEL-2 (with approval for SEL-2)
```

### Step 3: Implement Approval Flow

When an agent wants to use an SEL-2 tool:

```python
def check_sel_permission(agent, tool, domain):
    tool_sel = get_tool_sel(tool)
    agent_max_sel = agent.max_SEL
    domain_cynefin = get_domain_classification(domain)
    
    # SEL ceiling check
    if tool_sel > agent_max_sel:
        return {"action": "deny", "reason": f"Tool requires SEL-{tool_sel}, agent limited to SEL-{agent_max_sel}"}
    
    # Cynefin autonomy check
    if domain_cynefin == "chaotic":
        return {"action": "escalate", "reason": "Chaotic domain requires human intervention"}
    
    if domain_cynefin in ["complex", "complicated"] and tool_sel >= 1:
        return {"action": "approve", "reason": f"{domain_cynefin} domain needs approval for SEL-{tool_sel}"}
    
    if tool_sel >= 2:
        return {"action": "approve", "reason": f"SEL-{tool_sel} always requires approval"}
    
    return {"action": "execute", "reason": "Within bounds"}
```

---

## Part 5: Prompts for OpenClaw

### Classifying a New Skill

```
Classify this skill using the SEL × Cynefin framework:

Skill: [skill name]
Description: [what it does]
Tools it uses: [list of tools]

Provide:
1. SEL level (0-3) with rationale
2. Cynefin domain (clear/complicated/complex/chaotic) with subdomains
3. Whether it should be autonomous
4. When it needs human approval
```

### Checking Agent Permissions

```
Can the [agent name] agent use [tool name] for [task]?

Check:
1. Agent's max SEL vs tool's required SEL
2. Task domain Cynefin classification
3. Decision: autonomous / approve / escalate

Explain your reasoning.
```

### Onboarding New Agents

```
 onboard the [agent name] agent:

1. What is its primary purpose?
2. What tools does it need?
3. What domain(s) does it operate in?
4. Assign SEL ceiling
5. Classify Cynefin domains
6. Define capability boundaries
7. Document escalation paths
```

---

## Part 6: Common Patterns

### Pattern: Read-Only Research Agent

```yaml
# researcher agent
cynefin:
  primary: complicated
  subdomains:
    search: clear
    analysis: complicated
sel:
  default: 0
capabilities:
  allowed_tools: [web_search, web_fetch, memory_search, memory_get]
  denied_tools: [exec, write, edit, message]
```

**Behavior:** Can search and analyze autonomously, can't modify anything.

### Pattern: Infrastructure Agent

```yaml
# homelab-guardian agent
cynefin:
  primary: complicated
  subdomains:
    monitoring: clear
    management: complicated
    recovery: complex
sel:
  default: 1
  elevated_to: 2
  elevated_for: [docker_restart]
capabilities:
  allowed_tools: [exec, read, docker]
```

**Behavior:** Status checks autonomous, Docker restart needs approval.

### Pattern: Untrusted Code Runner

```yaml
# code-runner agent
cynefin:
  primary: chaotic
  subdomains:
    known_code: complicated
    unknown_code: chaotic
sel:
  default: 3
  sandbox_required: true
capabilities:
  allowed_tools: [exec_sandbox]
  network:
    denied_domains: ["*"]
```

**Behavior:** Always sandboxed, requires approval, no network access.

---

## Troubleshooting

### "Agent can't use tool it should have access to"

Check:
1. Agent's `max_SEL` vs tool's required SEL
2. Domain Cynefin classification (complex domains limit autonomy)
3. Capability boundary `denied_tools` list

### "Agent is asking for approval when it shouldn't"

Check:
1. Is the task in a Clear domain?
2. Is the SEL ≤ 1?
3. Is the domain classified correctly?

### "How do I elevate temporarily?"

Use `/approve <reason>` in the session. Approval applies to the next elevated operation only.

---

## Related Documentation

- `memory/procedural/security-execution-levels.md` — Full SEL framework
- `memory/procedural/domain-classification.md` — Cynefin classification guide
- `memory/procedural/agent-onboarding-contract.md` — Agent onboarding process
- [Journal: Security Execution Levels](https://journal.derekleeds.cloud/security-execution-levels/)

---

*This framework was developed while onboarding 154 Agency agents. All 62 skills in our OpenClaw install now have SEL + Cynefin classification.*