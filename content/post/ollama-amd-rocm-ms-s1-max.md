---
title: "Ollama AMD ROCm Setup on MS-S1 MAX"
date: 2026-03-07
updated: 2026-03-12
author: Derek Leeds
categories: ["Infrastructure"]
tags: ["ollama", "amd", "rocm", "gpu", "ms-s1-max", "llm"]
description: "Running local LLMs with Ollama on AMD GPU hardware using ROCm on the MS-S1 MAX mini workstation."
---

Setting up local LLMs on AMD hardware requires ROCm (not CUDA). Here's how to get Ollama running with GPU acceleration on the MS-S1 MAX.

## Hardware

MS-S1 Max specs:
- **CPU:** AMD Ryzen AI Max+ 395 (Strix Halo)
- **GPU:** Radeon 8060S (gfx1151, integrated APU)
- **RAM:** 128GB DDR5 (shared with GPU via GTT)
- **GPU Memory:** 100GB available for models (via ROCm)

## Docker Compose

```yaml
services:
  ollama:
    image: ollama/ollama:0.17.5-rocm
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    devices:
      - /dev/kfd
      - /dev/dri
    environment:
      - OLLAMA_NUM_PARALLEL=4
      - OLLAMA_MAX_LOADED_MODELS=2
      - OLLAMA_FLASH_ATTENTION=true
      - OLLAMA_KV_CACHE_TYPE=q4_0
      - HSA_OVERRIDE_GFX_VERSION=11.5.1
      - HSA_ENABLE_SDMA=0

volumes:
  ollama_data:
```

## Key Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `OLLAMA_NUM_PARALLEL` | 4 | Concurrent requests per model |
| `OLLAMA_MAX_LOADED_MODELS` | 2 | Multiple models in memory |
| `HSA_OVERRIDE_GFX_VERSION` | 11.5.1 | Strix Halo gfx1151 support |

## Model Benchmarks (2026-03-06)

| Model | TPS | Context | Status | Notes |
|-------|-----|---------|--------|-------|
| **gpt-oss:20b** | **42** | 128k | ✅ PRIMARY | Fast, reliable |
| **gpt-oss:120b** | **25** | 128k | ✅ PRIMARY | Deep reasoning |
| qwen3.5:9b/27b/35b | 0.2-0.4 | - | ❌ BROKEN | Thinking mode bug |
| nomic-embed-text | - | - | ✅ | Embeddings (15ms) |

**Note:** gpt-oss:120b has a ~70s first-prompt penalty (model loading), then maintains ~30 TPS. gpt-oss:20b is ~70% faster and recommended for most tasks.

## Multi-Agent Capacity

The 128GB RAM with 100GB GPU allocation supports concurrent workloads:

| Configuration | GPU Usage | Works? |
|---------------|-----------|--------|
| 4× gpt-oss:20b parallel | ~84 GB | ✅ |
| 1× gpt-oss:120b + 2× gpt-oss:20b | 97 GB | ✅ Tested |
| 2× gpt-oss:120b | ~134 GB | ❌ Exceeds capacity |

## GRUB Configuration

```bash
# /etc/default/grub - DO NOT CHANGE (working optimally)
GRUB_CMDLINE_LINUX_DEFAULT="ttm.pages_limit=26214400 ttm.page_pool_size=26214400 amdgpu.gpu_recovery=1 amdgpu.sched_jobs_max=1024"
```

**Why 100GB not 124GB:** Host services need ~18GB RAM. The toolbox recommendation (124GB) assumes bare metal with no containers. 100GB GPU allocation leaves comfortable headroom.

## Memory Architecture

This is an APU (integrated GPU), not a discrete card:

```
┌─────────────────────────────────────┐
│  AMD Ryzen AI Max+ 395 (Strix Halo) │
│  ┌───────────┐     ┌──────────────┐ │
│  │ CPU Cores │     │ Radeon 8060S │ │
│  └───────────┘     └──────────────┘ │
│                           │         │
│                    1 GB VRAM (cache)│
│                    100 GB GTT (ROCm) │
└─────────────────────────────────────┘
```

| Memory Type | Size | Purpose |
|-------------|------|---------|
| VRAM (dedicated) | 1 GB | On-die cache |
| GTT (system RAM) | 100 GB | Model layers via ROCm |

## Verification

```bash
# Check GPU memory available
docker exec ollama ollama ps

# Check ROCm backend loaded
docker logs ollama 2>&1 | grep -i rocm
# Should see: "loaded ROCm backend from /usr/lib/ollama/rocm/libggml-hip.so"

# Test model
ollama run gpt-oss:20b "Hello"
```

## What to Avoid

- **Don't update kernel/firmware** - 6.17.0-14 + firmware 20240318 works
- **Don't use qwen3.5 models** - Thinking mode causes 60-100x slowdown
- **Don't increase VRAM past 100GB** - Host services need RAM

## References

- [Ollama ROCm](https://github.com/ollama/ollama/blob/main/docs/docker.md#amd--rocm) - Official ROCm image