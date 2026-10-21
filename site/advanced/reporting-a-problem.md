---
title: Reporting a Problem
---

# Reporting a Problem

A debug report records versions, settings and layout counts, and the recent debug log, for attaching to a GitHub issue.

1. Turn on **Settings → Debug Logging**.
2. Reproduce the problem. The panel writes loads, saves, errors and map loads to `spatial_context_debug.log` in the configuration folder, capped at about 1 MB.
3. Select **⋮ → Download Debug Report**.
4. Attach the file to an [issue on GitHub](https://github.com/Greminn/ha-spatial-context/issues).
5. Turn **Debug Logging** off.

The report contains ids and counts only, never device names or positions. Web addresses and IP addresses in the log are masked.

::: tip Need help?
Feature ideas are welcome too. See [Suggesting a Feature](/advanced/suggesting-a-feature).
:::
