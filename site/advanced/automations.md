---
title: Automations and Actions
---

# Automations and Actions

Spatial Context registers these actions for use in automations and scripts.

| Action | Effect |
|---|---|
| `spatial_context.get_map` | Returns the whole layout as the action's response. See [The Map Data](/ai/map-data). |
| `spatial_context.refresh_zigbee_mesh` | Runs a fresh Zigbee scan and caches the result, so the Zigbee layer opens with current data. |
| `spatial_context.refresh_links` | Re-reads the radio links (ZHA, Zigbee2MQTT, Matter/Thread, UniFi Wi-Fi) into the link store; optional `layers`. It runs by itself every 30 minutes and never starts a Zigbee scan, except a first Zigbee2MQTT network map when none has been fetched yet. Admin only when called by a user; automations and scripts can always run it. |

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
