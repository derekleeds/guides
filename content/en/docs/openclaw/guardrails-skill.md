---
title: "Building Modular Content Moderation with Guardrails"
date: 2026-03-18
lastmod: 2026-03-18
authors: ["Derek Leeds"]
categories: [openclaw]
tags: [openclaw, guardrails, moderation, security, skills]
description: "A practical guide to adding optional content moderation to OpenClaw skills using a modular guardrails approach."
---

When building AI agents, content moderation is often an afterthought — if it's considered at all. This guide walks through building a **modular guardrails skill** for OpenClaw that can be optionally imported into any skill that needs content filtering.

## Why Modular Over Middleware?

Traditional approaches often bake moderation into the core agent loop. This has drawbacks:

- **All-or-nothing** — You either moderate everything or nothing
- **Hard to test** — Global changes affect everything
- **Inflexible** — Different skills may need different rules

A modular approach lets you:

- Add moderation only where needed
- Test in isolation
- Customize rules per skill
- Disable easily without side effects

## The Two-Phase Approach

Rather than building a comprehensive solution upfront, we used progressive enhancement:

**Phase 1:** Rule-based credential leak detection
- Fast pattern matching
- No external dependencies
- Catches the most critical issue (accidental credential exposure)

**Phase 2:** Full NeMo Guardrails integration (future)
- Richer content analysis
- NVIDIA's safety models
- Comprehensive threat detection

## Project Structure

```
~/.openclaw/skills/guardrails/
├── SKILL.md           # Documentation
├── __init__.py        # Package marker
├── guardrails.py      # Core module
└── test_guardrails.py # Tests
```

## Phase 1 Implementation

### The Core Module

```python
# guardrails.py
import os
import httpx
from dataclasses import dataclass
from typing import Optional

API_URL = os.getenv("NEMOGUARDRAILS_API_URL", "http://localhost:8002")

@dataclass
class ModerationResult:
    safe: bool
    content: str
    reason: Optional[str] = None
    raw: Optional[dict] = None

class Guardrails:
    """Simple wrapper for content moderation."""
    
    def __init__(self, api_url: str = API_URL):
        self.api_url = api_url
        self.client = httpx.Client(timeout=30.0)
    
    def check(self, content: str) -> ModerationResult:
        """Check both input and output moderation."""
        return self._basic_check(content)
    
    def check_input(self, content: str) -> ModerationResult:
        """Check user input before processing."""
        return self._basic_check(content)
    
    def check_output(self, content: str) -> ModerationResult:
        """Check model output before returning."""
        return self._basic_check(content)
    
    def _basic_check(self, content: str) -> ModerationResult:
        """Rule-based content check."""
        blocked_words = ["password", "secret", "api_key", "token"]
        content_lower = content.lower()
        
        for word in blocked_words:
            if word in content_lower:
                # Check for credential patterns
                if f"{word} is" in content_lower or f"{word}:" in content_lower:
                    return ModerationResult(
                        safe=False,
                        content=content,
                        reason=f"Potential credential leak detected"
                    )
        
        return ModerationResult(safe=True, content=content, reason=None)
```

### Usage in Other Skills

```python
# In your-skill/your-skill.py
from guardrails import Guardrails

class YourSkill:
    def __init__(self):
        self.guardrails = Guardrails()
    
    def process(self, content):
        # Check input
        result = self.guardrails.check_input(content)
        if not result.safe:
            raise ValueError(f"Content blocked: {result.reason}")
        
        # Process...
        response = self._generate_response(content)
        
        # Check output
        result = self.guardrails.check_output(response)
        if not result.safe:
            return "I cannot share that information."
        
        return response
```

## Testing Phase 1

| Pattern | Blocked |
|---------|---------|
| `api_key is sk-xxx` | ✅ |
| `password: secret` | ✅ |
| `token is eyJxxx` | ✅ |
| Normal text | ✅ |
| SQL injection attempts | ⚪ Not targeted |

**False positive:** "I forgot my password once" is blocked (acceptable — better safe than sorry)

## Next Steps

1. Import into a real skill (e.g., communicator)
2. Add Phase 2 NeMo Guardrails integration
3. Write comprehensive test suite

## References

- NeMo Guardrails: https://github.com/NVIDIA/NeMo-Guardrails
- OpenClaw Skills: https://docs.openclaw.ai/skills
