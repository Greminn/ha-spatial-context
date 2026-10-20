---
title: Connectivity Map
---

# Connectivity Map

The Connectivity Map draws the network links between placed devices on the plan, coloured from weak to strong.

The network button in the header opens the layers. A layer stays on after the menu closes, and the button is highlighted while one is showing. Selecting the layer again turns it off. A key sits along the bottom of the canvas.

![Zigbee mesh layer on the Top Floor, with a link selected and its signal shown in the card](/screenshots/screenshot-zigbee-mesh-v2.jpeg)

Selecting a device lists its links in its info card, strongest first. Selecting a line shows that link's details. Each layer has its own requirements. See [Requirements by Feature](/guide/install#requirements-by-feature).

## Zigbee Mesh

The Zigbee layer uses Zigbee2MQTT's network scan or ZHA's topology. A scan takes one to two minutes, so the last result is cached. The layer shows the cached scan, and **Refresh Mesh** runs a new one. **Load Mesh** appears when there is no cached scan yet.

By default the layer draws:

- each device's strongest link, on its own floor and to other floors,
- every parent and child route,
- the coordinator's direct links with an LQI of 50 or more.

**Show All Links** draws the full neighbour table, as Zigbee2MQTT's own map does.

LQI differs between chipsets. Some Hue bulbs report close to 255 for every link, and TI coordinators read low. Each device's readings are corrected for its own scale, worked out from how it and its neighbours rate the same links, and a link is graded on its weaker side. The link details show the corrected and the raw values.

An overnight [automation](/advanced/automations#refresh-the-zigbee-mesh) keeps the cache current.

## Wi-Fi Network

Links each client to its access point, with signal strength where available. Supported sources are UniFi Network (including clients whose tracker entity is disabled), TP-Link Omada and the custom TP-Link Deco integration.

## Matter Network

Shows the Matter network topology from Home Assistant. It updates live. The **Border Router** setting names the device placed for the Thread border router so that its links are drawn. See [Settings](/guide/settings).

## Bluetooth

Links each Bluetooth LE device registered in Home Assistant to the scanner or ESPHome proxy that hears it best, graded by RSSI. It updates live from the same data as **Settings → Bluetooth → Visualization**. The ESPHome device of each proxy and the BLE devices must be placed for the lines to show.

## Links Across Floors and Outdoors

A link to a device on another floor is a dashed line toward that device's real position, ending in a marker that jumps to that floor. Separate buildings use their Property tab placements for direction. Links to outdoor devices work the same way and are labelled **Outside**.
