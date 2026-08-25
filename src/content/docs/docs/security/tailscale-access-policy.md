---
title: "Design a Tailscale Access Policy"
linkTitle: "Tailscale Access Policy"
date: 2026-08-25
lastUpdated: 2026-08-25
authors: ["Derek Leeds"]
categories: [security, infrastructure, networking]
tags:
  [tailscale, access-control, grants, acl, hujson, zero-trust, policy-as-code]
description: "A beginner-to-advanced guide to Tailscale access policy: identities, tags, grants, tests, least privilege, and safe policy review."
weight: 5
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

Connecting devices to a tailnet answers one question:

> Which devices participate in this private network?

A Tailscale access policy answers the next question:

> Which identities may connect to which destinations, using which protocols and
> ports?

Without a deliberate policy, a small tailnet can quietly become a flat network.
That feels convenient right up until a personal laptop, unattended server, or AI
agent has more reach than intended.

Start with
[Tailscale for People and AI Agents](/docs/infrastructure/tailscale-for-people-and-ai-agents/)
if tailnets, nodes, and MagicDNS are new to you.

## The short version

A useful Tailscale policy has four jobs:

1. name human and workload identities,
2. define who owns tags,
3. grant only required connections,
4. test important allowed and denied paths.

Tailscale recommends **grants** for most new access rules. Legacy ACL rules
remain supported, and both forms can coexist, but grants are the modern unified
syntax for network and application capabilities.[6][7]

## Policy vocabulary

| Term              | Meaning                                                                       |
| ----------------- | ----------------------------------------------------------------------------- |
| **User**          | A person authenticated through the tailnet identity provider                  |
| **Group**         | A named set of users                                                          |
| **Tag**           | A non-human identity assigned to a server or workload                         |
| **Tag owner**     | An identity allowed to assign a tag                                           |
| **Grant**         | Allows a source to reach a destination with listed capabilities               |
| **ACL**           | The older network-layer allow-rule format                                     |
| **Auto-approver** | Lets approved identities advertise routes or services without manual approval |
| **Test**          | A policy assertion describing access that must be allowed or denied           |
| **HuJSON**        | JSON with comments and trailing commas, used by the policy file               |

The policy is allow-based. Rules describe permitted connections; everything else
is denied after you remove the default allow-all rule.[7]

## Before editing the policy

Access policy is live network security configuration. Prepare before changing
it:

1. Export or retrieve the current policy.
2. Confirm which source owns the durable copy.
3. List the exact connection that must work.
4. List at least one connection that must **not** work.
5. Identify a recovery path that does not depend on the new rule.
6. Make one coherent change.
7. Validate and review the exact diff.

If the policy is stored in Git, also confirm that the repository and the live
policy have not drifted before layering on a new edit.

## Beginner: replace “everyone can reach everything” deliberately

Do not start by deleting the default policy and improvising under pressure.
Inventory the paths you use first:

| Source              | Destination      | Port | Why                    |
| ------------------- | ---------------- | ---: | ---------------------- |
| Administrators      | Server nodes     |   22 | SSH administration     |
| Members             | Private web apps |  443 | Normal application use |
| Monitoring workload | Monitored nodes  | 9100 | Metrics collection     |
| Agent reader        | Internal API     |  443 | Read-only tool access  |

Requirements belong in the table. Existing naming habits do not automatically
become security requirements.

## Start with identities

### Human groups

```json
{
  "groups": {
    "group:admins": ["admin@example.com"],
    "group:members": ["person@example.com"]
  }
}
```

Groups reduce repeated email addresses and make intent clearer. Keep policy
repositories private because policy files can contain personally identifiable
information such as user email addresses.[9]

### Workload tags

```json
{
  "tagOwners": {
    "tag:server": ["group:admins"],
    "tag:web": ["tag:server"],
    "tag:agent-reader": ["group:admins"]
  }
}
```

A tag should describe purpose or trust, not merely location. `tag:database` is
usually more useful than `tag:garage-mini-pc`.

`tagOwners` is security policy. If a workload can assign a powerful tag to
itself, it can inherit whatever access that tag receives.

## Write a narrow grant

A grant has a source, destination, and permitted network capability:

```json
{
  "grants": [
    {
      "src": ["group:members"],
      "dst": ["tag:web"],
      "ip": ["tcp:443"]
    }
  ]
}
```

Read it aloud:

> Members may connect to web-tagged nodes on TCP port 443.

If the sentence sounds broader than the requirement, the rule is too broad.

### Agent example

```json
{
  "grants": [
    {
      "src": ["tag:agent-reader"],
      "dst": ["tag:internal-api"],
      "ip": ["tcp:443"]
    }
  ]
}
```

This gives the agent a network path. The API must still authenticate and
authorize the request. Keep read and write credentials separate even when they
share the same endpoint.

## Tailscale Services and DockTail

Tailscale Services use service identities such as `svc:example`. A service may
be advertised by one or more tagged hosts.[10]

DockTail commonly adds `tag:container` to the Tailscale Services it creates. A
minimal ownership and auto-approval pattern is:

```json
{
  "tagOwners": {
    "tag:server": ["group:admins"],
    "tag:container": ["tag:server"]
  },
  "autoApprovers": {
    "services": {
      "tag:container": ["tag:server"]
    }
  }
}
```

Then grant users or workloads access to the specific service and port required
by your policy version and Tailscale Service configuration.

Continue with [DockTail](/docs/infrastructure/docktail/) for the Docker labels
and runtime verification steps.

## Policy tests are part of the policy

A policy change can be syntactically valid and still allow the wrong path. Add
positive and negative tests around important boundaries.[8]

A simplified test block looks like this:

```json
{
  "tests": [
    {
      "src": "admin@example.com",
      "accept": ["tag:web:443"],
      "deny": ["tag:database:5432"]
    }
  ]
}
```

Use the current Tailscale syntax reference for the exact destination form
supported by your policy.[8]

Good tests answer both questions:

- What must continue working?
- What must remain blocked?

A test that proves only the happy path protects availability, not least
privilege.

## ACLs versus grants

| Feature                  | Grants      | ACLs                    |
| ------------------------ | ----------- | ----------------------- |
| Status for new policy    | Recommended | Supported legacy syntax |
| Network permissions      | Yes         | Yes                     |
| Application capabilities | Yes         | No                      |
| Coexist in one policy    | Yes         | Yes                     |

Do not migrate a working policy merely to make the file fashionable. Migrate in
small sections, preserve behavior with tests, and compare the effective access
before and after. Security rewrites make poor weekend hobbies.

## Tailscale SSH is a separate layer

Network access to TCP port 22 and Tailscale SSH authorization are not the same
rule. A node may be reachable while the `ssh` policy block denies the login, or
the reverse may be true.

When debugging SSH, verify:

1. the source identity,
2. network reachability,
3. the destination node or tag,
4. the SSH user,
5. the `ssh` policy rule and action.

## Auto-approvers do not grant client access

Auto-approval allows a trusted identity to advertise something — commonly a
subnet route, exit node, or Tailscale Service — without a person approving each
advertisement.

It does not automatically let clients use the advertised resource. Keep these
questions separate:

```text
May this host advertise it?
May this client connect to it?
Does the application authorize the request?
```

## Advanced least-privilege patterns

### Separate control-plane identities

Do not give a CI runner, agent, and application the same tag merely because they
run on one host. Create purpose-specific identities when their authority differs.

### Prefer service identities over host identities

If users need an application rather than a server, target the service. This
keeps access stable when the backend moves or gains another advertising host.[10]

### Limit ports explicitly

Use `tcp:443`, `tcp:22`, or another exact requirement instead of broad wildcard
access. Protocol and port are part of the security boundary.

### Add expiry outside permanent policy

Temporary migration or incident access should have an owner and removal point.
Do not let “temporary” become a tag whose main feature is surviving three home
server generations.

### Review tag ownership like authorization code

A narrow grant can be defeated by broad tag ownership. Review who can assign the
source and destination tags whenever you review the grant.

## Safe review checklist

Before applying a policy change:

- [ ] The durable source matches the current live policy.
- [ ] The exact source identity is known.
- [ ] The destination is a user, tag, IP, or service by deliberate choice.
- [ ] Protocols and ports are explicit.
- [ ] Tag owners are no broader than necessary.
- [ ] Auto-approvers are separate from client grants.
- [ ] Important allow paths have tests.
- [ ] Important deny paths have tests.
- [ ] The policy validates successfully.
- [ ] A rollback exists.
- [ ] No credentials or unnecessary personal data were added.

## Runtime verification

After an approved policy change, test from the real source identity:

```bash
tailscale status
tailscale ping target-name
curl -v https://service-name.example-tailnet.ts.net/
```

Tailscale documents a useful distinction: TSMP ping checks whether nodes can
form a Tailscale path before the policy check, while ICMP ping includes access
policy evaluation.[8]

Also test one path that should fail. A security control is not verified if you
only prove the allowed request.

## Put the policy in Git when it matters

Once the tailnet supports important infrastructure, Git gives policy changes a
diff, review history, automated tests, and a rollback target. The next guide
builds that workflow:

[Manage Tailscale Policy with GitHub Actions](/docs/security/tailscale-policy-github-actions/)

## Continue the series

- [Tailscale for People and AI Agents](/docs/infrastructure/tailscale-for-people-and-ai-agents/)
- [DockTail: Private Docker Services over Tailscale](/docs/infrastructure/docktail/)
- [Manage Tailscale Policy with GitHub Actions](/docs/security/tailscale-policy-github-actions/)
- [Architectural Decisions: Writing Down the Why](/docs/infrastructure/architectural-decisions/)
- [SEL and Cynefin Framework for Agent Autonomy](/docs/security/sel-cynefin-framework/)

## Sources

- [6] [Tailscale access control](https://tailscale.com/docs/features/access-control)
- [7] [Tailscale grants](https://tailscale.com/docs/features/access-control/grants)
- [8] [Tailnet policy syntax](https://tailscale.com/docs/reference/syntax/policy-file)
- [9] [GitOps for Tailscale with GitHub Actions](https://tailscale.com/docs/integrations/github/gitops)
- [10] [Tailscale Services](https://tailscale.com/docs/features/tailscale-services)
