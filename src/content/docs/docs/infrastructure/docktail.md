---
title: "DockTail: Private Docker Services over Tailscale"
linkTitle: "DockTail"
date: 2026-08-25
lastUpdated: 2026-08-25
authors: ["Derek Leeds"]
categories: [infrastructure, networking, docker]
tags: [docktail, tailscale, docker, compose, services, tailnet, self-hosting]
description: "A beginner-to-advanced DockTail guide for publishing Docker containers as private Tailscale Services with labels, automatic HTTPS, access policy, and practical troubleshooting."
weight: 6
---

<figure class="tool-hero">
  <a href="https://docktail.org/">
    <img src="/images/tailscale-docktail/docktail-logo.webp" alt="DockTail logo" width="240" height="240" />
  </a>
  <figcaption>
    DockTail logo from the <a href="https://docktail.org/">official DockTail website</a>.
    See the <a href="https://docktail.org/docs/">official documentation</a> and
    <a href="https://github.com/marvinvr/docktail">source repository</a>.
  </figcaption>
</figure>

DockTail turns selected Docker containers into private Tailscale Services.

You add a few `docktail.*` labels to an application container. DockTail watches
Docker, reads those labels, and configures the local Tailscale daemon. The
application receives a stable tailnet service name without becoming a separate
Tailscale device.[11]

```text
Docker labels → DockTail → Tailscale daemon → private Tailscale Service
```

This is useful when you run several containerized dashboards, APIs, or databases
and want private access without publishing a host port for every application.

Start with
[Tailscale for People and AI Agents](/docs/infrastructure/tailscale-for-people-and-ai-agents/)
if tailnets, MagicDNS, grants, and tags are new to you.

## What DockTail does

DockTail:

- discovers labeled Docker containers,
- proxies to container IP addresses by default,
- advertises HTTP, HTTPS, TCP, and TLS-terminated TCP services,
- reconciles service state when containers restart or change address,
- can create Tailscale Service definitions with OAuth credentials,
- can expose multiple services from one container.[11]

DockTail does **not** run your application, replace Tailscale access policy, or
make application authentication optional.

## DockTail, Tailscale Serve, and sidecars

| Pattern                       | Identity                                       | Best fit                                               |
| ----------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| DockTail                      | Tailscale Service generated from Docker labels | Many Compose services on one or more Docker hosts      |
| Tailscale Serve               | The machine's Tailscale name                   | A small number of ports on one node                    |
| Per-app Tailscale sidecar     | Separate node identity per app                 | Strong per-workload isolation or no shared host daemon |
| Tailscale Kubernetes Operator | Kubernetes resources and services              | Kubernetes workloads                                   |

DockTail uses native Tailscale Services rather than registering every
application as another device.[11]

## Prerequisites

You need:

- a Docker host,
- Docker Compose,
- a tailnet,
- Tailscale on the Linux host or in a sidecar,
- permission to define and advertise Tailscale Services,
- a policy that allows intended users or workloads to reach those services.

The host-based setup below is for Linux. Docker Desktop on macOS and Windows
cannot share the host Tailscale Unix socket the same way; use DockTail's
Tailscale sidecar pattern there.[11]

## Beginner: expose one web application

### 1. Prepare Tailscale policy

DockTail commonly uses:

- `tag:server` for the Docker host,
- `tag:container` for services created by DockTail.

A minimal policy fragment is:

```json
{
  "tagOwners": {
    "tag:server": ["autogroup:admin"],
    "tag:container": ["tag:server"]
  },
  "autoApprovers": {
    "services": {
      "tag:container": ["tag:server"]
    }
  }
}
```

This defines who may assign each tag and lets tagged server nodes advertise
services carrying `tag:container`. You still need a grant that lets the intended
users or workloads reach the service.

Do not paste this fragment into a production policy blindly. Read
[Design a Tailscale Access Policy](/docs/security/tailscale-access-policy/) and
add tests for the actual identities and ports you intend to allow.

### 2. Tag the Linux Docker host

```bash
sudo tailscale up --advertise-tags=tag:server --reset
```

`--reset` can briefly interrupt the Tailscale connection. Do not run it over your
only remote administration path without a recovery route.

### 3. Store OAuth credentials safely

DockTail can advertise an already-defined service without API credentials, but
OAuth credentials let it create and reconcile Tailscale Service definitions.[11]

Create a least-privilege Tailscale OAuth client for the required host tag and
store the client ID and secret outside the Compose file. Prefer a secret manager
or mounted secret files. Never commit real values.

```dotenv
TAILSCALE_OAUTH_CLIENT_ID=replace-at-runtime
TAILSCALE_OAUTH_CLIENT_SECRET=replace-at-runtime
```

For general secret-handling principles, see
[OpenClaw Secrets Management with 1Password](/docs/security/1password-secrets-management/).
The product differs; the rule does not: resolve secrets at runtime and do not
print them during verification.

### 4. Add DockTail and an application

```yaml
services:
  docktail:
    image: ghcr.io/marvinvr/docktail:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/run/tailscale:/var/run/tailscale
    environment:
      - TAILSCALE_OAUTH_CLIENT_ID=${TAILSCALE_OAUTH_CLIENT_ID}
      - TAILSCALE_OAUTH_CLIENT_SECRET=${TAILSCALE_OAUTH_CLIENT_SECRET}

  myapp:
    image: nginx:latest
    labels:
      - "docktail.service.enable=true"
      - "docktail.service.name=myapp"
      - "docktail.service.port=80"
      - "docktail.tags=tag:container"
```

The examples use `latest` to stay readable. For a durable deployment, pin a
reviewed version or digest and let dependency automation propose updates.

Mount `/var/run/tailscale` as a **directory**, not only
`tailscaled.sock`. When `tailscaled` restarts, it can recreate the socket; the
directory mount continues to see the new socket.[11]

### 5. Start and verify

```bash
docker compose up -d
docker compose ps
docker compose logs docktail
curl http://myapp.your-tailnet.ts.net/
```

Also inspect the Tailscale Services page. A healthy container and a successful
DockTail reconciliation do not prove that the service advertisement is approved
or reachable from the intended client.

## Add private HTTPS

DockTail can present a Tailscale HTTPS endpoint while proxying to an HTTP
application port:

```yaml
labels:
  - "docktail.service.enable=true"
  - "docktail.service.name=myapp"
  - "docktail.service.port=80"
  - "docktail.service.protocol=http"
  - "docktail.service.service-port=443"
  - "docktail.service.service-protocol=https"
  - "docktail.tags=tag:container"
```

The backend protocol must match what the container actually serves. An HTTPS
client endpoint does not mean the application suddenly speaks TLS on its
internal port.

```bash
curl https://myapp.your-tailnet.ts.net/
```

## Expose a TCP service

For a database or another raw TCP service:

```yaml
labels:
  - "docktail.service.enable=true"
  - "docktail.service.name=database"
  - "docktail.service.port=5432"
  - "docktail.service.protocol=tcp"
  - "docktail.service.service-port=5432"
  - "docktail.tags=tag:container"
```

A network grant is not database authorization. Keep database credentials,
roles, and TLS controls appropriate to the application.

## Custom Docker networks

DockTail needs a path to the application container. If the app uses a custom
network, identify it explicitly and attach DockTail where required:

```yaml
services:
  docktail:
    networks: [backend]

  app:
    networks: [backend]
    labels:
      - "docktail.service.enable=true"
      - "docktail.service.name=app"
      - "docktail.service.port=3000"
      - "docktail.service.network=backend"
      - "docktail.tags=tag:container"

networks:
  backend:
```

By default, DockTail proxies directly to the container IP, so the application
usually does not need a published `ports:` entry.[11]

## Multiple services from one container

Numbered labels can expose more than one listener:

```yaml
labels:
  - "docktail.service.enable=true"
  - "docktail.service.name=forgejo"
  - "docktail.service.port=3000"
  - "docktail.service.service-port=443"
  - "docktail.service.1.name=forgejo"
  - "docktail.service.1.port=2222"
  - "docktail.service.1.protocol=tcp"
  - "docktail.service.1.service-port=22"
  - "docktail.tags=tag:container"
```

Verify each listener independently. One working port does not validate its
siblings.

## Agent-facing services

DockTail is a practical way to give an agent a stable private endpoint for a
containerized API or MCP server:

```text
agent identity → Tailscale grant → DockTail service → container listener
```

Keep the layers separate:

1. DockTail publishes the service.
2. Tailscale policy decides which identities can connect.
3. The application authenticates requests.
4. The agent runtime decides whether its tool may make the call.

Read [APIs, MCP, and CLIs](/docs/ai/apis-mcp-and-clis/) before treating network
reachability as a complete agent integration.

## Advanced hardening

### Avoid broad host ports

If DockTail can reach the container directly, omit unnecessary `ports:` entries.
If a host port is still needed for local administration, bind it to localhost
where appropriate:

```yaml
ports:
  - "127.0.0.1:8080:3000"
```

Test both outcomes:

- the Tailnet URL still works,
- the service is not reachable on an unintended LAN interface.

### Treat the Docker socket as privileged

A read-only Docker socket prevents simple writes through the mount, but access
to Docker metadata is still sensitive. Run DockTail only on hosts where that
trust is acceptable, pin images, and keep the container's other privileges
small.

### Keep labels in Git

The labels are desired state. Do not rely on labels added manually to a live
container; the next Compose reconciliation will remove them. Keep the Compose
file in the repository that owns the stack.

### Keep Funnel separate

DockTail supports Tailscale Funnel, which is public internet exposure.[11] This
guide intentionally uses private Tailscale Services. Review public exposure,
application authentication, rate limiting, and rollback separately before
adding `docktail.funnel.*` labels.

## Troubleshooting ladder

### 1. Is the application listening?

```bash
docker compose ps
docker compose logs myapp
```

### 2. Does the labeled port match the real listener?

```bash
docker inspect myapp --format '{{json .Config.Labels}}'
```

Test from the relevant Docker network if needed.

### 3. Can DockTail reach Docker and Tailscale?

```bash
docker compose logs docktail
tailscale status
tailscale serve get-config --all
```

If DockTail reports a missing or refused Tailscale socket after `tailscaled`
restarted, confirm that the Compose file mounts `/var/run/tailscale` as a
directory.[11]

### 4. Is the service defined and approved?

Check the Tailscale Services page and the service's advertising hosts. Service
definition, host advertisement, host approval, and client access are separate
states.[10]

### 5. Does policy allow the client?

Review the exact source identity, service destination, protocol, and port. Test
both intended access and an intended denial.

### 6. Does the client reach the final URL?

```bash
curl -v https://myapp.your-tailnet.ts.net/
```

A local container `200 OK` with a broken service URL points above the application
layer: advertisement, approval, policy, DNS, or Tailscale reachability.

## Continue the series

- [Tailscale for People and AI Agents](/docs/infrastructure/tailscale-for-people-and-ai-agents/)
- [Design a Tailscale Access Policy](/docs/security/tailscale-access-policy/)
- [Manage Tailscale Policy with GitHub Actions](/docs/security/tailscale-policy-github-actions/)
- [Architectural Decisions: Writing Down the Why](/docs/infrastructure/architectural-decisions/)

## Sources

- [DockTail official website](https://docktail.org/)
- [DockTail official documentation](https://docktail.org/docs/)
- [10] [Tailscale Services](https://tailscale.com/docs/features/tailscale-services)
- [11] [DockTail source repository](https://github.com/marvinvr/docktail)
