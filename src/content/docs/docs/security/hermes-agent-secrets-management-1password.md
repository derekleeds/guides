---
title: "Hermes Agent Secrets Management with 1Password"
linkTitle: "Hermes secrets with 1Password"
date: 2026-08-30
lastUpdated: 2026-08-30
authors: ["Derek Leeds"]
categories: [security, "Hermes Agent"]
tags:
  [hermes-agent, 1password, credentials, security, secrets-management, tutorial]
description: "Configure Hermes Agent to resolve provider credentials from 1Password at startup while keeping bootstrap access narrow and secret-safe."
weight: 21
---

This guide walks through setting up 1Password as the credential source for [Hermes Agent](https://hermes-agent.nousresearch.com/). By the end, your provider API keys live as 1Password items and resolve into the environment whenever a Hermes process starts. The provider keys leave `~/.hermes/.env`; one tightly protected service-account token remains as bootstrap material.

If you came here from the [OpenClaw version of this guide](/docs/security/1password-secrets-management/), skip to [How this differs from OpenClaw](#how-this-differs-from-openclaw) first. The goal is the same; the mechanism is meaningfully simpler.

## Prerequisites

- Hermes Agent installed and running
- 1Password account (personal or business)
- 1Password CLI (`op`) installed — v2.18.0 or later if you plan to use a service account
- Permission to update your Hermes configuration through the `hermes secrets` CLI

## Two integrations, one password manager

Hermes touches 1Password in two independent places. Decide which you want before you start, because they solve different problems.

|                         | Built-in secrets integration                                              | Optional 1Password skill                                                     |
| ----------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **What it does**        | Resolves `op://` references into environment variables at process startup | Lets the agent itself run `op read`, `op inject`, and `op run` during a task |
| **Who uses the secret** | Hermes and its model providers                                            | Whatever command the agent is running for you                                |
| **Enabled by**          | `hermes secrets onepassword setup`                                        | `hermes skills install official/security/1password`                          |
| **Config lives in**     | `secrets.onepassword` in `config.yaml`                                    | Skill definition + auth env vars                                             |

Most people want the built-in integration. Add the skill only if you actually want Hermes reaching into vaults on your behalf mid-task. Parts 1 through 5 cover the integration; [Part 6](#part-6-the-optional-1password-skill) covers the skill.

## Part 1: Install and Authenticate the 1Password CLI

Hermes never downloads `op` and never authenticates on your behalf. It shells out to the CLI you already installed and trust. So this step is entirely stock 1Password setup.

### Install the CLI

Install `op` using the current [1Password CLI instructions](https://developer.1password.com/docs/cli/get-started/) for your operating system, then verify the binary:

```bash
op --version
```

### Pick an authentication mode

`op` supports two modes that Hermes can use. Only the service-account mode is suitable for unattended workloads.

| Mode                              | Use it for                                  | How Hermes sees it                                                     |
| --------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| **Service account**               | Servers, VPS gateways, cron, CI, containers | Reads a token from `OP_SERVICE_ACCOUNT_TOKEN`                          |
| **Desktop / interactive session** | Your laptop                                 | Passes your `OP_SESSION_*` variables through to the `op` child process |

For a homelab gateway, use a service account. Create it in 1Password, grant it read access to only the vault Hermes needs, and copy the token once — it is displayed exactly once and is itself a powerful credential.

With desktop integration, verify authentication now. With a service account, run this after placing the bootstrap token in Part 2:

```bash
op whoami
```

A service account should report `Type: SERVICE_ACCOUNT`.

## Part 2: Place the Bootstrap Token Correctly

This is the step people get wrong, so it gets its own section.

The service-account token is the credential Hermes needs _before_ it can resolve any `op://` reference. It has to be in the environment of every process that resolves secrets — the gateway, yes, but also cron jobs (`kanban.dispatch_in_gateway: false`), subprocess invocations, plain CLI runs, macOS launchd agents, and Docker containers.

A token that only exists inside your interactive shell — exported from `.bashrc`, or established by `op signin` — will **not** be inherited by cron or freshly spawned subprocesses. Those contexts log a warning and quietly fall back to whatever `.env` already held.

There are three supported placements.

### Option 1: `~/.hermes/.env` (recommended)

The simplest reliable option. Hermes always loads `.env`, so the token is available everywhere with no extra wiring.

Use Hermes' masked token prompt so the value does not enter shell history or process arguments:

```bash
hermes secrets onepassword token
```

Hermes validates the token with `op whoami` before writing it to `~/.hermes/.env`. Lock the file down:

```bash
chmod 600 ~/.hermes/.env
```

### Option 2: `~/.hermes/.op.env` (gitignored)

Use this if you keep `.env` in a private dotfiles repo and want the token to stay out of version control entirely.

Create the file first, then paste the token with a trusted editor. Do not put the token in a shell command:

```bash
install -m 600 /dev/null ~/.hermes/.op.env
${EDITOR:-vi} ~/.hermes/.op.env
```

Add one line in the editor: `OP_SERVICE_ACCOUNT_TOKEN=PASTE_TOKEN_HERE`.

Hermes auto-loads `.op.env` at startup, after `.env`, and never overrides a token already present in the environment. `.op.env` is gitignored by default.

### Option 3: systemd `EnvironmentFile` (Linux gateway)

If the gateway runs under systemd, inject the token into the service environment directly:

```ini
[Service]
EnvironmentFile=-/home/youruser/.hermes/.op.env
```

A token injected this way wins. Hermes detects `OP_SERVICE_ACCOUNT_TOKEN` is already set and skips loading `.op.env`.

> **Important:** A 1Password service-account token can read every secret the account has access to. Keep it in one protected bootstrap location: `~/.hermes/.env`, `~/.hermes/.op.env`, or the service environment. Never put it in `config.yaml`, a container image, a repository, or an agent prompt. If it leaks, revoke and regenerate it in 1Password.

## Part 3: Design Your Vaults and Add Credentials

Keep Hermes credentials separate from personal items, and do not reuse a vault another agent already has access to. A vault is the unit of grant and the unit of revocation — that is the only reason to draw the lines anywhere in particular.

### One vault or three?

One dedicated vault is fine to start. But the credentials an agent needs are not one kind of thing, and they do not fail the same way. Splitting by blast radius makes revocation surgical, but only create or grant a vault when the install genuinely needs it:

| Vault                  | Holds                                                                                   | Why it is its own vault                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hermes-External-API`  | Third-party provider keys — Anthropic, OpenAI, OpenRouter, Brave, Todoist               | Metered and billable. A leak costs money and is visible in someone else's usage dashboard, not yours. Rotate freely; nothing internal breaks. |
| `Hermes-Internal-Apps` | Credentials for self-hosted web apps — Forgejo tokens, Komodo, Grafana, Open WebUI      | Reaches your own services. A leak is a foothold, not a bill. Rotation may require touching each app.                                          |
| `Hermes-Machine-Auth`  | Machine-to-machine material — SSH keys, mTLS certs, Tailscale auth keys, service tokens | The highest blast radius and the slowest to rotate. Most agent tasks never need it; keep it separate so it can be withheld by default.        |

The practical payoff: when a token leaks, or an experiment goes sideways, you revoke one vault's access instead of auditing every credential the agent could see. It also means the third vault is one you can simply _not_ grant on machines that do not need it.

### Match service accounts to installs, not to vaults

This is the part that catches people. Hermes reads a single service-account token from `OP_SERVICE_ACCOUNT_TOKEN`, and that one token covers every reference in `secrets.onepassword.env`. So three vaults does **not** mean three service accounts for one Hermes install — it cannot use more than one.

Create one service account per Hermes install, granted only the vaults that install actually needs:

| Install               | Vaults granted                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Laptop / interactive  | `Hermes-External-API`                                                                               |
| Gateway VPS           | `Hermes-External-API`, `Hermes-Internal-Apps`                                                       |
| Homelab GitOps runner | `Hermes-External-API`, plus only the internal-app or machine-auth vaults required for approved jobs |

That gives you a revocation story per machine as well as per credential class. Losing the laptop revokes one service account and touches nothing on the gateway.

### Create them

Create the required vaults with a human 1Password administrator. Grant each Hermes service account only the vaults that its install needs.

Add one item per credential. Field naming matters later, so pick a convention and stick to it.

Create each item in the 1Password app or web interface. Use a Password item, name it after the environment variable, and store the credential in its password field. This avoids placing the secret in shell history or process arguments.

### Verify without printing anything

```bash
# List titles only
op item list --vault Hermes-External-API --format json | jq '.[].title'

# Confirm a reference resolves — existence check, not value
op read "op://Hermes-External-API/ANTHROPIC_API_KEY/password" > /dev/null && echo "OK" || echo "FAILED"
```

If you created items through the web UI rather than the CLI, the field label may not be `password`. Check before you write the reference:

```bash
op item get "ANTHROPIC_API_KEY" --vault "Hermes-External-API" --format json | \
  jq '[.fields[].label]'
```

Common labels you will run into: `password`, `credential`, `api key`, `token`, `notesPlain`. Note that `api key` contains a space — that is legal in a reference, just quote it.

> **Never echo secret values** to a terminal, a log, or a chat window. Verify with `> /dev/null && echo OK`. Terminal scrollback is not a secure store, and if Hermes is the one running the command, the value lands in the transcript.

## Part 4: Enable the Integration and Map Credentials

### Enable it

```bash
hermes secrets onepassword setup
```

This verifies `op` is on `PATH`, records your account and token settings, checks for an active session, and flips `secrets.onepassword.enabled: true`.

For a service account, store the token first with the masked `hermes secrets onepassword token` prompt or in `.op.env`, then configure the account and pin the trusted binary without passing the token on the command line:

```bash
hermes secrets onepassword setup \
  --account my.1password.com \
  --token-env OP_SERVICE_ACCOUNT_TOKEN \
  --binary-path "$(command -v op)"
```

### Map environment variables to references

The reference format is `op://<vault>/<item>/<field>`:

```bash
hermes secrets onepassword set ANTHROPIC_API_KEY "op://Hermes-External-API/ANTHROPIC_API_KEY/password"
hermes secrets onepassword set OPENAI_API_KEY    "op://Hermes-External-API/OPENAI_API_KEY/password"
```

References are stripped and validated on the way in — a value that does not start with `op://` is rejected rather than silently stored.

`op` and `1password` both work as aliases for `onepassword`, so `hermes secrets op set ...` is equivalent.

### What Hermes stores in config.yaml

Use the CLI above rather than hand-editing this file. The schema and defaults look like this:

```yaml
secrets:
  onepassword:
    enabled: false
    env:
      OPENAI_API_KEY: "op://Private/OpenAI/api key"
      ANTHROPIC_API_KEY: "op://Private/Anthropic/credential"
    account: ""
    service_account_token_env: OP_SERVICE_ACCOUNT_TOKEN
    binary_path: ""
    cache_ttl_seconds: 300
    override_existing: true
```

| Key                         | Default                    | What it does                                                                                            |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `enabled`                   | `false`                    | Master switch. When false, `op` is never invoked.                                                       |
| `env`                       | `{}`                       | Env-var name → `op://vault/item/field`. Invalid names or non-`op://` values are skipped with a warning. |
| `account`                   | `""`                       | Account shorthand passed as `op read --account`. Empty uses `op`'s default account.                     |
| `service_account_token_env` | `OP_SERVICE_ACCOUNT_TOKEN` | Where Hermes reads the token from. Leave unset to use a desktop session instead.                        |
| `binary_path`               | `""`                       | Absolute path to `op`. When set it is used verbatim and `PATH` is not consulted.                        |
| `cache_ttl_seconds`         | `300`                      | How long resolved values are reused. `0` disables both cache layers and writes nothing to disk.         |
| `override_existing`         | `true`                     | Resolved values overwrite what is already in the environment, so rotation actually takes effect.        |

Two of these are worth a deliberate decision rather than a default.

**Pin `binary_path`.** Setting it to the output of `which op` means Hermes never trusts whatever `op` happens to appear first on `PATH`. On a box where an agent can write to directories on `PATH`, this is the difference between a secret manager and a secret exfiltration hook.

**Leave `override_existing: true`.** That is what makes 1Password the source of truth — rotate a credential once and every Hermes process picks it up on next start. Flip it to `false` only if you deliberately want `.env` or a shell export to win; those references are then skipped before `op` is invoked at all.

## Part 5: Preview, Confirm, and Live With It

### Dry run first

```bash
hermes secrets onepassword sync     # resolve now, show what would apply
hermes secrets onepassword status   # config + binary + references + auth
```

`sync` is a dry run. `sync --apply` applies values only inside that short-lived Hermes command process; it cannot modify its parent shell and is rarely needed.

From here, every `hermes` invocation resolves the references at startup, after `~/.hermes/.env` has loaded. You get a one-line summary in stderr the first time secrets are applied in a process.

### Rotating credentials

Update the item in 1Password. Nothing else. The next process start picks it up, because `override_existing` is true and the cache invalidates when the reference set or auth material changes.

Rotating the _service account token_ is different — that one is bootstrap material, not a resolved value:

```bash
hermes secrets onepassword token
```

That validates the new token with `op whoami` and then stores it in `.env`.

### Failure modes

1Password never blocks Hermes startup. If anything goes wrong you get a one-line warning in stderr — including a `→` remediation line naming the exact fixing command — and Hermes continues with whatever credentials were already present in its environment. If no usable fallback exists, the later provider or tool call can still fail, so check the first startup after a change.

| Symptom                                        | Cause                                             | Fix                                                                                               |
| ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `the op CLI was not found on PATH`             | `op` not installed or not on `PATH`               | Install it, or set `secrets.onepassword.binary_path`                                              |
| `op read failed for 'op://…'`                  | Locked session, expired token, or no vault access | `op signin`, or `hermes secrets onepassword token`, or grant the service account vault access     |
| `op read returned an empty value for 'op://…'` | The field exists but is empty                     | Fix the item in 1Password. An empty value is never applied — your existing env var is left intact |
| `… is not an op:// secret reference`           | A mapping value is malformed                      | Re-set it with the correct `op://vault/item/field` form                                           |
| `op read timed out`                            | Network blocked, or 1Password slow                | Check connectivity and the desktop app integration                                                |

This fail-open behavior is deliberate: a 1Password outage does not stop Hermes from starting. It does not guarantee that a usable fallback credential exists, so read stderr on the first start after a change and test the provider you need.

### Caching

Successful, complete pulls are cached in-process and on disk at `<hermes_home>/cache/op_cache.json`, written atomically with mode `0600`. Back-to-back short-lived `hermes` invocations do not re-shell `op` for every reference.

The cache:

- stores resolved secret values in plaintext in the mode-`0600` cache — never the service-account token or other raw auth material, which is fingerprinted into the cache key instead;
- invalidates when the token, account, `OP_SESSION_*` variables, or the set of references change;
- is not written when a pull had any per-reference error, so a transient auth failure is not frozen in for the TTL;
- is fully disabled, reads and writes both, at `cache_ttl_seconds: 0`.

If you are uncomfortable with resolved values touching disk at all, set the TTL to zero and accept the extra `op` invocations.

### What Hermes does to protect you

Worth knowing, because it shapes how much you need to defend yourself:

- Hermes refuses to let a resolved value overwrite the token env var itself, even with `override_existing: true`.
- The `op` child process gets a minimal allowlisted environment — auth and session vars plus `PATH` and `HOME` — not a copy of the full `os.environ`. Your other provider credentials are not handed to the child.
- References are validated to start with `op://` and are passed after a `--` option terminator, so a crafted value cannot be parsed as an `op` flag.

## Part 6: The Optional 1Password Skill

Everything above is about Hermes authenticating _itself_. The optional skill is about Hermes running `op` _for you_ during a task — reading a secret into a command, pulling a one-time password, injecting values into a config template.

```bash
hermes skills install official/security/1password
```

|               |                                      |
| ------------- | ------------------------------------ |
| **Path**      | `optional-skills/security/1password` |
| **Version**   | 1.0.0                                |
| **Platforms** | linux, macos, windows                |
| **License**   | MIT                                  |

The skill supports three auth methods: service account (recommended, same `OP_SERVICE_ACCOUNT_TOKEN` you already set), desktop app integration, and a self-hosted Connect server via `OP_CONNECT_HOST` and `OP_CONNECT_TOKEN`.

### Operations it exposes

```bash
# Confirm a reference resolves without printing it
op read "op://app-prod/db/password" > /dev/null

# Run a command with the secret in its environment
export DB_PASSWORD="op://app-prod/db/password"
op run -- sh -c '[ -n "$DB_PASSWORD" ] && echo "DB_PASSWORD is set" || exit 1'

# Inject a template only when a trusted consumer can read stdin directly
op inject --in-file config.yml.tpl | trusted-application --config /dev/stdin
```

Prefer `op run`. `op inject` is safe only when its output goes directly to a trusted consumer; printing or capturing that output exposes the resolved secret.

### The tmux caveat

Hermes terminal commands are non-interactive by default and can lose auth context between calls. With desktop app integration, an `op signin` in one command does not carry to the next. The skill's answer is to keep sign-in and secret operations inside a dedicated tmux session:

```bash
SOCKET_DIR="${TMPDIR:-/tmp}/hermes-tmux-sockets"
mkdir -p "$SOCKET_DIR"
SOCKET="$SOCKET_DIR/hermes-op.sock"
SESSION="op-auth-$(date +%Y%m%d-%H%M%S)"

tmux -S "$SOCKET" new -d -s "$SESSION" -n shell

# Sign in (approve in the desktop app when prompted)
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- "eval \"\$(op signin --account my.1password.com)\"" Enter

# Verify
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- "op whoami" Enter

# Capture output when needed
tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200

# Cleanup
tmux -S "$SOCKET" kill-session -t "$SESSION"
```

This is not needed with a service account token — the token persists across terminal calls automatically. Which is a good enough reason on its own to prefer service accounts on any box where Hermes runs unattended.

### Where the boundary should sit

The skill's own guardrails are the right ones: never print raw secrets back unless explicitly asked, prefer `op run` and `op inject` over writing secrets into files, and fall back to the service account flow when desktop integration is unavailable.

My addition: scope the service account to a vault that contains only what the agent legitimately needs. A password manager is not permission to hand an agent every credential you own. Start from the task, build the narrowest useful access path, and keep human approval on high-impact operations.

Also remember that 1Password secures _retrieval_. The rest of the execution path still leaks in all the usual ways — shell tracing, verbose debug modes, stdout and stderr logs, process inspection, crash reports, generated config files, and an agent helpfully pasting command output into its transcript.

## How this differs from OpenClaw

If you are porting a working OpenClaw setup, the shape of the work changes more than you would expect.

|                    | OpenClaw                                                                                       | Hermes                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Wiring**         | An `exec` provider block per credential in `openclaw.json`, then a SecretRef at every use site | One `env:` line per credential in `config.yaml`           |
| **Delivery**       | SecretRef objects substituted into config values                                               | Environment variables set at process startup              |
| **Validation**     | `openclaw secrets audit --check`                                                               | `hermes secrets onepassword sync` (dry run) + `status`    |
| **Failure**        | Unresolved SecretRef breaks the config                                                         | Warning to stderr, startup continues on old credentials   |
| **Gotchas**        | `allowInsecurePath`, `jsonOnly`, `passEnv`, `"id": "value"`                                    | Bootstrap token reachability across cron and subprocesses |
| **Per-agent auth** | `auth-profiles.json` with `keyRef` / `tokenRef`                                                | Not needed — providers read the env vars                  |

The OpenClaw version's hard part was the plumbing: getting `allowInsecurePath` and `passEnv` right for every provider, and remembering `"id": "value"`. The Hermes version's hard part is entirely [Part 2](#part-2-place-the-bootstrap-token-correctly) — making sure the bootstrap token reaches cron jobs and spawned subprocesses, not just your interactive shell.

Migration order that worked for me:

1. Create the Hermes vaults and copy items over. Do not reuse the OpenClaw vault — different agent, different blast radius.
2. Create a fresh service account for this install, granted only the vaults it needs.
3. Store the token with the masked `hermes secrets onepassword token` prompt, then run `hermes secrets onepassword setup`.
4. Map one low-risk credential. Run `sync`. Confirm it resolves.
5. Map the rest, verifying after each one.
6. Only then remove the plaintext provider credentials from `~/.hermes/.env`; keep the bootstrap token protected there or in `.op.env`.
7. Restart the gateway and check stderr on the first start.

## When not to use this

Straight from the Hermes docs, and they are right:

- Single-machine personal setups where `~/.hermes/.env` is genuinely fine.
- Air-gapped environments that cannot reach 1Password.
- CI/CD where a secrets-injection mechanism is already wired up. Pick one path, not two.

The good case is multi-machine fleets, shared dev boxes, gateway VPSes — anywhere you want centralized rotation and revocation across multiple Hermes installations. If you run Hermes on exactly one laptop, a `chmod 600` on `.env` gets you most of the way there and this guide is optional.

## Quick Reference

### Setup

```bash
op whoami                                                    # confirm CLI auth
hermes secrets onepassword token                              # masked token prompt + validation
hermes secrets onepassword setup                              # enable the integration
hermes secrets onepassword set ANTHROPIC_API_KEY "op://Hermes-External-API/ANTHROPIC_API_KEY/password"
hermes secrets onepassword sync                              # dry run
hermes secrets onepassword status                            # verify
```

### Command table

| Command                                           | What it does                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `hermes secrets onepassword setup`                | Verify `op`, set account / token env var, enable                                  |
| `hermes secrets onepassword status`               | Show config, binary, auth, and configured references                              |
| `hermes secrets onepassword token`                | Rotate the service-account token: validate with `op whoami`, then store in `.env` |
| `hermes secrets onepassword set ENV_VAR "op://…"` | Map an env var to a reference                                                     |
| `hermes secrets onepassword remove ENV_VAR`       | Drop a mapping                                                                    |
| `hermes secrets onepassword sync`                 | Dry run: resolve references and show what would apply                             |
| `hermes secrets onepassword sync --apply`         | Resolve and apply inside this short-lived Hermes process                          |
| `hermes secrets onepassword disable`              | Flip `enabled: false`, leaving mappings in place                                  |

### Vault hygiene

```bash
# List item titles, never values
op item list --vault Hermes-External-API --format json | jq '.[].title'

# Confirm a reference resolves
op read "op://Hermes-External-API/ITEM/password" > /dev/null && echo "resolves: yes"

# Find the real field label
op item get "ITEM" --vault "Hermes-External-API" --format json | \
  jq '[.fields[].label]'

# Pin the binary path
which op
```

### Security checklist

- [ ] Vaults split by blast radius: external API, internal apps, machine auth
- [ ] One service account per install, granted only the vaults that install needs
- [ ] `Hermes-Machine-Auth` withheld from any install that does not need it
- [ ] Token in `~/.hermes/.env` or `.op.env`, never in `config.yaml`
- [ ] `chmod 600` on whichever file holds the token
- [ ] Token reachable by cron, launchd, and containers — not only your login shell
- [ ] `binary_path` pinned to an absolute path
- [ ] `override_existing: true` so rotation actually propagates
- [ ] Plaintext provider credentials removed from `.env` after verification, not before
- [ ] stderr checked on the first start after any change

## Official resources

- [Hermes Agent — 1Password secrets integration](https://hermes-agent.nousresearch.com/docs/user-guide/secrets/onepassword)
- [Hermes Agent — official 1Password skill](https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/security/security-1password)
- [1Password CLI documentation](https://developer.1password.com/docs/cli/)
- [1Password service accounts](https://developer.1password.com/docs/service-accounts/)

## Related guides

- [OpenClaw Secrets Management with 1Password](/docs/security/1password-secrets-management/)
- [Keep Agent Secrets Out of Prompts with 1Password](/docs/ai/recommended-tools/1password/)
- [Getting Started with Hermes Agent](/docs/hermes/getting-started-hermes-agent/)
- [Hermes Agent Architecture](/docs/hermes/hermes-agent-architecture/)
