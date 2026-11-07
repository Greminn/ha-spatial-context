"""Tests for the radio-link providers and the link store (links/).

Synthetic cases pin down each conversion rule; the sample-home cases (skipped
until tests/fixtures/home/ exists) check the same rules on real, anonymized
data.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import base64
import unittest
from types import SimpleNamespace
from unittest import mock

import links_harness


def _zha_info(nwk, ieee, device_type, neighbors=(), routes=()):
    return {
        "nwk": nwk,
        "ieee": ieee,
        "device_type": device_type,
        "device_reg_id": f"dev-{ieee}",
        "name": f"name-{ieee}",
        "user_given_name": None,
        "power_source": "Mains" if device_type != "EndDevice" else "Battery or Unknown",
        "available": True,
        "lqi": 200,
        "rssi": -50,
        "neighbors": list(neighbors),
        "routes": list(routes),
    }


def _nb(ieee, nwk, lqi, relationship, device_type="Router", rx_on="On"):
    return {
        "ieee": ieee,
        "nwk": nwk,
        "lqi": str(lqi),
        "relationship": relationship,
        "device_type": device_type,
        "rx_on_when_idle": rx_on,
        "depth": "15",
    }


def _route(dest, next_hop, status="Active"):
    return {
        "dest_nwk": dest,
        "next_hop": next_hop,
        "route_status": status,
        "many_to_one": False,
        "memory_constrained": False,
        "route_record_required": False,
    }


class ZhaProviderTest(unittest.TestCase):
    def setUp(self) -> None:
        self.m = links_harness.load()

    def test_nodes_neighbors_and_routes(self) -> None:
        infos = [
            _zha_info("0x0000", "c", "Coordinator", [_nb("r", "0x4EF3", 200, "Child")]),
            _zha_info(
                "0x4ef3",
                "r",
                "Router",
                [
                    _nb("c", "0x0000", 180, "Parent", "Coordinator"),
                    _nb("e", "0x1234", 90, "Child", "EndDevice", "Off"),
                    _nb("gone", "0x7777", 50, "PreviousChild", "EndDevice"),
                    _nb("x", "0x2222", 1, "Sibling"),
                ],
                [_route("0x0000", "0x0000"), _route("0x9999", "0x0000", "Discovery_Underway")],
            ),
            _zha_info("0x1234", "e", "EndDevice", [_nb("r", "0x4EF3", 70, "Parent")]),
        ]
        snap = self.m.zha.build_snapshot(infos, "2026-11-06T00:00:00+00:00")
        nodes = {n.key: n for n in snap.nodes}
        self.assertEqual(snap.layer, "zigbee")
        self.assertEqual(nodes["0x4EF3"].role, "router")
        self.assertEqual(nodes["0x0000"].role, "coordinator")
        self.assertEqual(nodes["0x4EF3"].device_id, "dev-r")
        # A neighbour no device reports for is a node without an HA device.
        self.assertIsNone(nodes["0x2222"].device_id)
        # rx_on_when_idle is only known from neighbour rows.
        self.assertIs(nodes["0x1234"].attrs["rx_on_when_idle"], False)
        # PreviousChild is history, not a link.
        self.assertNotIn("0x7777", nodes)
        neighbors = [l for l in snap.links if l.kind == "neighbor"]
        self.assertEqual(len(neighbors), 5)
        self.assertFalse(any(l.target == "0x7777" for l in snap.links))
        routes = [l for l in snap.links if l.kind == "route"]
        self.assertEqual(len(routes), 1)  # Discovery_Underway is dropped
        self.assertEqual((routes[0].source, routes[0].target), ("0x4EF3", "0x0000"))
        self.assertEqual(routes[0].attrs["next_hop"], "0x0000")
        by_pair = {(l.source, l.target): l for l in neighbors}
        r_c = by_pair[("0x4EF3", "0x0000")]
        self.assertEqual(r_c.metrics.lqi, 180)
        self.assertEqual(r_c.attrs["relationship"], "parent")
        self.assertIsNotNone(r_c.metrics.lqi_norm)
        # A stale 0/1 reading keeps its raw LQI but gets no normalised value.
        stale = by_pair[("0x4EF3", "0x2222")]
        self.assertEqual(stale.metrics.lqi, 1)
        self.assertIsNone(stale.metrics.lqi_norm)

    def test_neighbor_ieee_wins_over_a_stale_nwk(self) -> None:
        infos = [
            _zha_info("0x0001", "a", "Router", [_nb("b", "0x0BAD", 120, "Sibling")]),
            _zha_info("0x0002", "b", "Router"),
        ]
        snap = self.m.zha.build_snapshot(infos)
        (link,) = snap.links
        self.assertEqual(link.target, "0x0002")

    def test_reciprocity_normalises_a_saturating_reporter(self) -> None:
        # "hot" reads every neighbour ~2x higher than they read it.
        infos = [
            _zha_info("0x0001", "hot", "Router", [_nb(x, n, 240, "Sibling") for x, n in (("a", "0x0002"), ("b", "0x0003"))]),
            _zha_info("0x0002", "a", "Router", [_nb("hot", "0x0001", 120, "Sibling"), _nb("b", "0x0003", 120, "Sibling")]),
            _zha_info("0x0003", "b", "Router", [_nb("hot", "0x0001", 120, "Sibling"), _nb("a", "0x0002", 120, "Sibling")]),
        ]
        snap = self.m.zha.build_snapshot(infos)
        by_pair = {(l.source, l.target): l for l in snap.links}
        self.assertLess(by_pair[("0x0001", "0x0002")].metrics.lqi_norm, 240)
        self.assertGreater(by_pair[("0x0002", "0x0001")].metrics.lqi_norm, 120)

    def test_no_zha_means_no_snapshot(self) -> None:
        hass = SimpleNamespace(config=SimpleNamespace(components=set()))
        self.assertEqual(asyncio.run(self.m.zha.async_get_snapshots(hass)), [])


def _b64(raw: bytes) -> str:
    return base64.b64encode(raw).decode()


def _rloc_ipv6(prefix: bytes, rloc16: int) -> str:
    return _b64(prefix + b"\x00\x00\x00\xff\xfe\x00" + rloc16.to_bytes(2, "big"))


_PREFIX = bytes.fromhex("fd00000000000001")


def _thread_node(node_id, network, role, rloc16=None, neighbors=(), routes=(), ext=None, **extra):
    addresses = [_b64(_PREFIX + bytes.fromhex("1122334455667788"))]
    if rloc16 is not None:
        addresses.append(_rloc_ipv6(_PREFIX, rloc16))
        # An ALOC (leader anycast) must never be taken for the node's RLOC16.
        addresses.insert(0, _rloc_ipv6(_PREFIX, 0xFC00))
    attributes = {
        "0/53/0": 15,
        "0/53/1": role,
        "0/53/2": network,
        "0/53/7": list(neighbors),
        "0/53/8": list(routes),
        "0/53/13": 4,
        "0/51/0": [
            {
                "0": network,
                "4": _b64(ext or (node_id).to_bytes(8, "big")),
                "6": addresses,
                "7": 4,
            }
        ],
    }
    attributes.update(extra)
    return {
        "node_id": node_id,
        "available": True,
        "device_id": f"dev-{node_id}",
        "name": f"node {node_id}",
        "attributes": attributes,
    }


def _tnb(rloc16, lqi=3, rssi=-60, is_child=False, ext=13723138673905482000):
    return {
        "0": ext, "1": 10, "2": rloc16, "3": 1, "4": 1, "5": lqi, "6": rssi, "7": rssi - 1,
        "8": 0, "9": 0, "10": True, "11": True, "12": False, "13": is_child,
    }


def _troute(rloc16, next_hop, cost, allocated=True):
    return {"0": 1, "1": rloc16, "2": rloc16 >> 10, "3": next_hop, "4": cost, "5": 3, "6": 3, "7": 1, "8": allocated, "9": True}


class ThreadProviderTest(unittest.TestCase):
    def setUp(self) -> None:
        self.m = links_harness.load()

    def test_own_rloc16_sources(self) -> None:
        thread = self.m.thread
        node = _thread_node(1, "net", 5, rloc16=0x1000)
        self.assertEqual(thread.own_rloc16(node["attributes"]), (0x1000, "ipv6"))
        direct = _thread_node(2, "net", 5, rloc16=0x1000, **{"0/53/67": 0x2400})
        self.assertEqual(thread.own_rloc16(direct["attributes"]), (0x2400, "attribute"))
        by_route = _thread_node(3, "net", 5, routes=[_troute(0x2400, 9, 1), _troute(0x5800, 63, 0)])
        self.assertEqual(thread.own_rloc16(by_route["attributes"]), (0x5800, "route_table"))
        self.assertEqual(thread.own_rloc16(_thread_node(4, "net", 3)["attributes"]), (None, None))

    def test_two_networks_and_unknown_neighbors(self) -> None:
        nodes = [
            _thread_node(
                1, "ha-net", 5, rloc16=0x1000,
                neighbors=[_tnb(0x10A0, is_child=True), _tnb(0x2400, lqi=2, rssi=-80)],
                routes=[_troute(0x1000, 63, 0), _troute(0x2400, 9, 1), _troute(0x3000, 9, 2), _troute(0x4000, 0, 0, allocated=False)],
            ),
            _thread_node(2, "ha-net", 3, rloc16=0x10A0, neighbors=[_tnb(0x1000)]),
            _thread_node(3, "apple-net", 5, rloc16=0x5800, neighbors=[_tnb(0x6000)]),
            {"node_id": 4, "available": True, "attributes": {"0/40/1": "wifi plug"}},
        ]
        snaps = {s.network: s for s in self.m.thread.build_snapshots(nodes, [], "t")}
        self.assertEqual(set(snaps), {"ha-net", "apple-net"})
        ha = snaps["ha-net"]
        nodes_by_key = {n.key: n for n in ha.nodes}
        self.assertEqual(nodes_by_key["0x1000"].device_id, "dev-1")
        self.assertEqual(nodes_by_key["0x10A0"].device_id, "dev-2")
        self.assertEqual(nodes_by_key["0x10A0"].role, "end_device")
        # A router HA never commissioned: keyed by RLOC16, no device.
        self.assertIsNone(nodes_by_key["0x2400"].device_id)
        self.assertEqual(nodes_by_key["0x2400"].role, "router")
        self.assertEqual(ha.attrs["channel"], 15)
        self.assertEqual(ha.attrs["leader"], "0x1000")
        neighbors = {(l.source, l.target): l for l in ha.links if l.kind == "neighbor"}
        self.assertEqual(neighbors[("0x1000", "0x10A0")].attrs["relationship"], "child")
        self.assertEqual(neighbors[("0x10A0", "0x1000")].attrs["relationship"], "parent")
        weak = neighbors[("0x1000", "0x2400")]
        self.assertEqual((weak.metrics.thread_lqi, weak.metrics.rssi_dbm), (2, -80))
        # The rounded 64-bit extended address is never kept as an address.
        self.assertNotIn("ext_address", nodes_by_key["0x2400"].attrs)
        routes = [l for l in ha.links if l.kind == "route"]
        self.assertEqual({l.target for l in routes}, {"0x2400", "0x3000"})
        via = next(l for l in routes if l.target == "0x3000")
        self.assertEqual((via.attrs["next_hop"], via.metrics.path_cost), ("0x2400", 2))

    def test_border_router_matched_by_rounded_ext_address(self) -> None:
        exact = 0xBE6559E46D6F2F2F
        rounded = int(float(exact))  # what a JS number would deliver
        nodes = [_thread_node(1, "net", 5, rloc16=0x1000, neighbors=[_tnb(0x2400, ext=rounded)])]
        brs = [
            {"extended_address": f"{exact:016x}", "network_name": "net", "name": "otbr.local.", "vendor": "HA", "model": "OTBR"},
            {"extended_address": "0102030405060708", "network_name": "net", "name": "other.local.", "vendor": "Apple", "model": "BR"},
            {"extended_address": "0a0b0c0d0e0f0001", "network_name": "elsewhere", "name": "x", "vendor": None, "model": None},
        ]
        snaps = {s.network: s for s in self.m.thread.build_snapshots(nodes, brs, "t")}
        # A network known only from its border router still shows up.
        self.assertEqual([n.role for n in snaps["elsewhere"].nodes], ["border_router"])
        snap = snaps["net"]
        by_key = {n.key: n for n in snap.nodes}
        self.assertEqual(by_key["0x2400"].role, "border_router")
        self.assertEqual(by_key["0x2400"].name, "otbr.local.")
        self.assertIn("ext:0102030405060708", by_key)
        self.assertEqual(snap.attrs["border_routers"], ["0x2400", "ext:0102030405060708"])

    def test_offline_node_contributes_no_links(self) -> None:
        node = _thread_node(1, "net", 5, rloc16=0x1000, neighbors=[_tnb(0x2400)])
        node["available"] = False
        (snap,) = self.m.thread.build_snapshots([node], [], "t")
        self.assertEqual(snap.links, [])
        self.assertEqual([n.key for n in snap.nodes], ["0x1000"])


class UnifiProviderTest(unittest.TestCase):
    def setUp(self) -> None:
        self.m = links_harness.load()

    def test_signal_fills_rssi_even_when_tracker_saw_it_first(self) -> None:
        clients = [
            # device_tracker attributes: the association, but no signal.
            {"mac": "AA-BB-CC-00-00-01", "ap_mac": "aa:bb:cc:00:00:aa", "name": "plug"},
            # aiounifi: the same association with signal (dBm) and rssi (SNR).
            {"mac": "aa:bb:cc:00:00:01", "ap_mac": "AABBCC0000AA", "signal": -66, "rssi": 24, "essid": "iot"},
            {"mac": "aa:bb:cc:00:00:02", "ap_mac": "aa:bb:cc:00:00:aa", "signal": 0},
            {"mac": "aa:bb:cc:00:00:03", "ap_mac": None, "is_wired": True},
        ]
        aps = [{"mac": "aa:bb:cc:00:00:aa", "name": "AP Hall", "model": "U7"}]
        devices = {
            "aa:bb:cc:00:00:01": ("esphome-dev", ["unifi-dev", "esphome-dev"]),
            "aa:bb:cc:00:00:aa": ("ap-dev", ["ap-dev"]),
        }
        snap = self.m.unifi.build_snapshot(clients, aps, devices, "t")
        links = {l.source: l for l in snap.links}
        self.assertEqual(len(snap.links), 2)
        plug = links["aa:bb:cc:00:00:01"]
        self.assertEqual(plug.kind, "association")
        self.assertEqual(plug.target, "aa:bb:cc:00:00:aa")
        self.assertEqual(plug.metrics.rssi_dbm, -66.0)
        self.assertEqual(plug.attrs["snr_db"], 24)
        # 0 is a placeholder, not a measured signal.
        self.assertIsNone(links["aa:bb:cc:00:00:02"].metrics.rssi_dbm)
        nodes = {n.key: n for n in snap.nodes}
        self.assertEqual(nodes["aa:bb:cc:00:00:aa"].role, "access_point")
        self.assertEqual(nodes["aa:bb:cc:00:00:01"].device_id, "esphome-dev")
        self.assertEqual(nodes["aa:bb:cc:00:00:01"].attrs["device_ids"], ["unifi-dev", "esphome-dev"])
        self.assertNotIn("aa:bb:cc:00:00:03", nodes)

    def test_nothing_to_show(self) -> None:
        self.assertIsNone(self.m.unifi.build_snapshot([], []))


class Z2mProviderTest(unittest.TestCase):
    def setUp(self) -> None:
        self.m = links_harness.load()

    def test_cached_map_becomes_snapshot(self) -> None:
        mesh = {
            "nodes": [
                {"ieee": "0xa", "friendly_name": "Coord", "device_id": "d-a", "type": "Coordinator", "nwk": 0},
                {"ieee": "0xb", "friendly_name": "Plug", "device_id": "d-b", "type": "Router", "nwk": 20211},
            ],
            "links": [
                {"source_ieee": "0xb", "target_ieee": "0xa", "lqi": 90, "lqi_readings": [150, 90], "parent_child": False},
                {"source_ieee": "0xb", "target_ieee": "0xc", "lqi": 0, "lqi_readings": [], "parent_child": True},
            ],
            "fetched_at": 0,
        }
        snap = self.m.z2m.build_snapshot(mesh)
        self.assertEqual(snap.captured_at, "1970-01-01T00:00:00+00:00")
        keys = {n.key for n in snap.nodes}
        self.assertEqual(keys, {"0x0000", "0x4EF3", "0xc"})
        first, second = snap.links
        self.assertEqual((first.source, first.target), ("0x4EF3", "0x0000"))
        self.assertEqual((first.metrics.lqi, first.metrics.lqi_norm), (150, 90.0))
        self.assertIsNone(second.metrics.lqi_norm)
        self.assertEqual(second.attrs["relationship"], "parent_child")

    def test_periodic_run_never_scans(self) -> None:
        zigbee_mesh = self.m.zigbee_mesh
        hass = SimpleNamespace(config=SimpleNamespace(components={"mqtt"}))
        with (
            mock.patch.object(zigbee_mesh, "_build_ieee_to_device_id_map", return_value={"0xa": "d"}),
            mock.patch.object(zigbee_mesh, "get_cached_network_map", return_value=None) as cached,
            mock.patch.object(zigbee_mesh, "async_get_network_map") as scan,
        ):
            self.assertEqual(asyncio.run(self.m.z2m.async_get_snapshots(hass, periodic=True)), [])
        cached.assert_called_once()
        scan.assert_not_called()

    def test_mqtt_without_z2m_devices_never_asks(self) -> None:
        zigbee_mesh = self.m.zigbee_mesh
        hass = SimpleNamespace(config=SimpleNamespace(components={"mqtt"}))
        with (
            mock.patch.object(zigbee_mesh, "_build_ieee_to_device_id_map", return_value={}),
            mock.patch.object(zigbee_mesh, "async_get_network_map") as scan,
        ):
            self.assertEqual(asyncio.run(self.m.z2m.async_get_snapshots(hass)), [])
        scan.assert_not_called()


class LinkStoreTest(unittest.TestCase):
    def setUp(self) -> None:
        self.m = links_harness.load()
        links_harness.FakeStore.files.clear()
        self.hass = SimpleNamespace(data={})

    def _provider(self, name, layer, fetch):
        return self.m.store.Provider(name, layer, fetch)

    def _snapshot(self, provider="p", network="n", layer="zigbee"):
        model = self.m.model
        return model.LinkSnapshot(
            layer=layer,
            network=network,
            provider=provider,
            captured_at="2026-11-06T00:00:00+00:00",
            nodes=[model.LinkNode(key="0x0001", role="router", device_id="d1", attrs={"ieee": "x"})],
            links=[
                model.Link(
                    source="0x0001",
                    target="0x0002",
                    kind="neighbor",
                    metrics=model.LinkMetrics(lqi=120, lqi_norm=101.5),
                    attrs={"relationship": "sibling"},
                )
            ],
            attrs={"channel": 20},
        )

    def test_round_trip_through_the_store(self) -> None:
        snapshot = self._snapshot()

        async def fetch(hass, *, periodic=False):
            return [snapshot]

        async def run():
            store = self.m.store.LinkStore(self.hass, [self._provider("p", "zigbee", fetch)])
            await store.async_refresh()
            reloaded = self.m.store.LinkStore(self.hass, [])
            await reloaded.async_load()
            return reloaded

        reloaded = asyncio.run(run())
        (back,) = reloaded.snapshots()
        self.assertEqual(back, snapshot)
        self.assertIsNotNone(reloaded.last_refresh)
        # Unset metrics are not written, and come back as None.
        saved = links_harness.FakeStore.files["spatial_context.links"]
        self.assertEqual(saved["snapshots"][0]["links"][0]["metrics"], {"lqi": 120, "lqi_norm": 101.5})

    def test_a_failing_provider_keeps_its_last_data_and_spares_the_others(self) -> None:
        good = self._snapshot("good", "g", "wifi")
        old = self._snapshot("flaky", "f", "zigbee")
        calls = {"n": 0}

        async def flaky(hass, *, periodic=False):
            calls["n"] += 1
            if calls["n"] > 1:
                raise RuntimeError("ieee 00:11:22 vanished")
            return [old]

        async def fine(hass, *, periodic=False):
            return [good]

        async def broken(hass, *, periodic=False):
            raise KeyError("nwk")

        async def run():
            store = self.m.store.LinkStore(
                self.hass,
                [
                    self._provider("flaky", "zigbee", flaky),
                    self._provider("good", "wifi", fine),
                    self._provider("broken", "thread", broken),
                ],
            )
            await store.async_refresh()
            await store.async_refresh()
            return store

        with self.assertLogs(level="WARNING"):
            store = asyncio.run(run())
        by_provider = {s.provider: s for s in store.snapshots()}
        self.assertEqual(by_provider["good"].errors, [])
        self.assertEqual(len(by_provider["flaky"].links), 1)
        self.assertIn("RuntimeError", by_provider["flaky"].errors[0])
        # The exception text (which can carry addresses) stays in the log.
        self.assertNotIn("00:11:22", by_provider["flaky"].errors[0])
        self.assertEqual(by_provider["broken"].layer, "thread")
        self.assertIn("KeyError", by_provider["broken"].errors[0])

    def test_layer_filter_and_vanished_networks(self) -> None:
        answers = [[self._snapshot("t", "a", "thread"), self._snapshot("t", "b", "thread")], [self._snapshot("t", "a", "thread")]]
        zigbee_calls = []

        async def thread_fetch(hass, *, periodic=False):
            return answers.pop(0)

        async def zigbee_fetch(hass, *, periodic=False):
            zigbee_calls.append(periodic)
            return []

        async def run():
            store = self.m.store.LinkStore(
                self.hass,
                [self._provider("t", "thread", thread_fetch), self._provider("z", "zigbee", zigbee_fetch)],
            )
            first = await store.async_refresh(["thread"])
            second = await store.async_refresh(["thread"])
            return first, second, store

        first, second, store = asyncio.run(run())
        self.assertEqual([s.network for s in first], ["a", "b"])
        self.assertEqual([s.network for s in second], ["a"])
        self.assertEqual(zigbee_calls, [])
        self.assertEqual(store.snapshots(network="b"), [])

    def test_module_level_read_path(self) -> None:
        async def fetch(hass, *, periodic=False):
            return [self._snapshot()]

        async def run():
            before = await self.m.store.async_get_snapshots(self.hass)
            store = await self.m.store.async_setup_link_store(self.hass)
            store.providers = (self._provider("p", "zigbee", fetch),)
            await self.m.store.async_refresh(self.hass)
            return before, await self.m.store.async_get_snapshots(self.hass, layer="zigbee"), await self.m.store.async_get_snapshots(self.hass, layer="wifi")

        before, zigbee, wifi = asyncio.run(run())
        self.assertEqual(before, [])
        self.assertEqual(len(zigbee), 1)
        self.assertEqual(wifi, [])

    def test_schedule_starts_after_ha_and_stops_cleanly(self) -> None:
        store_mod = self.m.store
        stop_delay, stop_interval, stop_started = mock.Mock(), mock.Mock(), mock.Mock()
        started = []
        with (
            mock.patch.object(store_mod, "async_at_started", side_effect=lambda hass, cb: started.append(cb) or stop_started),
            mock.patch.object(store_mod, "async_call_later", return_value=stop_delay) as later,
            mock.patch.object(store_mod, "async_track_time_interval", return_value=stop_interval) as interval,
        ):
            stop = store_mod.async_start_link_refresh(self.hass)
            later.assert_not_called()  # nothing before HA has started
            started[0](self.hass)
            self.assertEqual(later.call_args.args[1], store_mod.STARTUP_DELAY)
            self.assertEqual(interval.call_args.args[2], store_mod.REFRESH_INTERVAL)
            stop()
        stop_delay.assert_called_once()
        stop_interval.assert_called_once()
        stop_started.assert_called_once()

    def test_default_providers(self) -> None:
        names = {(p.name, p.layer) for p in self.m.store.PROVIDERS}
        self.assertEqual(
            names,
            {("zha", "zigbee"), ("z2m", "zigbee"), ("matter_thread", "thread"), ("unifi", "wifi")},
        )


try:
    import voluptuous as vol
except ModuleNotFoundError:  # pragma: no cover - CI installs it
    vol = None


@unittest.skipIf(vol is None, "voluptuous is not installed")
class SurfaceTest(unittest.TestCase):
    """The websocket command and the service, on the real modules."""

    def setUp(self) -> None:
        import importlib
        import stubs

        self.m = links_harness.load()
        links_harness.FakeStore.files.clear()
        pkg = links_harness.PACKAGE

        def websocket_command(schema):
            def decorate(func):
                func.schema = vol.Schema(schema)
                return func

            return decorate

        ws = stubs.stub(
            "homeassistant.components.websocket_api",
            websocket_command=websocket_command,
            async_response=lambda f: f,
            require_admin=lambda f: f,
            ActiveConnection=object,
        )
        sys_components = __import__("sys").modules["homeassistant.components"]
        sys_components.websocket_api = ws
        for sibling in ("bluetooth_mesh", "debug", "registry_snapshot", "wifi_mesh"):
            stubs.stub(f"{pkg}.{sibling}")
        stubs.stub(f"{pkg}.export", async_get_map_data=None)
        storage = __import__("sys").modules[f"{pkg}.storage"]
        for name in (
            "async_get_floor_layout",
            "async_get_property_layout",
            "async_save_floor_layout",
            "async_save_property_layout",
            "async_save_settings",
            "async_set_floor_building_id",
        ):
            setattr(storage, name, None)
        self.registered = {}
        stubs.stub(
            "homeassistant.helpers.service",
            async_register_admin_service=lambda hass, domain, name, func, schema=None, **kw: self.registered.__setitem__(
                name, (func, schema, kw)
            ),
        )
        stubs.stub("homeassistant.helpers.config_validation", ensure_list=lambda v: v if isinstance(v, list) else [v])
        core = __import__("sys").modules["homeassistant.core"]
        core.ServiceCall = object
        core.SupportsResponse = SimpleNamespace(ONLY="only", OPTIONAL="optional", NONE="none")
        self.ws = importlib.import_module(f"{pkg}.websocket_api")
        self.services = importlib.import_module(f"{pkg}.services")
        self.hass = SimpleNamespace(data={}, services=SimpleNamespace(async_register=mock.Mock()))

    def _with_provider(self):
        model = self.m.model
        snapshot = model.LinkSnapshot(
            layer="thread", network="net", provider="p", captured_at="t",
            nodes=[model.LinkNode(key="0x1000")],
            links=[model.Link(source="0x1000", target="0x2400", metrics=model.LinkMetrics(rssi_dbm=-70))],
        )
        calls = []

        async def fetch(hass, *, periodic=False):
            calls.append(periodic)
            return [snapshot]

        async def setup():
            store = await self.m.store.async_setup_link_store(self.hass)
            store.providers = (self.m.store.Provider("p", "thread", fetch),)

        asyncio.run(setup())
        return calls

    def test_get_links_serves_the_store_and_refreshes_on_request(self) -> None:
        calls = self._with_provider()
        conn = mock.Mock()
        schema = self.ws.ws_get_links.schema
        msg = schema({"type": "spatial_context/get_links"})
        asyncio.run(self.ws.ws_get_links(self.hass, conn, {**msg, "id": 1}))
        self.assertEqual(conn.send_result.call_args.args[1]["snapshots"], [])
        msg = schema({"type": "spatial_context/get_links", "layer": "thread", "refresh": True})
        asyncio.run(self.ws.ws_get_links(self.hass, conn, {**msg, "id": 2}))
        result = conn.send_result.call_args.args[1]
        (snap,) = result["snapshots"]
        self.assertEqual(snap["links"][0]["metrics"], {"rssi_dbm": -70})
        self.assertIsNotNone(result["last_refresh"])
        self.assertEqual(calls, [False])  # on demand, not the periodic mode
        with self.assertRaises(vol.Invalid):
            schema({"type": "spatial_context/get_links", "layer": "lora"})

    def test_refresh_links_is_an_admin_service(self) -> None:
        calls = self._with_provider()
        asyncio.run(self.services.async_setup_services(self.hass))
        func, schema, kw = self.registered["refresh_links"]
        self.assertEqual(kw["supports_response"], "optional")
        data = schema({"layers": "thread"})
        self.assertEqual(data, {"layers": ["thread"]})
        with self.assertRaises(vol.Invalid):
            schema({"layers": ["lora"]})
        result = asyncio.run(func(SimpleNamespace(data=data)))
        self.assertEqual(result["snapshots"][0]["links"], 1)
        self.assertEqual(calls, [False])
        # The existing services keep their own registration.
        registered = {c.args[1] for c in self.hass.services.async_register.call_args_list}
        self.assertEqual(registered, {"get_map", "refresh_zigbee_mesh"})
        self.assertNotIn("get_map", self.registered)


_ZHA = links_harness.fixture("zha_devices.json")
_THREAD = links_harness.fixture("matter_thread.json")
_WIFI = links_harness.fixture("unifi_wifi.json")


@unittest.skipIf(_ZHA is None, "sample-home fixtures not captured")
class SampleHomeZhaTest(unittest.TestCase):
    """133 ZHA devices: 1 coordinator, 63 routers with tables (fixture README)."""

    def setUp(self) -> None:
        self.m = links_harness.load()
        self.infos = links_harness.zha_infos(_ZHA)

    def test_counts(self) -> None:
        snap = self.m.zha.build_snapshot(self.infos)
        roles = [n.role for n in snap.nodes if n.device_id]
        self.assertEqual(roles.count("router"), 63)
        self.assertEqual(roles.count("coordinator"), 1)
        self.assertEqual(roles.count("end_device"), 69)
        kinds = [l.kind for l in snap.links]
        # Every captured neighbour row (none is PreviousChild or a self row).
        self.assertEqual(kinds.count("neighbor"), 1619)
        # 447 route rows, of which 393 Active; Discovery_Underway is dropped.
        self.assertEqual(kinds.count("route"), 393)
        # Neighbour IEEEs are redacted in diagnostics, so NWK is the join key:
        # every router-to-router row resolves to a captured device.
        by_key = {n.key: n for n in snap.nodes}
        router_rows = [
            l for l in snap.links
            if l.kind == "neighbor" and by_key[l.target].role in ("router", "coordinator")
        ]
        self.assertTrue(router_rows)
        self.assertTrue(all(by_key[l.target].device_id for l in router_rows))
        normalised = [l.metrics.lqi_norm for l in snap.links if l.kind == "neighbor" and l.metrics.lqi_norm is not None]
        self.assertGreater(len(normalised), 1500)
        self.assertTrue(all(0 <= v <= 255 for v in normalised))

    def test_previous_child_is_dropped(self) -> None:
        router = next(i for i in self.infos if i.get("neighbors") and i["device_type"] == "Router")
        router["neighbors"] = router["neighbors"] + [
            {"device_type": "EndDevice", "relationship": "PreviousChild", "nwk": "0xFEED", "lqi": 120, "rx_on_when_idle": "Off"}
        ]
        snap = self.m.zha.build_snapshot(self.infos)
        self.assertEqual(sum(1 for l in snap.links if l.kind == "neighbor"), 1619)
        self.assertNotIn("0xFEED", {n.key for n in snap.nodes})


def _thread_inputs():
    return links_harness.thread_inputs(_THREAD)


@unittest.skipIf(_THREAD is None, "sample-home fixtures not captured")
class SampleHomeThreadTest(unittest.TestCase):
    def setUp(self) -> None:
        self.m = links_harness.load()

    def test_own_rloc16_matches_the_hand_derived_value(self) -> None:
        with_tables = [d for d in _THREAD["devices"] if d.get("own_rloc16") is not None]
        self.assertEqual(len(with_tables), 16)
        for device in with_tables:
            self.assertEqual(
                self.m.thread.own_rloc16(device["attributes"]),
                (device["own_rloc16"], "ipv6"),
                device["device_id"],
            )

    def test_networks_nodes_and_links(self) -> None:
        nodes, border_routers = _thread_inputs()
        snaps = {s.network: s for s in self.m.thread.build_snapshots(nodes, border_routers)}
        self.assertEqual(set(snaps), {"net-a", "net-b", "net-c"})
        # Two networks carry topology; net-c is known only from its border router.
        self.assertTrue(snaps["net-a"].links and snaps["net-b"].links)
        self.assertEqual([n.role for n in snaps["net-c"].nodes], ["border_router"])
        self.assertEqual(snaps["net-a"].attrs["channel"], 15)
        self.assertEqual(snaps["net-b"].attrs["channel"], 25)
        self.assertEqual(len(snaps["net-b"].attrs["border_routers"]), 2)

        neighbors = [l for s in snaps.values() for l in s.links if l.kind == "neighbor"]
        # 45 captured neighbour rows, minus the 10 of the three offline nodes.
        self.assertEqual(len(neighbors), 35)
        self.assertEqual(sum(1 for s in snaps.values() for l in s.links if l.kind == "route"), 50)
        # Thread neighbours carry measured dBm.
        self.assertTrue(all(l.metrics.rssi_dbm is not None and l.metrics.rssi_dbm < 0 for l in neighbors))
        # Neighbours HA has not commissioned become device-less nodes.
        net_a = {n.key: n for n in snaps["net-a"].nodes}
        resolved = [l for l in snaps["net-a"].links if l.kind == "neighbor" and net_a[l.target].device_id]
        self.assertEqual(len(resolved), 20)
        self.assertTrue(any(n.device_id is None and n.key.startswith("0x") for n in net_a.values()))
        # The example router from the captured data: 0x1000 with two children.
        children = {l.target for l in snaps["net-a"].links if l.source == "0x1000" and l.attrs.get("relationship") == "child"}
        self.assertEqual(children, {"0x10A0", "0x10A3"})
        # No node is keyed by a (lossy) 64-bit integer.
        self.assertTrue(all(n.key.startswith(("0x", "br:", "ext:", "node-")) and len(n.key) <= 32 for s in snaps.values() for n in s.nodes))


@unittest.skipIf(_WIFI is None, "sample-home fixtures not captured")
class SampleHomeWifiTest(unittest.TestCase):
    def test_every_client_has_its_ap_and_signal(self) -> None:
        m = links_harness.load()
        clients, aps, devices = links_harness.wifi_inputs(_WIFI, m.unifi.mac_key)
        snap = m.unifi.build_snapshot(clients, aps, devices)
        self.assertEqual(len(snap.links), 72)
        self.assertTrue(all(l.kind == "association" for l in snap.links))
        self.assertTrue(all(l.metrics.rssi_dbm is not None and l.metrics.rssi_dbm < 0 for l in snap.links))
        self.assertTrue(all(l.attrs["snr_db"] is not None and l.attrs["snr_db"] >= 0 for l in snap.links))
        roles = [n.role for n in snap.nodes]
        self.assertEqual(roles.count("access_point"), 5)
        self.assertEqual(roles.count("client"), 72)
        matched = sum(1 for n in snap.nodes if n.role == "client" and n.device_id)
        self.assertEqual(matched, sum(1 for c in _WIFI["clients"] if c.get("ha_device_id")))
        self.assertTrue(all(n.device_id for n in snap.nodes if n.role == "access_point"))


if __name__ == "__main__":
    unittest.main()



class UnifiDeviceForMacTest(unittest.TestCase):
    """A MAC that two integrations list maps to the non-UniFi device."""

    def test_prefers_the_device_another_integration_owns(self) -> None:
        import sys

        m = links_harness.load()
        mac = "02:00:00:00:00:aa"
        unifi_dev = SimpleNamespace(id="u1", config_entry_id="unifi-entry", connections={("mac", mac)})
        esp_dev = SimpleNamespace(id="e1", config_entry_id="esphome-entry", connections={("mac", mac)})
        registry = SimpleNamespace(devices=[unifi_dev, esp_dev])
        dr = sys.modules["homeassistant.helpers.device_registry"]
        with mock.patch.object(dr, "async_get", return_value=registry, create=True), mock.patch.object(
            dr, "CONNECTION_NETWORK_MAC", "mac", create=True
        ), mock.patch.object(m.unifi, "all_devices", side_effect=lambda reg: list(reg.devices)):
            result = m.unifi._device_for_mac(None, {"unifi-entry"})
        self.assertEqual(result[mac], ("e1", ["u1", "e1"]))
