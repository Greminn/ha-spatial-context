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

## Compact Answers

On a large home the whole map is a lot to read. `spatial_context.query` answers the usual questions in a few thousand tokens at most, and works out the room each device is in from where its pin sits.

| `tool` | Fields | Answer |
|---|---|---|
| `summary` | | Levels, rooms and their neighbours, routers and access points and where they are, networks, the top findings, and what is approximate |
| `device_context` | `device` | Where one device is, its radios, every link with distance, walls, predicted and measured signal, and the nearest routers |
| `path` | `a`, `b` | Distance, floors and walls between two devices, the rooms on the way, and the predicted signal |
| `weak_links` | `layer`, `level` (optional) | Links far weaker than distance and walls explain, worst first |
| `room` | `room` | One room's devices, neighbours and findings |

Devices and rooms can be given by name, by Home Assistant id, or by the short ids the answers use (`d12`, `r3`).

```yaml
actions:
  - action: spatial_context.query
    data:
      tool: device_context
      device: Hallway Motion
    response_variable: answer
```

Signal predictions use a rough model: free-space loss over the real distance, minus each wall's loss and 13 dB per floor. Zigbee only reports LQI, which is converted to dBm on a straight line; it is good for ranking links, not as a measurement.

### Conversation Agents

On Home Assistant 2026.11 and later the same answers are available as LLM tools (`spatial_context__summary` and so on) on the **Home Assistant** LLM API. They are off until turned on:

```yaml
actions:
  - action: spatial_context.update_settings
    data:
      llm_tools_enabled: true
```

The radio model's settings are changed with `spatial_context.update_settings`: `floor_height_m` (default 3 m), `rf_path_loss_exponent` (default 2.0) and `rf_slab_loss_db` (default 13 dB).

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
