---
title: Install
---

# Install

Spatial Context installs as a custom integration, from HACS or by copying one folder from GitHub.

Requirements:

- Home Assistant 2024.10 or newer.
- Floors defined under **Settings → Areas → Floors**.

Each Connectivity Map layer and the Property map background have their own requirements. See [Requirements by Feature](#requirements-by-feature).

## Install with HACS

HACS is the easier route: it downloads the integration into `custom_components` and reports updates. Spatial Context is not in the HACS default repository, so it is added as a custom repository.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Greminn&repository=ha-spatial-context&category=integration)

Or add it by hand:

1. In HACS, select **⋮ → Custom Repositories**.
2. Enter `https://github.com/Greminn/ha-spatial-context` as the **Repository**.
3. Set **Type** to **Integration**, then select **Add**.
4. Select **Spatial Context**, then **Download**.
5. Restart Home Assistant.

::: warning
Every release is a pre-release. HACS hides pre-releases and shows a commit hash instead of a version. Enable **Show Beta Versions** for the repository to see them.
:::

## Install from GitHub

A manual copy has no update notifications, so each update is another copy. There is no build step: the built panel is committed to the repository.

1. Download the repository from GitHub, or clone it:

   ```sh
   git clone https://github.com/Greminn/ha-spatial-context.git
   ```

2. Copy `custom_components/spatial_context` into the `custom_components` folder of the Home Assistant configuration directory:

   ```
   config/
   └── custom_components/
       └── spatial_context/
           ├── __init__.py
           ├── manifest.json
           ├── www/
           └── ...
   ```

3. Restart Home Assistant.

## Add the Integration

1. Go to **Settings → Devices & Services**.
2. Select **Add Integration**, then **Spatial Context**.

**Spatial Context** appears in the sidebar. Carry on with [Your First Floor Plan](/guide/first-floor-plan).

## Requirements by Feature

The floor plan editor has no requirements beyond Home Assistant itself. The Connectivity Map layers need a data source each.

| Feature | Requires |
|---|---|
| Zigbee Mesh | Zigbee2MQTT connected over MQTT, or ZHA. Zigbee2MQTT is used when both are present. |
| Wi-Fi Network | An integration that reports each client's access point: UniFi Network, TP-Link Omada, or the custom TP-Link Deco integration. |
| Matter Network | The Matter integration. |
| Bluetooth | Home Assistant 2025.2 or newer, an administrator account, and Bluetooth devices registered by an integration (BTHome, Xiaomi BLE, SwitchBot and similar). ESPHome Bluetooth proxies are supported. |
| Property Map Background | Home Assistant 2026.10 or newer (its map tile service), a home location set in Home Assistant, and a browser with WebGL2. |

## Update

- **HACS:** select **Update** on Spatial Context, then restart Home Assistant.
- **GitHub:** copy the new `spatial_context` folder over the old one, then restart Home Assistant.

Layouts are stored separately from the integration files and are kept. See [Good to Know](/guide/good-to-know#after-updating) for the update banners.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Spatial Context is missing from **Add Integration** | Check the folder is exactly `config/custom_components/spatial_context`, not nested one level deeper, then restart Home Assistant. |
| No **Spatial Context** in the sidebar | Add the integration under **Settings → Devices & Services**. |
| "No floors found" | Add floors under **Settings → Areas → Floors**, then reopen the panel. |
| HACS offers a commit hash instead of a version | Enable **Show Beta Versions** for the repository. |

::: tip Need help?
[Open an issue on GitHub](https://github.com/Greminn/ha-spatial-context/issues). See [Reporting a Problem](/advanced/reporting-a-problem) for what to attach.
:::
