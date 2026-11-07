# Changelog

Notes for each release are also on the [releases page](https://github.com/Greminn/ha-spatial-context/releases). This file starts at 1.0.0 and summarises the beta releases before it.

## Unreleased

### Added
- Devices can be hidden from the **Place device** list with the eye button on a row, and brought back from the new **Hidden devices** filter (#43).
- **Clear placed devices** asks how far to go: in the selected area, on this floor, in this building or everywhere, with the number of devices for each (#44).
- **Reset floor** has a checkbox for each thing it can clear: rooms, walls, doors and windows, placed devices and the background image (#45). Choosing everything works as before.
- An **Opening a view** setting: choose **Fit to screen** and every floor and the Property tab open fitted to the screen instead of at their saved view. Saved views are not changed (#48).
- The Home Assistant version is shown under About in Settings, so it is easy to include in a bug report.
- Click and drag to size a new building on the Property tab. Drag from one corner and the outline keeps the building's proportions. A plain click still places it at the default size (#56).
- A **Back to group** arrow on a device's card, when you opened it from a list of devices at the same spot (#62).
- A **Move out of this spot** button on each device in that list, so a stacked device can be moved without deleting it (#47).
- A warning triangle on a Zigbee link that reads much weaker than the walls between its two devices predict. Hover it for the expected and measured signal. It needs the floor's scale set. A **Flag weak links** setting chooses how big the gap must be (25 dB by default, 0 turns it off) (#29).
- A device's card lists its links to devices that are not placed on any floor, marked "not placed on the plan" (#63).

### Changed
- Spatial Context needs Home Assistant 2026.10 or newer, and the listed minimum now says so.
- The `spatial_context.get_map` and `spatial_context.refresh_zigbee_mesh` actions are limited to administrators when a user calls them directly. Automations and scripts still run them as before.
- A room linked to an area now follows the area's name: rename the area in Home Assistant and the room follows. Type a name to override it, clear the box (or choose **Use area name**) to follow the area again. Rooms that already carry their area's name start following it (#52).
- The Settings page is titled **Spatial Context Settings**, and its back arrow says **Back to Spatial Context**.

### Fixed
- Going back to a group of devices after scrolling a long link list on a device's card no longer shows a blank card.
- The first click-and-drag to size a new building no longer fails after choosing the building from the list (#56).
- A ZHA coordinator with no enabled entities, such as the ZBT-2 or an SLZB-06 radio, is listed in the Place device list (#60).
- Devices whose only enabled entities are firmware update or event entities, such as IKEA Tradfri repeaters and Styrbar remotes, are listed in the Place device list (#54).
- With only one floor, the Place device list starts on **All floors**, so devices with no area, or an area on no floor, are no longer hidden (#54).
- The OpenThread Border Router app, and Home Assistant Yellow, Green, SkyConnect and ZBT-2 hardware, can now be placed on the plan and chosen under **Settings → Border router** (#42).
- The **Not placed yet** filter in the device list no longer shows devices that are placed on another floor.
- The panel now follows the Home Assistant language. The German translation was never shown before, and the last few English-only labels are translated.
- With UniFi, a Wi-Fi client's link keeps the signal strength UniFi reports, where before it was dropped for clients whose tracker is enabled.
- A device in a room that has since been deleted is now listed as unassigned in `get_map` and Export JSON, instead of missing.
- A save with malformed or non-finite points, or a bad scale, is refused, and a malformed point already stored no longer breaks the floor.

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
