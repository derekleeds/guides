---
title: "Run Local Models with Ollama"
linkTitle: "Ollama"
date: 2026-08-24
lastUpdated: 2026-08-24
authors: ["Derek Leeds"]
categories: [ai, agents]
tags: [ai, llm, ollama, local-ai]
description: "Use Ollama as a local model runtime while making deliberate choices about hardware, APIs, cloud features, and connected applications."
weight: 5
---

<figure class="tool-hero">
  <img src="/images/recommended-tools/ollama.svg" alt="Ollama logo" width="240" height="240" />
  <figcaption>Ollama icon from <a href="https://selfh.st/icons/">selfh.st/icons</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</figcaption>
</figure>

Running an AI model locally used to mean assembling model files, inference libraries, hardware settings, and an API layer by hand. [Ollama](https://ollama.com/) packages that work into a model runtime for macOS, Windows, and Linux.

A **model runtime** is the software that loads a model and performs inference. Ollama can download supported models, run them on local hardware, and expose a consistent API to other applications.

## What Ollama solves

Ollama is useful when you want to:

- experiment with local chat, coding, vision, or embedding models;
- provide one local endpoint to several applications;
- work offline with a downloaded model;
- keep suitable prompts and files inside a controlled environment; or
- compare model sizes and capabilities on your own hardware.

It is not a full multi-user chat application or knowledge system. Tools such as Open WebUI and AnythingLLM can use Ollama as their runtime while owning the user interface, conversations, and retrieval features.

## Choose a model that fits the machine

The largest model you can download is not necessarily the best model you can use.

Model size, quantization, context length, and concurrency determine memory use and speed. A model that barely fits may respond slowly, leave no capacity for other applications, or fail when a longer context is requested.

Start with a modest model and a real task. Measure:

- time to first response;
- generation speed;
- memory use;
- answer quality on your material; and
- behavior at the context lengths you actually need.

Local AI replaces a provider's hardware budget with yours. Disk space also matters because model files accumulate quickly.

## Use the API as a boundary

Ollama's local API allows a chat interface, editor, agent, or script to use the runtime without managing model internals. Official Python and JavaScript libraries are also available.

Keep the API bound to intended interfaces. If another machine needs access, use an authenticated network boundary rather than casually publishing the port to the internet. Ollama is an inference service, not a complete identity and access platform.

## Local is a workflow property

A downloaded model can run locally, but an Ollama-based workflow is only local if every relevant component stays local.

The boundary expands when you use:

- an Ollama Cloud model;
- web search or another hosted capability;
- a cloud embedding or speech provider;
- a chat application that synchronizes conversations; or
- an agent tool that sends data to an external service.

Trace the complete request path: interface, model, retrieval, tools, logs, and storage.

## A practical first deployment

1. Install Ollama from the current official instructions.
2. Select a model that fits the available memory and intended task.
3. Test it from the local interface before adding other applications.
4. Connect one client and confirm which endpoint and model it uses.
5. Record the model identifier when reproducibility matters.
6. Monitor memory, disk, and response time under realistic use.

Avoid promising that a local model will match the strongest hosted model. Local inference is a trade: more control and predictable availability in exchange for hardware limits and operator maintenance.

## Official resources

- [Ollama](https://ollama.com/)
- [Ollama documentation](https://docs.ollama.com/)
- [Ollama repository](https://github.com/ollama/ollama)
- [Ollama API reference](https://docs.ollama.com/api)
