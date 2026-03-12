---
title: "Ollama AMD ROCm Setup on MS-S1 MAX"
date: 2026-03-07
author: Derek Leeds
categories: ["Infrastructure"]
tags: ["ollama", "amd", "rocm", "gpu", "ms-s1-max", "llm"]
description: "Running local LLMs with Ollama on AMD GPU hardware using ROCm on the MS-S1 MAX mini workstation."
---

Setting up local LLMs on AMD hardware requires ROCm (not CUDA). Here's how to get Ollama running with GPU acceleration on the MS-S1 MAX.

## Hardware

MS-S1 MAX specs:
- **CPU:** AMD Ryzen AI Max+ 395 (Strix Halo APU)
- **GPU:** Radeon 8050S/8060S Graphics (integrated, ROCm supported)
- **RAM:** 64GB DDR5
- **Storage:** 1TB NVMe

## Docker Compose

```yaml
services:
  ollama:
    image: ollama/ollama:0.17.1-rc1-rocm
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
      - HSA_OVERRIDE_GFX_VERSION=11.0.0

volumes:
  ollama_data:
```

## Key Points

1. **Use the ROCm image** - `ollama/ollama:0.17.1-rc1-rocm`, not the default image
2. **Device passthrough** - `/dev/kfd` and `/dev/dri` are required for AMD GPU access
3. **GFX override** - HSA_OVERRIDE_GFX_VERSION may be needed for newer GPUs

## Verification

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Pull a model
ollama pull llama3.2

# Run with GPU
ollama run llama3.2
```

## Performance

On MS-S1 MAX with ROCm:
- **llama3.2:3b** - ~40 tokens/sec
- **codellama:7b** - ~25 tokens/sec

Models larger than ~14B may run out of VRAM on the integrated GPU.