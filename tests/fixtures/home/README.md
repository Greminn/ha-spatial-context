# Real-install radio/topology fixtures (anonymized)

These files are real radio and topology data from one Home Assistant install (about 300 devices).
They are meant for tests of the ZHA, Thread and Wi-Fi layers, for building "who hears whom"
graphs, and for checking `get_map` size. Every identifier has been replaced.

## Provenance
- **Capture date:** 2026-11-06. Read-only capture through the `ha-mcp` server (HA 2026.11, ZHA, Matter
  Server 9.3.0 / matter.js) and a UniFi Network MCP server. Nothing on the instance was changed.
- **ZHA:** per-device diagnostics, paths `data.nwk`, `data.lqi`, `data.rssi`, `data.neighbors` and
  `data.routes`, plus the device registry.
- **Matter/Thread:** per-device diagnostics (`data.node.attributes` 0/53/0-3, 0/53/7, 0/53/8, 0/51/0),
  `node_diagnostics` from the device lookup, and the `thread` integration's border-router list. Datasets
  and network keys were never read.
- **Wi-Fi:** the UniFi AP list, wireless clients, and per-client wireless details (associated AP,
  signal, rssi, noise, satisfaction).

## Files
| File | Content |
|---|---|
| `areas.json` | 2 floors (Main, level 0; Upper, level 1), 20 areas (`area_NN`, `room-NN`, coarse `kind`), and `device_area` covering every device id used in the other files |
| `zha_devices.json` | All 133 ZHA devices: 1 coordinator, 63 routers, 69 end devices. Neighbor and route tables for the coordinator and all 63 routers (1,619 neighbor rows, 447 route rows). nwk/lqi/rssi for 16 sampled end devices; the other 53 have registry fields only |
| `matter_thread.json` | 26 Matter registry devices: 18 real and 8 disabled shadow records. 16 have Thread neighbor and route tables. Also 3 Thread networks with their border routers |
| `unifi_wifi.json` | 5 APs, 72 wireless clients (each with its associated AP and signal), and the 15 HA devices matched to clients by MAC. 16 more clients are matched by name to the ZHA NSPanel routers, which are the same physical devices |

## Anonymization rules
- **HA ids:** device ids are `dev_NNN`, area ids are `area_NN` and floor ids are `floor_main` / `floor_upper`.
  Real names are replaced with `<role>-NN (<model>)`, for example `router-07 (TS0001)`,
  `matter-03 (ALPSTUGA air quality monitor)` and `wifi-client-21 (wall-panel)`.
- **Kept as captured:** manufacturer, model, device_type/role, power_source, lqi/rssi, relationships,
  route statuses, channels, Matter node ids, and each area's floor.
- **ZHA:** NWK addresses are kept, because they are random per network and are the join key; neighbor
  IEEEs were already redacted by HA. Device IEEEs are fake, `00:00:00:00:00:00:HH:LL` (registry index).
- **Thread:**
  - Network names become `net-a` (HA OTBR, ch 15), `net-b` (a second ecosystem's network, ch 25) and `net-c`.
  - PAN ids are 0x1234 / 0x5678, ext PAN ids are fake, and border-router hostnames are `br-XN.local.`.
  - RLOC16 values are kept.
  - ExtAddresses are fake: exact own addresses are in the `0x00000A...` range and unresolved neighbors in `0x00000B...`.
  - IPv6 uses the fake prefix `fd00:0:<net>::/64`. The RLOC IID is kept, so `own_rloc16` can still be derived.
- **Wi-Fi:** MACs are fake. APs are `02:00:00:00:00:NN` and clients are `02:00:00:00:01:NN`. SSIDs
  become `ssid-iot`, `ssid-panel` and `ssid-main`. Hostnames are reduced to a generic `category`. No IPs are included.
- **Private map:** the fake-to-real mapping is kept outside the repository and must never be committed.

## Join keys
- **ZHA:** a neighbor's `nwk` matches a device's `nwk`. Every Router/Coordinator neighbor resolves to a
  captured router. Of the 60 distinct EndDevice children, 12 resolve to a sampled end device.
- **Thread:** neighbor field `2` (Rloc16) and route field `1` match `own_rloc16`. 29 of 45 neighbor rows
  resolve to an HA device. The rest are Thread nodes that HA does not know about, such as border routers
  and devices commissioned only in the other ecosystem.
- **Wi-Fi:** `clients[].ap_id` matches `aps[]`, and `clients[].ha_device_id` matches the other files.

## Known gaps and quirks
- **ZHA:**
  - Only 16 of 69 end devices have their own nwk/lqi/rssi; the rest appear only as children in router tables.
  - Router `power_source` and the `device_type` of non-sampled devices are inferred from the model
    (`_inferred`). `available` comes from entity states.
  - TS0001/TS0004 relays and the single _TZ3210 relay return empty route tables. Only the coordinator and
    the NSPanel routers report routes.
  - About 30 route `next_hop`/`dest_nwk` values (mostly in the coordinator's 196-entry table) do not match
    any current device. They are stale.
  - Router-reported `depth` is meaningless. NSPanels always report 15; the relays report 0-3.
  - Some tables contain duplicate nwk rows, odd relationships (`undefined_0b101`, a Router listed as
    Child) and multiple Parents. They were kept as captured.
  - Rows were copied from tool output by hand; a cell-by-cell re-check was not done.
- **Thread:**
  - Raw 64-bit ExtAddresses had float precision loss, so join on RLOC16 rather than ext addresses.
  - For several devices, 0/53/0, 0/53/2 and 0/53/3 were filled from network constants rather than read
    per device (`attrs_fetched_individually`).
  - 2 devices had no live `node_diagnostics`.
  - One bulb is unavailable; its tables are cached last-known values.
  - The bridge node and its bridged lock have no 0/53 cluster.
  - Apple-only accessories are invisible.
- **Wi-Fi:**
  - Each client has a single associated AP; there is no RSSI-per-AP vector.
  - AP areas are null in HA. `name_hint_area_id` is inferred from the AP names.
  - 41 clients are unmatched: phones, laptops, unknown IoT, and appliances with no MAC connection in HA.
- **Not included:** Bluetooth (only 1 scanner), Lutron, and the HA `panel_assistant` side of the NSPanels.
