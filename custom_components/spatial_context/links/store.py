"""The link store: the latest LinkSnapshot per (layer, network), persisted.

The panel and the AI tools read the last known topology from here instead
of asking a radio for it. Snapshots live in their own Store
(/config/.storage/spatial_context.links), apart from the user-edited layout:
this is machine-made, replaceable data, so it never touches the layout file
or its backups.

Refreshing runs every provider (ZHA, Zigbee2MQTT, Matter/Thread, UniFi).
Each provider's failure is caught on its own and recorded in its snapshots'
`errors`, keeping its last good data, so one broken integration never hides
another layer. A provider whose integration isn't set up just yields
nothing.

Schedule: the stored snapshots are loaded at setup; the cheap providers
(they only read what their integration already holds in memory) refresh two
minutes after HA has started and every 30 minutes after that. Zigbee2MQTT
is never scanned from the schedule (a network map takes minutes of radio
traffic); its periodic run only converts zigbee_mesh.py's cached map.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Awaitable, Callable, Iterable
from dataclasses import dataclass
from datetime import timedelta
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later, async_track_time_interval
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.storage import Store

from ..const import DOMAIN
from . import thread, unifi, z2m, zha
from .common import compact_snapshot_dict, utc_now_iso
from .model import LinkSnapshot

_LOGGER = logging.getLogger(__name__)

STORE_VERSION = 1
STORE_KEY = f"{DOMAIN}.links"
_DATA_KEY = f"{DOMAIN}_link_store"

# After HA has started, so ZHA and Matter have loaded their devices.
STARTUP_DELAY = timedelta(minutes=2)
REFRESH_INTERVAL = timedelta(minutes=30)
# Coalesce the writes of a refresh burst (several providers, a manual
# refresh right after the scheduled one) into one file write.
SAVE_DELAY_SECONDS = 10

LAYERS = ("zigbee", "thread", "wifi", "bluetooth")


@dataclass(frozen=True, slots=True)
class Provider:
    """One source of snapshots."""

    name: str
    layer: str
    fetch: Callable[..., Awaitable[list[LinkSnapshot]]]


PROVIDERS: tuple[Provider, ...] = (
    Provider(zha.PROVIDER, "zigbee", zha.async_get_snapshots),
    Provider(z2m.PROVIDER, "zigbee", z2m.async_get_snapshots),
    Provider(thread.PROVIDER, "thread", thread.async_get_snapshots),
    Provider(unifi.PROVIDER, "wifi", unifi.async_get_snapshots),
)


class LinkStore:
    """In-memory snapshots, backed by a Store."""

    def __init__(
        self,
        hass: HomeAssistant,
        providers: Iterable[Provider] = PROVIDERS,
    ) -> None:
        self.hass = hass
        self.providers = tuple(providers)
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self._snapshots: dict[tuple[str, str], LinkSnapshot] = {}
        self._lock = asyncio.Lock()
        self.last_refresh: str | None = None

    async def async_load(self) -> None:
        """Load the stored snapshots. A broken file is logged and ignored:
        the next refresh rebuilds everything from the integrations."""
        try:
            data = await self._store.async_load()
        except Exception:  # noqa: BLE001 - never block setup over a cache file
            _LOGGER.warning("Could not read the stored radio links; starting empty", exc_info=True)
            return
        if not data:
            return
        for raw in data.get("snapshots", []):
            try:
                snapshot = LinkSnapshot.from_dict(raw)
            except (KeyError, TypeError, ValueError):
                _LOGGER.debug("Skipping an unreadable stored snapshot")
                continue
            self._snapshots[(snapshot.layer, snapshot.network)] = snapshot
        self.last_refresh = data.get("last_refresh")

    def _data_to_save(self) -> dict[str, Any]:
        return {
            "last_refresh": self.last_refresh,
            "snapshots": [compact_snapshot_dict(s) for s in self._snapshots.values()],
        }

    def snapshots(
        self, layer: str | None = None, network: str | None = None
    ) -> list[LinkSnapshot]:
        """The current snapshots, optionally narrowed to a layer/network."""
        return [
            snapshot
            for (snap_layer, snap_network), snapshot in sorted(self._snapshots.items())
            if (layer is None or snap_layer == layer)
            and (network is None or snap_network == network)
        ]

    async def async_refresh(
        self, layers: Iterable[str] | None = None, *, periodic: bool = False
    ) -> list[LinkSnapshot]:
        """Run the providers for `layers` (all when None) and store the result.

        Returns the snapshots of those layers after the refresh.
        """
        wanted = set(layers) if layers is not None else None
        async with self._lock:
            for provider in self.providers:
                if wanted is not None and provider.layer not in wanted:
                    continue
                await self._async_run_provider(provider, periodic=periodic)
            self.last_refresh = utc_now_iso()
            self._store.async_delay_save(self._data_to_save, SAVE_DELAY_SECONDS)
        return [
            snapshot
            for snapshot in self.snapshots()
            if wanted is None or snapshot.layer in wanted
        ]

    async def _async_run_provider(self, provider: Provider, *, periodic: bool) -> None:
        previous = [s for s in self._snapshots.values() if s.provider == provider.name]
        try:
            fresh = await provider.fetch(self.hass, periodic=periodic)
        except Exception as err:  # noqa: BLE001 - isolate every provider
            # The detail (which can carry addresses) goes to the log; the
            # snapshot keeps a short, fixed message.
            _LOGGER.warning("Refreshing %s links failed", provider.name, exc_info=err)
            message = (
                f"{utc_now_iso()}: refresh failed ({type(err).__name__}); "
                "see the Home Assistant log. Showing the last good data."
            )
            if previous:
                for snapshot in previous:
                    snapshot.errors = [message]
            else:
                placeholder = LinkSnapshot(
                    layer=provider.layer,  # type: ignore[arg-type]
                    network=provider.name,
                    provider=provider.name,
                    captured_at=utc_now_iso(),
                    errors=[message],
                )
                self._snapshots[(placeholder.layer, placeholder.network)] = placeholder
            return

        # The provider's answer replaces everything it said before, so a
        # network that disappeared (a Thread network gone) goes away too.
        for snapshot in previous:
            self._snapshots.pop((snapshot.layer, snapshot.network), None)
        for snapshot in fresh:
            self._snapshots[(snapshot.layer, snapshot.network)] = snapshot


@callback
def async_get_store(hass: HomeAssistant) -> LinkStore | None:
    """The running link store, or None before setup."""
    return hass.data.get(_DATA_KEY)


async def async_get_snapshots(
    hass: HomeAssistant, layer: str | None = None, network: str | None = None
) -> list[LinkSnapshot]:
    """The latest snapshots, never touching a radio. Empty before setup.

    The public read path for other modules (spatial engine, AI tools).
    """
    store = async_get_store(hass)
    if store is None:
        return []
    return store.snapshots(layer, network)


async def async_refresh(
    hass: HomeAssistant, layers: Iterable[str] | None = None
) -> list[LinkSnapshot]:
    """Refresh on demand (service, websocket). Sets up the store if needed."""
    store = async_get_store(hass) or await async_setup_link_store(hass)
    return await store.async_refresh(layers)


async def async_setup_link_store(hass: HomeAssistant) -> LinkStore:
    """Create and load the store (idempotent). No timers; see
    `async_start_link_refresh`."""
    store = async_get_store(hass)
    if store is None:
        store = LinkStore(hass)
        await store.async_load()
        hass.data[_DATA_KEY] = store
    return store


@callback
def async_start_link_refresh(hass: HomeAssistant) -> CALLBACK_TYPE:
    """Start the scheduled refresh; returns a callback that stops it.

    The caller owns the returned callback (the config entry's
    `async_on_unload`), so unloading or reloading the entry never leaves a
    timer behind or starts a second one.
    """
    unsubs: list[CALLBACK_TYPE] = []

    async def _async_refresh(_now: Any = None) -> None:
        store = async_get_store(hass)
        if store is None:
            return
        try:
            await store.async_refresh(periodic=True)
        except Exception:  # noqa: BLE001 - a timer callback must not raise
            _LOGGER.warning("Scheduled radio-link refresh failed", exc_info=True)

    @callback
    def _started(_hass: HomeAssistant) -> None:
        unsubs.append(async_call_later(hass, STARTUP_DELAY, _async_refresh))
        unsubs.append(async_track_time_interval(hass, _async_refresh, REFRESH_INTERVAL))

    unsubs.append(async_at_started(hass, _started))

    @callback
    def _stop() -> None:
        while unsubs:
            unsubs.pop()()

    return _stop
