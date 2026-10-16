---
title: "Muse: A Hosted Personal Agent in a Self-Hosted Stack"
linkTitle: "Muse in a self-hosted stack"
date: 2026-10-16
lastUpdated: 2026-10-16
authors: ["Derek Leeds"]
categories: [ai, muse]
tags: [muse, agents, tailscale, self-hosting, security]
description: "Understand how Meta's hosted Muse agent fits alongside self-hosted agents, what Sentinel enforces, and what connecting private services actually permits."
sidebar:
  order: 2
---

A hosted agent can do useful work alongside a self-hosted stack without becoming the operator of everything in it. The important question is not whether it can connect. It is which work belongs there, what data crosses the boundary, and what stops an authorized connection becoming an unauthorized action.

My Muse agent is named Marlow. The useful distinction is a collaborator with a managed computer, rather than another agent runtime I need to maintain. This guide explains that architecture and a bounded integration pattern; it is not a step-by-step network setup.

## What Muse actually is

[Meta describes Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) as a personal AI agent powered by Muse Spark, with a dedicated cloud virtual machine (VM), a browser, persistent files, and access to connected services. It can continue working after the app closes and communicate through the Muse app or WhatsApp.

Meta's [security architecture](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) distinguishes the agent's isolated runtime from security-sensitive services on that VM. The runtime has a Linux environment for tools, skills and scheduled jobs. Credential storage and the permission authority are outside that runtime. This is not an agent with unrestricted control of the host.

A **skill** is reusable instructions for a task or integration, sometimes accompanied by helper tools. A **connector** provides a path to another service. Neither term, by itself, says what access is authorized.

## Different operating responsibilities

The distinction between a self-hosted harness and a hosted agent is ownership, not a contest over which can remember or use a browser.

| Approach                                  | What the operator owns                                                                              | A useful role                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Self-hosted agent runtime, such as Hermes | Runtime updates, tool configuration, credentials and infrastructure access                          | Work that needs an operator-controlled execution environment |
| Coding agent, such as Codex               | Workspace selection, repository permissions, review and execution scope                             | Bounded code changes and verification                        |
| Hosted chat or agent service              | Account configuration, connected data and delegated authority; the provider operates the service    | Research, drafting and supported cross-service tasks         |
| Muse                                      | Connector grants, data choices, task boundaries and review; Meta operates the VM and agent platform | Persistent personal-agent workflows on a managed computer    |

These roles overlap. The table is a way to assign responsibility, not a claim that one product cannot perform another's tasks. For my stack, Hermes remains the on-network operator, coding agents handle repository work, and Muse is a place for research, drafting and bounded cross-service legwork.

## Tailscale access is a separate trust boundary

A **tailnet** is a private network of devices connected through Tailscale. Muse has an official Tailscale integration: [Tailscale documents](https://tailscale.com/blog/meta-muse-ai-agent-tailscale) Muse joining as its own node, making outbound connections, and using Tailscale SSH. Its article also describes one-time or standing access grants and revocation.

Do not turn a failed attempt through one tool into a product-wide limitation. API access, browser access, ordinary SSH and Tailscale SSH are different paths. Success on one does not establish the others. Record the paths actually tested, the date, the granted scope and anything still unverified.

Treat network enrollment as an access change, not a convenience toggle. Review the node's identity and applicable Tailscale policy, permit only the intended destinations and ports, and keep a way to revoke it. Network reachability does not authorize the agent to read every reachable service or perform every operation a credential permits.

## Credentials and Sentinel

According to Meta's architecture documentation, **Sentinel** is the separate permission authority for connector actions and network egress. Muse proposes an operation; Sentinel evaluates it and may allow it, deny it, or ask the user. It supports grants with different scopes and lifetimes. Not every request necessarily requires another prompt.

The documented credential mechanism uses **surrogates**: the agent receives a substitute token, while the underlying credential is inserted at the authorized network boundary. That is different from pasting an API key into a conversation or letting an agent read a credential file.

Use the platform's protected credential-entry flow, not chat. For custom integrations, confirm the supported authentication method and destination restrictions before connecting anything sensitive. A static-token mechanism is not automatically sufficient for a service requiring an interactive login or token refresh. An unsupported flow is a reason to stop, not to hand the password to the agent.

These are vendor-documented protections, not a guarantee that every integration is safe. Least-privilege service credentials and Tailscale policy remain useful independent controls. A read-only credential is stronger protection than an admin credential paired with a skill saying "do not write."

## An Obsidian integration pattern

A vault can separate discovery from mutation:

- **Read path:** a Model Context Protocol (MCP) search service exposes approved notes through a connector or helper. MCP is an interface through which an agent can discover and call tools.
- **Write path:** an authenticated, narrowly authorized interface applies deliberate edits. Obsidian's Local REST API plugin is one option; it depends on the desktop application being open.

This is an architecture pattern, not evidence that a particular endpoint is configured or available. A search filter is not an authorization boundary, and section-level editing does not prove the credential is section-scoped. Enforce the permitted vault or subtree at the service, filesystem or tool boundary where possible.

Keep ownership clear: the vault holds narrative knowledge; repositories hold code and machine-readable desired state; the designated live system owns current operational facts. Read the existing note before editing, approve the bounded change, read back the result, and refresh any search index that needs it. Preserve dated observations rather than silently rewriting history.

For implementation choices, use [Set Up an Obsidian Vault for People and AI Agents](/docs/ai/recommended-tools/setup-obsidian-vault-for-ai-agents/). For the daily routine, see [Close the Loop Between Your Workday and an Agent-Ready Vault](/docs/ai/recommended-tools/close-the-loop-with-an-agent-ready-vault/).

## Dedicated does not mean local

Connecting a private service lets a hosted system process information from it. A private transport protects the connection; it does not make the receiving agent self-hosted.

Meta's September 2026 architecture documentation says limited data leaves the VM for inference and telemetry. It describes training use of sanitized interaction trajectories and an opt-out setting. It also describes Confidential VM as a planned capability, rather than a protection to assume every account already has. Check the current product settings and policy before relying on those boundaries.

For work data, use only approved providers, connectors, storage and retention arrangements. Do not connect restricted systems or upload material merely because a network route exists. The same caution applies to sensitive family information: persistent memory should contain only what you deliberately want retained.

## A useful division of labor

Use a hosted agent where managed execution and cross-service context earn their keep. Keep work in your operator-controlled environment when it requires that environment's access, recovery path or governance. This is a placement decision, not a claim that Muse cannot perform infrastructure operations.

Start with one low-risk integration, a read-only credential and a specific task. Verify the result before adding authority. The operating contract matters more than the mascot.

Continue with [Delegate to an Agent with Grants and Gates](/docs/muse/delegate-with-grants-and-gates/) and [Give Your Agent Memory and a Schedule](/docs/muse/memory-and-a-schedule/).

## Sources

Product claims above are attributed to these primary sources, reviewed October 16, 2026; account-specific behavior still needs verification.

- [Meta: Introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
- [Meta: How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)
- [Tailscale: How Meta's Muse agent works with Tailscale](https://tailscale.com/blog/meta-muse-ai-agent-tailscale)
