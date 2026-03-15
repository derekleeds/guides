---
title: "Running Ollama with AMD ROCm on the MS-S1-MAX"
linkTitle: "Ollama with AMD ROCm"
date: 2026-03-07
lastmod: 2026-03-13
authors: ["Derek Leeds"]
weight: 10
description: "How to set up Ollama with AMD ROCm acceleration on the MS-S1-MAX for local LLM inference."
---

The MS-S1-MAX is a compact workstation with AMD Ryzen AI Max+ 395 and integrated Radeon graphics. Here's how to run Ollama with GPU acceleration.

## Prerequisites

- MS-S1-MAX or similar AMD GPU system
- Ubuntu 24.04 or later
- Docker installed

## Installation

### 1. Install ROCm

```bash
# Add ROCm repository
sudo apt update
sudo apt install -y rocm-dkms

# Add user to render and video groups
sudo usermod -aG render,video $USER
```

### 2. Install Ollama

```bash
# Pull Ollama Docker image
docker pull ollama/ollama:latest

# Run with GPU support
docker run -d \
  --name ollama \
  --device /dev/kfd \
  --device /dev/dri \
  -p 11434:11434 \
  ollama/ollama:latest
```

### 3. Pull a Model

```bash
docker exec -it ollama ollama pull llama3.2
```

## Performance

| Model | TPS | Context |
|-------|-----|---------|
| gpt-oss:20b | 42 | 128k |
| gpt-oss:120b | 25 | 128k |

## Troubleshooting

### GPU Not Detected

```bash
# Check ROCm is working
rocminfo

# Check render permissions
ls -la /dev/kfd /dev/dri
```

### Container Permission Issues

Make sure your user is in the `render` and `video` groups, then restart.

---

*For more on AMD ROCm, see [AMD's ROCm documentation](https://rocm.docs.amd.com/).*