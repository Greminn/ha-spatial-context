---
title: Stored Data
---

# Stored Data

Layouts are stored by Home Assistant, separately from the integration files, so updates keep them. **⋮ → Export JSON** downloads a copy as [map data](/ai/map-data).

## Backups

The first time each version runs, it copies the layout to `spatial_context.layout.backup-<version>` in the `.storage` folder, and keeps the three newest copies. Home Assistant's own backups include them.

To restore one:

1. Stop Home Assistant.
2. Copy the backup over `spatial_context.layout`.
3. Start Home Assistant.

A version that is older than the one that saved the layout refuses to load it, instead of overwriting it.
