---
title: Automations and Actions
---

# Automations and Actions

Spatial Context registers two actions for use in automations and scripts. Both are for administrators, the same as the panel. An automation can always run them. A script runs as the person who started it, so a script started by a non-administrator (from a dashboard button or a voice assistant, for example) is refused, and so is a direct call from Developer Tools or the API with a non-administrator's token.

| Action | Effect |
|---|---|
| `spatial_context.get_map` | Returns the whole layout as the action's response. See [The Map Data](/ai/map-data). |
| `spatial_context.refresh_zigbee_mesh` | Runs a fresh Zigbee scan and caches the result, so the Zigbee layer opens with current data. |

## Read the Map

```yaml
actions:
  - action: spatial_context.get_map
    response_variable: home_map
```

## Refresh the Zigbee Mesh

A scan takes one to two minutes. Run it from a scheduled automation, not interactively. The cached scan is kept in memory, so it is empty after Home Assistant restarts until the next scan.

```yaml
triggers:
  - trigger: time
    at: "03:00:00"
actions:
  - action: spatial_context.refresh_zigbee_mesh
```

::: warning
The scan waits up to **Scan Timeout** in [Settings](/guide/settings) for the Zigbee source to answer. On a large mesh, raise it if the scan times out.
:::
