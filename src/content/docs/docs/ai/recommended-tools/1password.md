---
title: "Keep Agent Secrets Out of Prompts with 1Password"
linkTitle: "1Password for agents"
date: 2026-08-24
lastUpdated: 2026-08-24
authors: ["Derek Leeds"]
categories: [ai, agents]
tags: [ai, security, secrets-management, 1password]
description: "Use 1Password, its CLI, secret references, and service accounts to give applications credentials without turning prompts and repositories into secret stores."
weight: 2
---

<figure class="tool-hero">
  <img src="/images/recommended-tools/1password.svg" alt="1Password logo" width="240" height="240" />
  <figcaption>1Password icon from <a href="https://selfh.st/icons/">selfh.st/icons</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</figcaption>
</figure>

An AI agent eventually needs to authenticate to something: a code host, cloud service, database, or infrastructure API. The dangerous shortcut is to paste the credential into the conversation or save it in a project file.

[1Password](https://1password.com/) provides a better boundary. Store the secret in the password manager, give an approved process temporary access, and keep the reusable value out of the model's context.

## The mental model

The agent should know that an application needs `SERVICE_TOKEN`. It usually does not need to know the token itself.

A safer flow is:

1. A human or automation identity is authorized in 1Password.
2. The workflow refers to the required field with a secret reference.
3. 1Password resolves the value at runtime.
4. The application receives it for the task.
5. The agent sees the result of the application, not the credential.

This is capability without custody. It reduces exposure, although it cannot prevent a badly behaved application from printing the value later.

## Windows and Linux with the 1Password CLI

The [1Password CLI](https://www.1password.dev/cli) is named `op` and is available for Windows, Linux, and macOS. On an attended workstation, it can integrate with the desktop app so a person authorizes terminal access using the authentication available on that platform.

Secret references have this general shape:

```text
op://vault/item/field
```

An environment template can contain the reference instead of plaintext:

```dotenv
SERVICE_TOKEN=op://development/example-service/token
```

Then `op run` can resolve the variable for one child process:

```sh
op run --env-file=.env.tpl -- application-command
```

The template can be reviewed and versioned if it contains no other sensitive information. The child process can still read its environment, so use a narrowly scoped credential and a trusted application.

For software that requires a configuration file, `op inject` can render a template. Avoid writing the rendered plaintext to disk when the application can consume it through a pipe or temporary restricted location.

## Headless servers need a different identity

Biometric or interactive approval is a good workstation pattern, not an unattended-server pattern. Scheduled jobs, containers, and CI systems can use a [1Password service account](https://www.1password.dev/service-accounts/get-started).

A service account should have access only to the required vaults and operations. Its token is displayed once and is itself a powerful secret. Deliver it through the platform's protected secret mechanism as `OP_SERVICE_ACCOUNT_TOKEN`; never save it in a repository, container image, shell profile, agent prompt, or documentation note.

Service-account scope is intentionally difficult to change. If the workload needs different access, revoke the old identity and create a correctly scoped replacement.

## Safe use with agents

Prefer a reviewed wrapper command that runs one application through `op run` over unrestricted access to the complete 1Password CLI.

Also watch for secondary leaks:

- shell tracing and verbose debug modes;
- standard output and error logs;
- process inspection;
- crash reports and screenshots;
- generated configuration files; and
- an agent copying command output into its transcript.

1Password secures retrieval. The rest of the execution path still matters.

## When I recommend it

Use this pattern when agents or automation need API keys, tokens, SSH credentials, or other reusable secrets. It is especially valuable when the same credential must be rotated centrally or used across Windows workstations, Linux servers, and CI jobs.

Do not use a password manager as permission to give an agent every credential in a vault. Start with the task, create the narrowest useful access path, and preserve human approval for high-impact operations.

## Official resources

- [1Password CLI](https://www.1password.dev/cli)
- [Download 1Password CLI](https://1password.com/downloads/command-line)
- [Get started with service accounts](https://www.1password.dev/service-accounts/get-started)
- [1Password and OpenAI Codex](https://1password.com/blog/1password-trusted-access-layer-for-openai-codex)
