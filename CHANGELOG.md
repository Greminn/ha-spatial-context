# Changelog

Notes for each release are also on the [releases page](https://github.com/Greminn/ha-spatial-context/releases). This file starts at 1.0.0 and summarises the beta releases before it.

## Unreleased

### Added
- Devices can be hidden from the **Place device** list with the eye button on a row, and brought back from the new **Hidden devices** filter (#43).
- **Clear placed devices** asks how far to go: in the selected area, on this floor, in this building or everywhere, with the number of devices for each (#44).
- **Reset floor** has a checkbox for each thing it can clear: rooms, walls, doors and windows, placed devices and the background image (#45). Choosing everything works as before.
- An **Opening a view** setting: choose **Fit to screen** and every floor and the Property tab open fitted to the screen instead of at their saved view. Saved views are not changed (#48).
- The Home Assistant version is shown under About in Settings, so it is easy to include in a bug report.
- **Let AI assistants read the map** (Settings, AI Assistants). Off by default. When it is on, Spatial Context adds a read-only `GetSpatialMap` tool that Home Assistant's MCP Server and conversation agents can use, so an assistant such as ChatGPT can look up the current map without you exporting it. Pick it in the MCP Server's settings. It returns the whole map, or just one floor or room, and it is only available to administrators. It needs Home Assistant 2026.10 or newer (#53).
- A **Plan background** choice in the Background menu: Auto, White (a white sheet that is never inverted in a dark theme) or None (a transparent plan shows the canvas). It is saved in this browser only (#74, thanks cb2206).
- **Bulk place by area** (Place mode, ⋮ menu): drops every unplaced device of the chosen area, or of every area linked to a room on the floor, inside its room. These pins are drawn dashed and see-through, marked approximate in `get_map`, until you drag them or choose **Confirm position** on the device card. A new **Keep placing** toggle arms the next unplaced device after each pin (#75, thanks cb2206).
- **Create rooms for this floor's areas** (floor ⋮ menu): a placeholder room for each Home Assistant area on the floor that has none yet, named after the area and sized by its device count, ready to drag onto the real outline. **Generate walls from room outlines** then draws the walls from the rooms: stretches one room has become exterior walls, shared stretches become one interior wall. Each is one undo step (#77, thanks cb2206).
- **PDF and SVG floor plans** can be used as a background, and a background can be turned about its centre (quarter turns or a slider) for a sideways scan. The PDF reader loads only when you pick a PDF (#76, thanks cb2206).
- **Background > Use a camera image** takes the current picture from a camera entity, such as a robot vacuum's map, and uses it as the floor's background. It is a one-off copy, not a live view. The first time, it asks your permission to list your cameras; Settings, Backgrounds turns that off again (#78, thanks cb2206).
- **Trace room** fills a closed space in one click: click inside walls that fully enclose an area and the room is traced from them. A gap in the walls, a click close to a wall, or holding Shift traces by hand as before (#46).
- Click and drag to size a new building on the Property tab. Drag from one corner and the outline keeps the building's proportions. A plain click still places it at the default size (#56).
- A **Back to group** arrow on a device's card, when you opened it from a list of devices at the same spot (#62).
- A **Move out of this spot** button on each device in that list, so a stacked device can be moved without deleting it (#47).
- A warning triangle on a Zigbee link that reads much weaker than the walls between its two devices predict. Hover it for the expected and measured signal. It needs the floor's scale set. A **Flag weak links** setting chooses how big the gap must be (25 dB by default, 0 turns it off) (#29).
- A device's card lists its links to devices that are not placed on any floor, marked "not placed on the plan" (#63).
- A selected Zigbee link's card says when the link reads weaker than the walls predict, with the expected and measured signal (#29).

### Changed
- Spatial Context needs Home Assistant 2026.10 or newer, and the listed minimum now says so.
- The `spatial_context.get_map` and `spatial_context.refresh_zigbee_mesh` actions are limited to administrators. Automations still run them as before, but a script started by a non-administrator is refused (#67, thanks cb2206).
- A room linked to an area now follows the area's name: rename the area in Home Assistant and the room follows. Type a name to override it, clear the box (or choose **Use area name**) to follow the area again. Rooms that already carry their area's name start following it (#52).
- The Settings page is titled **Spatial Context Settings**, and its back arrow says **Back to Spatial Context**.
- Picking **Zigbee mesh** on the Connectivity Map loads the mesh straight away instead of waiting for you to press Load. A cached map still shows first (#60).
- The notice about an older panel has a **Reload** button that fetches the current panel, and the notice to restart Home Assistant only appears when the integration's own code changed, not for an update that only changes the panel (#73, thanks cb2206).

### Fixed
- A Zigbee2MQTT home no longer logs Home Assistant "blocking call" warnings about ZHA when the map is read.
- Going back to a group of devices after scrolling a long link list on a device's card no longer shows a blank card.
- The first click-and-drag to size a new building no longer fails after choosing the building from the list (#56).
- A ZHA coordinator with no enabled entities, such as the ZBT-2 or an SLZB-06 radio, is listed in the Place device list (#60).
- Devices whose only enabled entities are firmware update or event entities, such as IKEA Tradfri repeaters and Styrbar remotes, are listed in the Place device list (#54).
- With only one floor, the Place device list starts on **All floors**, so devices with no area, or an area on no floor, are no longer hidden (#54).
- The OpenThread Border Router app, and Home Assistant Yellow, Green, SkyConnect and ZBT-2 hardware, can now be placed on the plan and chosen under **Settings → Border router** (#42).
- The **Not placed yet** filter in the device list no longer shows devices that are placed on another floor.
- The panel now follows the Home Assistant language. The German translation was never shown before, and the last few English-only labels are translated (#70, thanks cb2206).
- With UniFi, a Wi-Fi client's link keeps the signal strength UniFi reports, where before it was dropped for clients whose tracker is enabled (#65, thanks cb2206).
- With UniFi, Wi-Fi clients whose tracker is disabled are linked to their access point again; before, none of them were (#72, thanks cb2206).
- A device in a room that has since been deleted is now listed as unassigned in `get_map` and Export JSON, instead of missing (#66, thanks cb2206).
- A save with malformed or non-finite points, or a bad scale, is refused, and a malformed point already stored no longer breaks the floor (#68, thanks cb2206).
- A Zigbee device that has moved to a different parent is no longer drawn as still linked to the old one, for ZHA and Zigbee2MQTT (#69, thanks cb2206).

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
