# Changelog

Notes for each release are also on the [releases page](https://github.com/Greminn/ha-spatial-context/releases). This file starts at 1.0.0 and summarises the beta releases before it.

## Unreleased

### Added
- The Home Assistant version is shown under About in Settings, so it is easy to include in a bug report.

### Changed
- The Settings page is titled **Spatial Context Settings**, and its back arrow says **Back to Spatial Context**.

### Fixed
- The OpenThread Border Router app, and Home Assistant Yellow, Green, SkyConnect and ZBT-2 hardware, can now be placed on the plan and chosen under **Settings → Border router** (#42).
- The **Not placed yet** filter in the device list no longer shows devices that are placed on another floor.

## 1.0.0

The first stable release.

### Added
- A full documentation site, with a first floor plan walkthrough and a page for each feature.
- A key for the Connectivity Map that explains solid, dashed and grey lines, shows the weakest and strongest readings on screen, and reads off the value as you move along the bar.
- Zigbee layer support for ZHA, as well as Zigbee2MQTT.
- A Thread border router setting for the Matter layer.
- A placed and not-placed filter in the device list, with buttons to find a placed device on the plan or remove it.
- A **Use area name** button on a room, a **Getting started guide** link in the menu, and menus that close when you click away.
- A copy of the layout is kept for each version, and a version that is older than the one that saved the layout refuses to load it.

### Changed
- The panel and every command are for administrators only.
- Errors shown in the panel are short messages, and the detail goes to the Home Assistant log.
- Saves have size limits, and the debug log masks web and IP addresses.
- Zigbee readings of 0 or 1, which are stale entries in a neighbour table, are ignored. A link with no real reading is drawn grey.
- New buildings on the Property tab are placed at their real-world size.
- The panel code is split into smaller modules, and tests now run in CI.

### Fixed
- The device registry is read the way Home Assistant now expects.

## Before 1.0.0

Releases up to 0.16.0-beta.2 were pre-releases. They built the floor plan editor, the Property tab, the Connectivity Map layers (Zigbee, Wi-Fi, Matter and Bluetooth), the map data and the `get_map` action, English and German translations, and the native Home Assistant look. See the [releases page](https://github.com/Greminn/ha-spatial-context/releases) for each one.
