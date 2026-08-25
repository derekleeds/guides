---
title: "Manage Tailscale Policy with GitHub Actions"
linkTitle: "Tailscale Policy with GitHub Actions"
date: 2026-08-25
lastUpdated: 2026-08-25
authors: ["Derek Leeds"]
categories: [security, infrastructure, gitops]
tags:
  [
    tailscale,
    github-actions,
    gitops,
    access-control,
    hujson,
    policy-as-code,
    ci,
  ]
description: "A practical GitOps guide for storing a Tailscale policy in a private GitHub repository, testing pull requests, applying reviewed merges, and recovering safely."
weight: 6
---

<figure class="tool-hero">
  <a href="https://tailscale.com/">
    <img src="/images/tailscale-docktail/tailscale.svg" alt="Tailscale logo" width="240" height="240" />
  </a>
  <figcaption>
    <a href="https://tailscale.com/">Tailscale</a> icon from
    <a href="https://selfh.st/icons/">selfh.st/icons</a>, licensed under
    <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
    See the <a href="https://tailscale.com/docs">official documentation</a>.
  </figcaption>
</figure>

A Tailscale policy is security-sensitive configuration. Once the tailnet matters,
editing that policy only in a browser leaves too much intent in memory and too
little in reviewable history.

GitOps gives the policy:

- a durable source file,
- an exact diff,
- pull-request review,
- automated policy validation and tests,
- a rollback commit,
- an audit trail.

Tailscale supports a GitHub Actions workflow in which pull requests run the
policy action in `test` mode, while pushes to the default branch run it in
`apply` mode.[9]

That boundary is the most important fact in this guide:

```text
Pull request → validate and test only
Merge to main → validate, test, and apply to the live tailnet
```

Read [Design a Tailscale Access Policy](/docs/security/tailscale-access-policy/)
before building automation around a policy you do not yet understand.

## Safety boundary

Merging this repository is a live network-security change.

A draft branch or pull request should not mutate the tailnet. The merge to the
apply branch should happen only after the exact diff, test results, blast radius,
and rollback are understood.

Use a **private** repository. Tailscale warns that policy files can contain
personally identifiable information such as users' email addresses.[9]

## What you will build

```text
private GitHub repository
├── policy.hujson
└── .github/
    └── workflows/
        └── tailscale.yml
```

The workflow will:

1. check out the repository,
2. authenticate to Tailscale without placing credentials in Git,
3. test pull requests,
4. apply only pushes to `main` after tests pass.[9]

## Prerequisites

You need:

- an existing tailnet,
- owner or appropriate network administration authority,
- a reviewed current policy,
- a private GitHub repository,
- permission to configure GitHub Actions secrets or trust credentials,
- a recovery path if the applied policy blocks important access.

Before importing the policy, decide which source is authoritative. Once GitHub
is the source of truth, emergency console edits can be overwritten by the next
successful apply.[9]

## 1. Create the private repository

Create a private repository dedicated to the Tailscale policy. Keep the
repository small. It needs policy, workflow, and concise operating documentation
—not a framework in search of employment.

A minimal `.gitignore` is enough:

```text
.env
*.local
```

Never store OAuth secrets, API keys, auth keys, or downloaded credentials in the
repository.

## 2. Import the current live policy

In the Tailscale admin console, open **Access controls** and copy the current
policy into:

```text
policy.hujson
```

Tailscale policy files use HuJSON, which permits comments and trailing commas.[9]

Do not “clean up” the policy during the import. The first commit should preserve
the known live behavior so later diffs have a trustworthy baseline.

Example skeleton:

```json
{
  "groups": {},
  "tagOwners": {},
  "grants": [],
  "tests": []
}
```

Your actual file should come from the live policy, not from this empty example.

## 3. Add policy tests before automation

Tests should cover critical access and critical denials:

```json
{
  "tests": [
    {
      "src": "admin@example.com",
      "accept": ["tag:server:22"],
      "deny": ["tag:database:5432"]
    }
  ]
}
```

Use the current policy syntax reference for the exact forms your policy
requires.[8]

At minimum, protect:

- the administration path you need for recovery,
- an ordinary user path,
- an automation or agent path,
- a sensitive path that must remain denied.

## 4. Create a Tailscale trust credential

Prefer a Tailscale trust credential or OAuth-based workflow over a manually
rotated user API token. Give it only the policy permissions required by the
GitOps action.

Record only the non-secret configuration names in your repository. Put secret
values in GitHub's encrypted Actions secrets or the supported trust-credential
configuration.[9]

Common secret names in Tailscale's GitHub Actions documentation include:

```text
TS_TAILNET
TS_OAUTH_ID
TS_AUDIENCE
```

Depending on the authentication method you choose, the current action may use an
OAuth audience, OAuth secret, or API key. Follow the current Tailscale action
documentation rather than copying an old credential shape from a blog post.[9]

## 5. Add the GitHub Actions workflow

Create `.github/workflows/tailscale.yml`:

```yaml
name: Sync Tailscale policy

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  policy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Test policy
        if: github.event_name == 'pull_request'
        uses: tailscale/gitops-acl-action@v1
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_ID }}
          audience: ${{ secrets.TS_AUDIENCE }}
          tailnet: ${{ secrets.TS_TAILNET }}
          policy-file: policy.hujson
          action: test

      - name: Apply policy
        if: github.event_name == 'push'
        uses: tailscale/gitops-acl-action@v1
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_ID }}
          audience: ${{ secrets.TS_AUDIENCE }}
          tailnet: ${{ secrets.TS_TAILNET }}
          policy-file: policy.hujson
          action: apply
```

Tailscale's documented action behavior is:

- `action: test` validates the policy and runs its tests without updating the
  tailnet;
- `action: apply` validates, tests, and then updates the live policy when the
  checks succeed.[9]

Review the current upstream action before first use. Pinning a reviewed full
commit SHA provides stronger supply-chain control than a floating major-version
tag. If you pin it, use dependency automation to propose future updates.

## 6. Protect the `main` branch

Configure branch protection so `main` requires:

1. a pull request,
2. the Tailscale policy test job,
3. at least one appropriate reviewer,
4. no unresolved conversations,
5. a current branch before merge.

For a one-person homelab, “reviewer” may still be you after a pause and a fresh
read. The useful control is separating authoring from applying, not collecting
ceremonial approvals.

If agents can open pull requests, do not let their identity bypass branch
protection or merge policy changes automatically.

## 7. Make the first pull request

Use a no-behavior-change edit first, such as adding a harmless comment, only if
the action requires a test event after the baseline workflow exists.

Verify:

- the pull request job uses `action: test`,
- the apply step is skipped,
- policy validation succeeds,
- all built-in tests pass,
- no live policy change occurred.

Then close or merge according to the change's intent. Remember that merging
invokes the live apply path.

## 8. Change policy safely

For each real policy change:

1. Pull the current `main` branch.
2. Confirm Git and the live policy have not drifted.
3. Create a focused branch.
4. Change the smallest useful policy section.
5. Add or update positive and negative tests.
6. Open a pull request.
7. Review the exact HuJSON diff.
8. Require the test workflow to pass.
9. Record expected impact and rollback.
10. Merge only with live-apply authority.
11. Verify the apply job for the merge commit.
12. Read back the live policy and test the real connection.

A green pull-request test proves the candidate is valid according to its tests.
It does not prove the intended user can log in to the application, that DNS
resolves, or that the backend is healthy.

## Agent-assisted policy changes

An agent can help:

- explain a policy block,
- draft a narrow grant,
- add tests,
- compare a source policy with a retrieved live policy,
- open a pull request for review,
- summarize CI failures.

An agent should not receive automatic merge authority merely because it can
produce valid HuJSON. Tailscale's official coding-agent skill is alpha and says
to verify generated commands, syntax, and configuration before production use.[4]

A good division of labor is:

```text
Agent: inspect, draft, test, explain
CI: validate exact candidate
Human or guarded control plane: approve merge/apply
Runtime check: prove intended allow and deny behavior
```

See [SEL and Cynefin Framework for Agent Autonomy](/docs/security/sel-cynefin-framework/)
for a general way to place approval boundaries around agent actions.

## DockTail policy changes

DockTail may require:

- `tagOwners` entries for the host and service tags,
- `autoApprovers.services` for approved service hosts,
- grants that let selected users or workloads reach the Tailscale Service.[10][11]

Keep the runtime and policy changes reviewable as separate concerns:

1. prepare and validate the policy change,
2. apply and verify it,
3. then activate or reconcile DockTail labels,
4. verify the service from an allowed client,
5. verify denial from a disallowed identity where practical.

Read [DockTail](/docs/infrastructure/docktail/) for the Compose side.

## Prevent accidental console drift

Tailscale provides a policy file management setting that warns or prevents
normal editing through the admin console when GitOps owns the policy.[9]

Do not enable that setting until:

- the GitHub workflow has been tested,
- the repository is recoverable,
- the workflow credential works,
- the apply path is understood,
- another administrator knows the break-glass process.

Authorized administrators may still use **Edit anyway** for emergencies. The
next GitOps apply can overwrite that emergency edit, so reconcile the change
back into Git immediately.[9]

## Rollback

### Before merge

Close the pull request or delete the branch. The test workflow should not have
changed the live tailnet.

### After merge

Revert the merge commit through a reviewed pull request. The revert merge will
run the apply workflow and restore the previous policy if validation and tests
pass.[9]

If the bad policy blocks the normal workflow or recovery path:

1. use an authorized break-glass administrator,
2. restore a known-good policy through the Tailscale admin control plane,
3. repair or revert Git immediately,
4. rerun the GitOps workflow,
5. verify source and live policy match again.

Do not leave an emergency console edit as undocumented permanent drift.

## Verification checklist

After every approved merge:

- [ ] The merge commit is the reviewed commit.
- [ ] The pull-request test job passed.
- [ ] The push apply job passed for the merge commit.
- [ ] The live policy matches repository `main` semantically.
- [ ] The intended connection succeeds from the intended identity.
- [ ] A protected connection remains denied.
- [ ] DockTail or another dependent service advertises correctly, if applicable.
- [ ] No secret values appeared in logs, commits, or screenshots.
- [ ] Rollback instructions still work.

## Continue the series

- [Tailscale for People and AI Agents](/docs/infrastructure/tailscale-for-people-and-ai-agents/)
- [Design a Tailscale Access Policy](/docs/security/tailscale-access-policy/)
- [DockTail: Private Docker Services over Tailscale](/docs/infrastructure/docktail/)
- [APIs, MCP, and CLIs](/docs/ai/apis-mcp-and-clis/)
- [Architectural Decisions: Writing Down the Why](/docs/infrastructure/architectural-decisions/)

## Sources

- [4] [Tailscale skill for coding agents](https://tailscale.com/docs/features/tailscale-skill)
- [8] [Tailnet policy syntax](https://tailscale.com/docs/reference/syntax/policy-file)
- [9] [GitOps for Tailscale with GitHub Actions](https://tailscale.com/docs/integrations/github/gitops)
- [10] [Tailscale Services](https://tailscale.com/docs/features/tailscale-services)
- [11] [DockTail source and documentation](https://github.com/marvinvr/docktail)
