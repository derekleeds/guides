# Derek's Guides

How-to guides for AI agents, homelab infrastructure, and self-hosting.

Built with [Hugo Theme Chirpy](https://github.com/geekifan/hugo-theme-chirpy).

## Topics

- **Memory Management** - Three-tier memory architecture for AI agents
- **Infrastructure** - Proxmox, Docker, Kubernetes, networking
- **OpenClaw** - Agent orchestration and automation

## Development

```bash
# Install Hugo extended
brew install hugo

# Clone with submodules
git clone --recursive https://github.com/derekleeds/guides.git
cd guides

# Run local server
hugo server

# Build for production
hugo --minify
```

## Deployment

This site deploys to Cloudflare Pages. Push to `main` branch to deploy.

## Author

**Derek Leeds**

- Blog: [journal.derekleeds.cloud](https://journal.derekleeds.cloud)
- GitHub: [github.com/derekleeds](https://github.com/derekleeds)

## License

Content is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) unless otherwise noted.