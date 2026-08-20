---
title: "Agent Autonomy Gates: SEL × Cynefin for Homelab GitOps"
linkTitle: "SEL × Cynefin Autonomy Gates"
date: 2026-03-13
lastUpdated: 2026-07-07
authors: ["Derek Leeds"]
categories: [agents, security]
tags:
  [
    openclaw,
    hermes-agent,
    cynefin,
    security,
    autonomy,
    gitops,
    homelab,
    framework,
  ]
description:
  "A practical framework for deciding when AI agents can act autonomously, when
  they need approval, and when they must stop and escalate in a homelab GitOps
  environment."
weight: 20
---

AI agents need two answers before they act:

1. **What kind of state can this action touch?** That is the Security Execution
   Level, or **SEL**.
2. **How predictable is the problem domain?** That is the **Cynefin**
   classification.

The useful policy is the combination:

> Agent autonomy = capability risk × domain uncertainty.

A read-only action in a clear domain can be autonomous. A destructive action in
a chaotic domain should stop, preserve evidence, and escalate. The rest lives in
the middle, where good systems require approval gates instead of vibes.

> [!note] 2026 status This guide started as an OpenClaw/Agency-era framework for
> classifying many agent skills. The original idea is still relevant, but the
> implementation details have changed. Treat this version as a current
> homelab/GitOps autonomy policy for Hermes, OpenClaw, Forgejo, Komodo, ArgoCD,
> Talos, and related operations — not as proof that every current skill has
> enforced SEL metadata.

## The short version

Use **SEL** to classify the action. Use **Cynefin** to classify the situation.
Then choose the autonomy gate.

| Situation                                          | Default agent behavior                                      |
| -------------------------------------------------- | ----------------------------------------------------------- |
| Low-risk action + clear domain                     | Execute autonomously and report result                      |
| Low-risk action + complicated domain               | Analyze autonomously; recommend if state changes are needed |
| Write or deploy action                             | Prepare change; require approval before mutation            |
| Destructive or network/security action             | Require explicit approval, rollback path, and verification  |
| Incident, compromise, data loss, or untrusted code | Contain, preserve evidence, escalate                        |

The point is not to slow down every task. The point is to make the risky tasks
obvious before they turn into archaeology.

## Part 1: Security Execution Levels

Security Execution Levels classify what an action is allowed to touch.

### SEL-0: Read-only

**Meaning:** Inspect, search, summarize, query, and report. No state mutation.

**Homelab examples:**

- Read Forgejo repositories and diffs.
- Query Komodo stack status.
- Query ArgoCD application health.
- Read logs, metrics, and inventory.
- Search Obsidian notes.
- Review a public article or upstream doc.

**Default gate:** Autonomous.

**Rule:** If the action cannot change state, an agent can usually do it without
approval. It still needs to cite evidence and say when data is stale or
unverified.

### SEL-1: Draft or local non-runtime writes

**Meaning:** Create or edit non-runtime artifacts that do not immediately affect
production.

**Homelab examples:**

- Draft an Obsidian plan or runbook.
- Create a Forgejo branch.
- Edit a Markdown guide.
- Draft Helm, Kustomize, Compose, or Komodo TOML changes without deploying.
- Generate reports, diagrams, or review notes.

**Default gate:** Autonomous for drafts; human review before promotion.

**Rule:** Agents can create candidate source-of-truth changes, but those changes
are not real until they are reviewed, committed, and reconciled through the
proper GitOps path.

### SEL-2: Controlled mutation

**Meaning:** Change source of truth or trigger a controlled reconciliation.

**Homelab examples:**

- Commit and push to a source-of-truth repository.
- Merge a Forgejo pull request.
- Run an ArgoCD sync.
- Deploy or restart a Komodo-managed stack.
- Rotate a non-critical token through documented SOPS/1Password flow.
- Apply a low-risk, pre-reviewed Kubernetes manifest change.

**Default gate:** Approval required before mutation.

**Rule:** The agent should present the diff, expected effect, rollback path, and
verification command before acting. After approval, it should perform a
read-after-write verification.

### SEL-3: Destructive or high-blast-radius mutation

**Meaning:** Delete, revoke, rotate, reconfigure, expose, or patch something
where failure can cause outage, data loss, lockout, or security exposure.

**Homelab examples:**

- Delete persistent volumes, datasets, backups, repositories, or stack state.
- Change UniFi VLANs, DHCP, firewall rules, or routing.
- Change public DNS, ingress, Cloudflare, Tailscale exposure, or auth boundary.
- Patch Talos machine configuration.
- Rotate critical credentials or revoke service access.
- Enable prune/delete behavior in ArgoCD or Komodo.
- Run destructive database or filesystem maintenance.

**Default gate:** Explicit approval, named target IDs, rollback plan, and
post-change verification.

**Rule:** No bulk destructive API calls from inference. Stage read-only first,
show exact IDs, then wait for approval. If rollback is unknown, say that before
changing anything.

### SEL-4: Quarantine / incident mode

**Meaning:** The system may be compromised, input may be malicious, or the
failure mode is unknown enough that normal automation is unsafe.

**Homelab examples:**

- Suspicious PR or dependency anomaly.
- Exposed secret or leaked token.
- Unknown binary, script, container, or plugin.
- Possible malware or persistence mechanism.
- Active data loss, unexpected deletion, or widespread outage.
- Untrusted code execution request.

**Default gate:** Stop normal mutation. Contain, preserve evidence, escalate.

**Rule:** Do not “clean up” before capturing evidence. Use isolated sandboxes
for unknown code. Prefer read-only triage until the incident commander approves
a containment action.

## Part 2: Cynefin domain classification

Cynefin classifies how predictable the situation is.

### Clear

Cause and effect are obvious. There is a known best practice.

**Examples:**

- Format Markdown.
- Run a documented build.
- Check whether a URL returns HTTP 200.
- Query a known health endpoint.
- Update a guide index after adding a guide.

**Agent behavior:** Act autonomously if SEL is low. Report result and evidence.

### Complicated

Expertise is required. Multiple valid approaches may exist, but analysis can
identify a good path.

**Examples:**

- Choose between Helm chart options.
- Review a Renovate PR.
- Plan a Komodo stack migration.
- Design SOPS secret handling.
- Compare ingress/auth options.

**Agent behavior:** Analyze and recommend. Prepare source changes when useful.
Wait for approval before applying mutations.

### Complex

Patterns emerge over time. There may not be one correct answer yet.

**Examples:**

- Intermittent storage latency.
- Flaky cluster networking.
- Agent behavior drift.
- Performance regressions with multiple possible causes.
- Multi-service migration sequencing.

**Agent behavior:** Investigate, propose experiments, document uncertainty, and
avoid premature destructive fixes. Small reversible probes are better than grand
unified theories with a flamethrower.

### Chaotic

Cause and effect are unclear and time matters.

**Examples:**

- Suspected compromise.
- Active outage with unknown blast radius.
- Data loss in progress.
- Credential leak.
- Untrusted code attempting execution.

**Agent behavior:** Contain safely, preserve evidence, escalate, and document.
Normal automation pauses until the situation is stabilized.

## Part 3: The SEL × Cynefin matrix

| Cynefin \ SEL   | SEL-0 read-only             | SEL-1 draft/write    | SEL-2 controlled mutation | SEL-3 destructive/high-risk           | SEL-4 quarantine |
| --------------- | --------------------------- | -------------------- | ------------------------- | ------------------------------------- | ---------------- |
| **Clear**       | Autonomous                  | Autonomous           | Approval                  | Explicit approval                     | Escalate         |
| **Complicated** | Autonomous analysis         | Recommend / draft    | Approval                  | Explicit approval + rollback          | Escalate         |
| **Complex**     | Research                    | Document uncertainty | Human decision            | Human decision + rollback             | Escalate         |
| **Chaotic**     | Observe / preserve evidence | Escalate             | Escalate                  | Full stop unless containment approved | Incident mode    |

### Decision logic

```text
IF domain is Clear AND SEL <= 1:
  execute autonomously, then report evidence

IF SEL = 2:
  present diff/target/effect/rollback, wait for approval, then verify

IF SEL = 3:
  require explicit approval, exact target IDs, rollback plan, and post-checks

IF SEL = 4 OR domain is Chaotic:
  stop normal automation, preserve evidence, contain only if approved

IF domain is Complex:
  investigate, document uncertainty, propose reversible experiments
```

## Part 4: Mapping to the current homelab

### Forgejo

| Action                                          | SEL   | Gate                                               |
| ----------------------------------------------- | ----- | -------------------------------------------------- |
| Read repo, branch, PR, or diff                  | SEL-0 | Autonomous                                         |
| Create branch or draft file changes             | SEL-1 | Autonomous                                         |
| Commit and push to branch                       | SEL-2 | Approval when source-of-truth impact is meaningful |
| Merge to main/source-of-truth branch            | SEL-2 | Approval                                           |
| Delete repo, branch, release, or protected data | SEL-3 | Explicit approval                                  |

Forgejo is source of truth. If the change matters, it should be visible in Git
before it is reconciled anywhere else.

### Komodo

| Action                                          | SEL   | Gate              |
| ----------------------------------------------- | ----- | ----------------- |
| Read stack/server status                        | SEL-0 | Autonomous        |
| Draft Komodo TOML or Compose changes            | SEL-1 | Autonomous        |
| Deploy/redeploy/restart a stack                 | SEL-2 | Approval          |
| Remove stack, volume, server, or secret binding | SEL-3 | Explicit approval |

Komodo manages infrastructure and Compose workloads. Runtime clicks without
repo-backed intent are pet care. We are trying to stop feeding the pets.

### ArgoCD and Kubernetes

| Action                                    | SEL   | Gate                                    |
| ----------------------------------------- | ----- | --------------------------------------- |
| Read app health, events, logs, manifests  | SEL-0 | Autonomous                              |
| Draft Helm chart or values changes        | SEL-1 | Autonomous                              |
| Commit app manifest change                | SEL-2 | Approval if it affects runtime          |
| Sync app                                  | SEL-2 | Approval unless pre-approved automation |
| Prune/delete resources or persistent data | SEL-3 | Explicit approval                       |

For Kubernetes workloads, prefer Helm-compatible source under the cluster repo.
ArgoCD enforces the source; agents should not manually patch live objects except
as an explicitly approved break-glass operation.

### Talos

| Action                        | SEL     | Gate                               |
| ----------------------------- | ------- | ---------------------------------- |
| Read machine or cluster state | SEL-0   | Autonomous                         |
| Draft machine config patch    | SEL-1   | Autonomous                         |
| Apply machine config patch    | SEL-3   | Explicit approval                  |
| Reset, wipe, or rebuild node  | SEL-3/4 | Explicit approval or incident mode |

Talos has no SSH and no shell. Treat OS-level changes as machine configuration
changes, not node tinkering. The cattle are not emotionally attached to
`/etc/foo.conf`; neither should we be.

### UniFi, DNS, ingress, and Tailscale

| Action                                                | SEL   | Gate              |
| ----------------------------------------------------- | ----- | ----------------- |
| Inventory current networks, DNS, routes, ACLs         | SEL-0 | Autonomous        |
| Draft proposed changes                                | SEL-1 | Autonomous        |
| Change VLAN, DHCP, firewall, DNS, exposure, or ACLs   | SEL-3 | Explicit approval |
| Public exposure during incident or unknown auth state | SEL-4 | Incident mode     |

Network changes need a stricter gate because the blast radius is weird. A small
checkbox can become a Saturday.

### Secrets and credentials

| Action                                                            | SEL     | Gate              |
| ----------------------------------------------------------------- | ------- | ----------------- |
| Reference secret paths or env var names                           | SEL-0/1 | Autonomous        |
| Draft SOPS/1Password wiring                                       | SEL-1   | Autonomous        |
| Rotate non-critical secret through documented flow                | SEL-2/3 | Approval          |
| Rotate critical credentials, revoke access, or touch private keys | SEL-3   | Explicit approval |
| Suspected secret exposure                                         | SEL-4   | Incident mode     |

Never write plaintext secrets into prompts, docs, repos, logs, or workspace
files. Use 1Password references, SOPS, and environment variable names.

## Part 5: Agent role ceilings

A useful default policy for the homelab agent mesh:

| Role                          | Default ceiling | Notes                                                            |
| ----------------------------- | --------------- | ---------------------------------------------------------------- |
| Researcher                    | SEL-0           | Search, read, summarize, compare                                 |
| Reviewer                      | SEL-0/1         | Inspect diffs and draft findings                                 |
| Scribe                        | SEL-1           | Write docs, plans, guides, and vault notes                       |
| Coder                         | SEL-1/2         | Draft code and branches; approval for push/merge when meaningful |
| Ops                           | SEL-2           | Prepare and execute approved infra changes                       |
| Security / incident responder | SEL-4           | Triage and containment, but no cleanup before evidence           |
| Orchestrator                  | SEL-1           | Decompose work and delegate; avoid direct high-risk mutation     |

These are policy ceilings, not personality traits. A clever agent with a delete
token is still a delete token wearing a hat.

## Part 6: Prompt patterns

### Classify a task

```text
Classify this task using SEL × Cynefin:

Task: <task>
Target systems: <Forgejo/Komodo/ArgoCD/Talos/etc.>
Possible state changes: <none/draft/deploy/delete/network/secrets>
Known uncertainty: <clear/complicated/complex/chaotic>

Return:
1. SEL level and rationale
2. Cynefin domain and rationale
3. Autonomy decision: autonomous / approval / explicit approval / incident mode
4. Required evidence before action
5. Required verification after action
```

### Ask for approval on a controlled mutation

```text
Approval requested for SEL-2 action.

Target: <exact repo/app/stack/node>
Change: <summary>
Source diff: <path or commit>
Expected effect: <effect>
Rollback: <rollback path>
Verification: <post-checks>
Risk: <known risks>
```

### Ask for explicit approval on high-risk work

```text
Explicit approval requested for SEL-3 action.

Exact target IDs: <IDs/names>
Blast radius: <systems/users/data affected>
Why this is necessary: <reason>
Non-actions considered: <safer alternatives>
Rollback/restore plan: <plan>
Evidence captured: <read-only evidence>
Post-change verification: <checks>
```

### Enter incident mode

```text
Potential SEL-4 / chaotic-domain event.

Observed indicators: <facts only>
Systems potentially affected: <scope>
Immediate safe containment options: <options>
Evidence to preserve: <logs/snapshots/artifacts>
Actions explicitly NOT taken: <non-actions>
Decision needed: <human decision>
```

## Part 7: Practical homelab policy

Use these defaults unless a runbook or incident commander says otherwise:

1. **Read-only first.** Gather evidence before proposing mutation.
2. **Source of truth first.** If a change can be made in Forgejo, draft it
   there.
3. **Approval before runtime mutation.** Deploys, syncs, restarts, and merges
   need a clear gate when they affect running systems.
4. **Exact IDs before destructive APIs.** No fuzzy deletes.
5. **Rollback before blast radius.** If rollback is unknown, the risk is higher.
6. **No plaintext secrets.** Use 1Password references, SOPS, or env var names.
7. **Incident mode changes the rules.** Preserve evidence before cleanup.
8. **Document the outcome.** If it is not documented, it did not happen.

## Bottom line

SEL × Cynefin is still useful because it prevents the most common agent safety
mistake: treating all tasks as if they have the same risk.

They do not.

A read-only log query, a Forgejo branch edit, an ArgoCD sync, a Talos machine
config patch, and an unknown script from the internet are completely different
risk classes. The agent should know that before it acts.

Use SEL to classify the action. Use Cynefin to classify the uncertainty. Then
choose the right gate.
