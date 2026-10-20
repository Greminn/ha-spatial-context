---
title: What Is Spatial Context?
---

# What Is Spatial Context?

Spatial Context is a Home Assistant integration that stores floor plans with the real position of each device on them.

Home Assistant records which area a device is in. It does not record where in the home the device sits, how far it is from another device, or which walls are between them. Spatial Context adds that data, and exposes it to AI agents, automations and scripts.

The integration adds a **Spatial Context** panel to the sidebar. Its tabs come from the floors defined under **Settings → Areas → Floors**.

## What It Does

- Traces rooms, walls, doors and windows over an uploaded floor plan image, calibrated to real units.
- Places Home Assistant devices on the plan at a position and mounting height.
- Draws Zigbee, Wi-Fi, Matter and Bluetooth links between placed devices, graded by signal quality. See [Connectivity Map](/guide/connectivity-map).
- Places buildings and outdoor devices on a site photo or map. See [The Property Tab](/guide/property-tab).
- Returns the whole layout as data through the `spatial_context.get_map` action. See [Using the Map with AI](/ai/using-ai).

## Data Flow

1. Home Assistant supplies floors, areas and devices. Spatial Context defines no floors of its own.
2. Each floor is traced over an image and given a scale.
3. Devices are placed on the plan.
4. The layout is stored by Home Assistant, and read back through the panel, the export or the action.

Start with [Install](/guide/install), then [Your First Floor Plan](/guide/first-floor-plan).
