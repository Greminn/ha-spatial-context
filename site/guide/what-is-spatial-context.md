---
title: What Is Spatial Context?
---

# What Is Spatial Context?

Spatial Context is a Home Assistant integration that stores floor plans with the real position of each device on them.

Home Assistant records which area a device is in. It does not record where in the home the device sits, how far it is from another device, or which walls are between them. Spatial Context adds that data, and exposes it to AI agents, automations and scripts.

The integration adds a **Spatial Context** panel to the sidebar. Its tabs come from the floors defined under **Settings → Areas → Floors**.

## What You Can Do

- Trace rooms, walls, doors and windows over an uploaded floor plan image, calibrated to real units. See [Your First Floor Plan](/guide/first-floor-plan).
- Give each wall a material and thickness, which gives it an estimated signal loss. See [Wall Materials](/guide/wall-materials).
- Place Home Assistant devices on the plan at a position and mounting height. See [Placing Devices](/guide/placing-devices).
- Line floors up on top of one another, so links between floors can be shown.
- See Zigbee, Wi-Fi, Matter and Bluetooth links between placed devices, graded by signal quality. See [Connectivity Map](/guide/connectivity-map).
- Place buildings and outdoor devices on a site photo or map. See [The Property Tab](/guide/property-tab).
- Give AI agents, automations and scripts the whole layout as measured data, through the `spatial_context.get_map` action. See [Using the Map with AI](/ai/using-ai).

## How It Works

1. Home Assistant supplies floors, areas and devices. Spatial Context defines no floors of its own.
2. You trace each floor over an image and give it a scale.
3. You place devices on the plan.
4. Home Assistant stores the layout, and the panel reads it back.
5. The Connectivity Map reads link data live from Zigbee2MQTT or ZHA, your Wi-Fi integration, Matter and Bluetooth. It is not stored with the layout.
6. AI agents, automations and scripts read the layout through the `spatial_context.get_map` action, and **Export JSON** downloads the same data. It has no signal readings, because link data is not stored.

Start with [Install](/guide/install), then [Your First Floor Plan](/guide/first-floor-plan).
