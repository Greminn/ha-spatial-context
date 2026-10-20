---
title: Using the Map with AI
---

# Using the Map with AI

The `spatial_context.get_map` action returns the whole layout as data that an AI agent can read.

An agent that is already connected to Home Assistant through an MCP server or the REST API can call the action like any other. No further setup is needed. The action returns its data as a response, so call it with response enabled (`return_response: true` over the REST API, or `response_variable` in a script).

```yaml
actions:
  - action: spatial_context.get_map
    response_variable: home_map
```

The data format is described in [The Map Data](/ai/map-data).

## What an Agent Can Work Out

Positions are real distances, so an agent can determine:

- which room a device is in,
- how far apart two devices are,
- which walls, and of what material, lie between a Zigbee router and a sensor,
- whether a sensor is mounted too high for its detection cone,
- which devices are outdoors.

::: warning
The map contains device names and their positions in the home. A cloud-hosted agent sends what it reads to its provider. Connect only agents that are trusted with that data.
:::
