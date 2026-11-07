"""Thread link provider: Matter nodes' Thread Network Diagnostics as snapshots.

Every Matter-over-Thread node HA has commissioned carries the Thread Network
Diagnostics cluster (0x0035 = 53) on endpoint 0, with its own neighbour table
(attribute 7) and route table (attribute 8). The Matter server keeps these
attributes in its node cache, so reading them costs no radio traffic.

Attribute paths are "endpoint/cluster/attribute", as in Matter diagnostics:
  0/53/0 channel, 0/53/1 routing role, 0/53/2 network name, 0/53/3 PAN id,
  0/53/4 extended PAN id, 0/53/7 neighbour table, 0/53/8 route table,
  0/53/13 leader router id, 0/53/67 own RLOC16 (Matter 1.4, rarely present),
  0/51/0 General Diagnostics network interfaces (hardware address, IPv6).
List entries are structs keyed by field id ("0", "1", ...).

Nodes are keyed by RLOC16 ("0x1000"). A node's own RLOC16 is not usually
published, so it is taken from 0/53/67 when present, else from its RLOC
IPv6 address (mesh-local prefix + 0:ff:fe00:RLOC16), else from the route
table row that costs 0. The 64-bit extended addresses in neighbour/route
rows are not used as keys: the Matter server has been seen delivering them
as rounded floats, so they cannot be compared exactly.

One snapshot per Thread network name: a house with HA's own border router
plus an Apple Home network has two, and HA sees nodes on both through
multi-admin. Neighbours HA has not commissioned (Apple-only accessories,
border routers) become nodes without a device_id.

Integration internals (the Matter adapter's client) are reached through
getattr; if the Matter integration changes, this provider reports an error
in its snapshot and nothing else is affected.
"""

from __future__ import annotations

import base64
import binascii
import logging
from typing import TYPE_CHECKING, Any

from .common import NodeIndex, all_devices, utc_now_iso
from .model import Link, LinkMetrics, LinkNode, LinkSnapshot, Role

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

PROVIDER = "matter_thread"

ATTR_CHANNEL = "0/53/0"
ATTR_ROUTING_ROLE = "0/53/1"
ATTR_NETWORK_NAME = "0/53/2"
ATTR_PAN_ID = "0/53/3"
ATTR_EXT_PAN_ID = "0/53/4"
ATTR_NEIGHBOR_TABLE = "0/53/7"
ATTR_ROUTE_TABLE = "0/53/8"
ATTR_LEADER_ROUTER_ID = "0/53/13"
ATTR_RLOC16 = "0/53/67"
ATTR_NETWORK_INTERFACES = "0/51/0"

# RoutingRoleEnum.
_ROUTING_ROLE = {
    0: "unspecified",
    1: "unassigned",
    2: "sleepy_end_device",
    3: "end_device",
    4: "reed",
    5: "router",
    6: "leader",
}
_ROLE: dict[int, Role] = {2: "end_device", 3: "end_device", 4: "end_device", 5: "router", 6: "leader"}
_END_DEVICE_ROLES = {2, 3, 4}

# General Diagnostics InterfaceTypeEnum: 4 = Thread.
_INTERFACE_THREAD = 4

# A route row's NextHop of 63 means "no next hop" (router ids are 0-62).
_NO_NEXT_HOP = 63

# Extended addresses delivered as floats are off by at most one float64 step
# (2048 near 2**63); a wider margin is still far below the chance of two
# real addresses being this close.
_EXT_ADDRESS_TOLERANCE = 1 << 13


def rloc16_key(value: int) -> str:
    return f"0x{value:04X}"


def _field(row: Any, index: int) -> Any:
    """Field `index` of a Matter struct, whether keyed "2" (JSON) or 2."""
    if not isinstance(row, dict):
        return getattr(row, str(index), None)
    if str(index) in row:
        return row[str(index)]
    return row.get(index)


def _int(value: Any) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return None


def _bytes(value: Any) -> bytes | None:
    """Octet strings arrive base64-encoded in node data (or as bytes)."""
    if isinstance(value, (bytes, bytearray)):
        return bytes(value)
    if isinstance(value, str):
        try:
            return base64.b64decode(value, validate=True)
        except (binascii.Error, ValueError):
            try:
                return bytes.fromhex(value.replace(":", ""))
            except ValueError:
                return None
    return None


def _hex_address(value: Any) -> str | None:
    """An 8-byte extended address as 16 lower-case hex digits, only when it
    arrives as bytes or a string (exact). Integers are not trusted."""
    raw = _bytes(value)
    if raw is None or len(raw) != 8:
        return None
    return raw.hex()


def rloc16_from_ipv6(addresses: list[Any]) -> int | None:
    """The RLOC16 in an RLOC address: interface id 0000:00ff:fe00:XXXX.

    ALOCs share the pattern with XXXX >= 0xFC00 (leader, border agent
    anycast); those name a service, not this node, so they are skipped.
    """
    for address in addresses or []:
        raw = _bytes(address)
        if raw is None or len(raw) != 16:
            continue
        if raw[8:14] != b"\x00\x00\x00\xff\xfe\x00":
            continue
        rloc16 = int.from_bytes(raw[14:16], "big")
        if rloc16 < 0xFC00:
            return rloc16
    return None


def _thread_interface(attributes: dict[str, Any]) -> Any:
    interfaces = attributes.get(ATTR_NETWORK_INTERFACES) or []
    for interface in interfaces:
        if _field(interface, 7) == _INTERFACE_THREAD:
            return interface
    return interfaces[0] if len(interfaces) == 1 else None


def own_rloc16(attributes: dict[str, Any]) -> tuple[int | None, str | None]:
    """(RLOC16, how it was found) for one node, or (None, None)."""
    direct = _int(attributes.get(ATTR_RLOC16))
    if direct is not None and 0 <= direct <= 0xFFFF:
        return direct, "attribute"

    interface = _thread_interface(attributes)
    if interface is not None:
        from_ipv6 = rloc16_from_ipv6(_field(interface, 6) or [])
        if from_ipv6 is not None:
            return from_ipv6, "ipv6"

    # A router's route table lists every router, itself at path cost 0.
    # Direct neighbour routers can read cost 0 too (seen on a real network), but a
    # node never has a link established to itself, so that row wins.
    zero_cost = [
        row
        for row in attributes.get(ATTR_ROUTE_TABLE) or []
        if _int(_field(row, 4)) == 0 and _int(_field(row, 1)) is not None
    ]
    unlinked = [row for row in zero_cost if _field(row, 9) is False]
    for candidates in (unlinked, zero_cost):
        if len(candidates) == 1:
            return _int(_field(candidates[0], 1)), "route_table"
    return None, None


def _inferred_role(rloc16: int, is_child: bool | None) -> Role:
    """Role of a node seen only as a neighbour. A router's RLOC16 has child
    id 0 (the low 9 bits); anything else is a child of that router."""
    if is_child:
        return "end_device"
    return "router" if rloc16 & 0x1FF == 0 else "end_device"


def build_snapshots(
    nodes: list[dict[str, Any]],
    border_routers: list[dict[str, Any]] | None = None,
    captured_at: str | None = None,
) -> list[LinkSnapshot]:
    """Build one snapshot per Thread network.

    `nodes`: [{node_id, available, device_id, name, attributes}] where
    `attributes` is the Matter node's attribute dict ("0/53/7" -> rows).
    `border_routers`: [{extended_address (hex), network_name, name, vendor,
    model}] from the thread integration's mDNS discovery, if known.
    """
    captured_at = captured_at or utc_now_iso()
    per_network: dict[str, dict[str, Any]] = {}

    for node in nodes:
        attributes = node.get("attributes") or {}
        if ATTR_NEIGHBOR_TABLE not in attributes and ATTR_ROUTING_ROLE not in attributes:
            continue  # Wi-Fi/Ethernet Matter node: no Thread data
        network = attributes.get(ATTR_NETWORK_NAME) or (
            f"xpan:{attributes[ATTR_EXT_PAN_ID]}" if attributes.get(ATTR_EXT_PAN_ID) else None
        )
        if not network:
            # Not attached right now (detached/disabled radio): no topology.
            continue
        state = per_network.setdefault(
            network,
            {"nodes": NodeIndex(), "links": [], "attrs": {}, "ext": {}, "deferred": []},
        )
        net_attrs = state["attrs"]
        for attr, path in (("channel", ATTR_CHANNEL), ("pan_id", ATTR_PAN_ID), ("ext_pan_id", ATTR_EXT_PAN_ID)):
            if attributes.get(path) is not None:
                net_attrs.setdefault(attr, attributes[path])

        role_code = _int(attributes.get(ATTR_ROUTING_ROLE))
        rloc16, source = own_rloc16(attributes)
        key = rloc16_key(rloc16) if rloc16 is not None else f"node-{node.get('node_id')}"
        interface = _thread_interface(attributes)
        ext_address = _hex_address(_field(interface, 4)) if interface is not None else None

        leader_id = _int(attributes.get(ATTR_LEADER_ROUTER_ID))
        if leader_id is not None and node.get("available", True):
            net_attrs.setdefault("leader", rloc16_key(leader_id << 10))

        node_entry = state["nodes"].add(
            LinkNode(
                key=key,
                role=_ROLE.get(role_code, "unknown") if role_code is not None else "unknown",
                device_id=node.get("device_id"),
                name=node.get("name"),
                attrs={
                    "matter_node_id": node.get("node_id"),
                    "available": node.get("available"),
                    "routing_role": _ROUTING_ROLE.get(role_code) if role_code is not None else None,
                    "rloc16_source": source,
                    "ext_address": ext_address,
                },
            )
        )
        if ext_address:
            state["ext"][ext_address] = node_entry.key

        if node.get("available") is False:
            # An offline node's tables are whatever the server cached when it
            # was last reachable; drawing them would show links that are gone.
            continue
        state["deferred"].append((key, role_code, attributes))

    # A network known only from its border routers (no HA node on it) still
    # gets a snapshot, so the AI can see that it exists.
    for br in border_routers or []:
        if br.get("network_name"):
            per_network.setdefault(
                br["network_name"],
                {"nodes": NodeIndex(), "links": [], "attrs": {}, "ext": {}, "deferred": []},
            )

    snapshots: list[LinkSnapshot] = []
    for network, state in per_network.items():
        index: NodeIndex = state["nodes"]
        links: list[Link] = []
        int_ext: dict[str, int] = {}  # node key -> extended address as (lossy) int

        for key, role_code, attributes in state["deferred"]:
            for row in attributes.get(ATTR_NEIGHBOR_TABLE) or []:
                rloc16 = _int(_field(row, 2))
                if rloc16 is None:
                    continue
                target = rloc16_key(rloc16)
                if target == key:
                    continue
                is_child = _field(row, 13)
                ext = _hex_address(_field(row, 0))
                neighbor = index.add(
                    LinkNode(
                        key=target,
                        role=_inferred_role(rloc16, bool(is_child)),
                        attrs={"ext_address": ext} if ext else {},
                    )
                )
                if neighbor.device_id is None and (ext_int := _int(_field(row, 0))) is not None:
                    int_ext.setdefault(target, ext_int)
                if is_child:
                    relationship = "child"
                elif role_code in _END_DEVICE_ROLES:
                    relationship = "parent"
                else:
                    relationship = "sibling"
                links.append(
                    Link(
                        source=key,
                        target=target,
                        kind="neighbor",
                        metrics=LinkMetrics(
                            thread_lqi=_int(_field(row, 5)),
                            rssi_dbm=_int(_field(row, 6)),
                            last_rssi_dbm=_int(_field(row, 7)),
                            frame_error_rate=_field(row, 8),
                            message_error_rate=_field(row, 9),
                        ),
                        attrs={
                            "relationship": relationship,
                            "rx_on_when_idle": _field(row, 10),
                            "full_thread_device": _field(row, 11),
                            "age_s": _int(_field(row, 1)),
                        },
                    )
                )

            for row in attributes.get(ATTR_ROUTE_TABLE) or []:
                if _field(row, 8) is False:
                    continue  # router id not allocated: an empty slot
                dest = _int(_field(row, 1))
                if dest is None:
                    continue
                target = rloc16_key(dest)
                if target == key:
                    continue
                index.add(LinkNode(key=target, role="router"))
                next_hop = _int(_field(row, 3))
                linked = _field(row, 9)
                links.append(
                    Link(
                        source=key,
                        target=target,
                        kind="route",
                        metrics=LinkMetrics(
                            path_cost=_int(_field(row, 4)),
                            # LQIIn: how well this node hears the destination
                            # router directly (0 when there is no direct link).
                            thread_lqi=_int(_field(row, 5)),
                        ),
                        attrs={
                            # No next hop but a direct link: the
                            # destination is the hop, as in the ZHA rows.
                            "next_hop": (
                                rloc16_key(next_hop << 10)
                                if next_hop is not None and next_hop < _NO_NEXT_HOP
                                else target
                                if linked
                                else None
                            ),
                            "lqi_out": _int(_field(row, 6)),
                            "link_established": linked,
                        },
                    )
                )

        attrs = state["attrs"]
        leader = attrs.get("leader")
        if leader and (leader_node := index.get(leader)) is not None:
            leader_node.attrs["is_leader"] = True
            if leader_node.device_id is None and leader_node.role in ("router", "unknown"):
                leader_node.role = "leader"

        routers_here = [
            br for br in border_routers or [] if br.get("network_name") == network
        ]
        listed = []
        for br in routers_here:
            ext = (br.get("extended_address") or "").lower()
            key = state["ext"].get(ext) or _match_lossy_ext(ext, int_ext)
            if key is None:
                # Heard by no HA node (or only under a rounded address):
                # list it so the network's border routers are complete.
                key = f"ext:{ext}" if ext else f"br:{br.get('name')}"
                index.add(LinkNode(key=key, role="border_router"))
            node = index.get(key)
            if node is not None:
                node.role = "border_router"
                node.name = node.name or br.get("name")
                node.attrs.setdefault("ext_address", ext or None)
                node.attrs["vendor"] = br.get("vendor")
                node.attrs["model"] = br.get("model")
            listed.append(key)
        if listed:
            attrs["border_routers"] = listed

        snapshots.append(
            LinkSnapshot(
                layer="thread",
                network=network,
                provider=PROVIDER,
                captured_at=captured_at,
                nodes=index.values(),
                links=links,
                attrs=attrs,
            )
        )
    return snapshots


def _match_lossy_ext(ext_hex: str, int_ext: dict[str, int]) -> str | None:
    """The one node whose rounded integer extended address is within float
    error of `ext_hex`, or None when there is no unambiguous match."""
    if not ext_hex:
        return None
    try:
        exact = int(ext_hex, 16)
    except ValueError:
        return None
    matches = [key for key, value in int_ext.items() if abs(value - exact) <= _EXT_ADDRESS_TOLERANCE]
    return matches[0] if len(matches) == 1 else None


def _matter_device_ids(hass: HomeAssistant, compressed_fabric_id: int | None) -> dict[int, tuple[str, str | None]]:
    """Matter node id -> (HA device id, display name), via the identifier the
    Matter integration gives each node's device:
    ("matter", "deviceid_<FABRIC:016X>-<NODE:016X>-MatterNodeDevice")."""
    from homeassistant.helpers import device_registry as dr

    if compressed_fabric_id is None:
        return {}
    prefix = f"deviceid_{compressed_fabric_id:016X}-"
    out: dict[int, tuple[str, str | None]] = {}
    for device in all_devices(dr.async_get(hass)):
        for identifier in device.identifiers:
            if len(identifier) != 2 or identifier[0] != "matter":
                continue
            value = str(identifier[1])
            if not value.startswith(prefix) or not value.endswith("-MatterNodeDevice"):
                continue
            try:
                node_id = int(value[len(prefix) : -len("-MatterNodeDevice")], 16)
            except ValueError:
                continue
            out[node_id] = (device.id, device.name_by_user or device.name)
    return out


def _matter_nodes(hass: HomeAssistant) -> list[dict[str, Any]] | None:
    """Plain dicts for every Matter node, or None when Matter isn't loaded."""
    if "matter" not in hass.config.components:
        return None
    try:
        from homeassistant.components.matter.helpers import get_matter
    except ImportError:
        return None
    try:
        adapter = get_matter(hass)
    except (IndexError, KeyError, AttributeError):
        return None  # no loaded Matter entry
    client = getattr(adapter, "matter_client", None)
    if client is None:
        return None
    server_info = getattr(client, "server_info", None)
    device_ids = _matter_device_ids(hass, getattr(server_info, "compressed_fabric_id", None))
    out = []
    for node in client.get_nodes():
        node_id = getattr(node, "node_id", None)
        attributes = getattr(getattr(node, "node_data", None), "attributes", None)
        if node_id is None or not isinstance(attributes, dict):
            continue
        device_id, name = device_ids.get(node_id, (None, None))
        out.append(
            {
                "node_id": node_id,
                "available": getattr(node, "available", None),
                "device_id": device_id,
                "name": name,
                "attributes": attributes,
            }
        )
    return out


async def _border_routers(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Border routers the thread integration has seen on mDNS (_meshcop).

    Best-effort: the thread integration, zeroconf and their internals may be
    missing or changed, which just means no border-router names.
    """
    if "thread" not in hass.config.components:
        return []
    try:
        from homeassistant.components import zeroconf
        from homeassistant.components.thread.discovery import async_read_zeroconf_cache

        aiozc = await zeroconf.async_get_async_instance(hass)
        records = async_read_zeroconf_cache(aiozc)
    except Exception:  # noqa: BLE001 - optional enrichment only
        _LOGGER.debug("Could not read Thread border routers", exc_info=True)
        return []
    return [
        {
            "extended_address": getattr(record, "extended_address", None),
            "network_name": getattr(record, "network_name", None),
            "name": getattr(record, "server", None) or getattr(record, "instance_name", None),
            "vendor": getattr(record, "vendor_name", None),
            "model": getattr(record, "model_name", None),
        }
        for record in records
    ]


async def async_get_snapshots(
    hass: HomeAssistant, *, periodic: bool = False
) -> list[LinkSnapshot]:
    """One snapshot per Thread network, or none when Matter isn't loaded."""
    nodes = _matter_nodes(hass)
    if not nodes:
        return []
    return build_snapshots(nodes, await _border_routers(hass))
