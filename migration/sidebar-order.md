# Sidebar order

## Archived Hugo order signals

The original section weights were:

| Section           | Hugo weight |
| ----------------- | ----------: |
| AI and agents     |          10 |
| Infrastructure    |          10 |
| OpenClaw          |          20 |
| Hermes Agent      |          25 |
| Memory management |          30 |
| Security          |          40 |

Article-level weights remain in the archived frontmatter and in the migrated content schema for reference.

## Astro and Starlight order

The new sidebar is deliberately grouped by reader problem:

1. Start here
2. AI and agents
3. Agent orchestration
4. Hermes Agent
5. Memory architecture
6. Infrastructure
7. Security
8. About

The top-level groups are explicit in `astro.config.mjs`. Entries inside a group are directory-generated. Section overview pages use `sidebar.order: 1` and a clear label so they stay first where the overview is important.

This changes the category presentation without changing any public URL.
