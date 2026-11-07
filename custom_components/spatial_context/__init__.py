"""Spatial Context integration.

Trace each floor's room layout and place live HA entities on it, so an
AI assistant can be given real physical/spatial grounding for a house.
No entities, no platforms — just a sidebar panel, a small WebSocket API,
and a Store-backed layout per floor.
"""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .debug import async_record_loaded_version
from .frontend import (
    async_register_sidebar_panel,
    async_register_static_paths,
)
from .links.store import async_setup_link_store, async_start_link_refresh
from .registry_snapshot import async_migrate_pin_device_ids
from .services import async_setup_services
from .storage import async_backup_layout, async_get_settings
from .websocket_api import async_register_commands

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up integration-wide resources: WebSocket commands + frontend panel."""
    version = await async_record_loaded_version(hass)
    # Before anything can read and rewrite the layout: keep this version's copy.
    await async_backup_layout(hass, version)
    async_register_commands(hass)
    await async_setup_services(hass)
    await async_migrate_pin_device_ids(hass)
    try:
        await async_setup_link_store(hass)
    except Exception:  # noqa: BLE001 - radio links are optional; never block setup
        _LOGGER.warning("Failed to load the stored Spatial Context radio links", exc_info=True)
    # Prime the settings cache: llm.py's tools callback reads it synchronously.
    await async_get_settings(hass)

    try:
        await async_register_static_paths(hass)
        async_register_sidebar_panel(hass)
    except Exception:  # noqa: BLE001 - never block HA startup over frontend registration
        _LOGGER.warning("Failed to register Spatial Context frontend panel", exc_info=True)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Spatial Context from a config entry. Everything else lives in
    async_setup (WebSocket commands, frontend panel, link store); only the
    link store's refresh timer is tied to the entry, so unloading or
    reloading the entry stops it instead of leaving it behind."""
    entry.async_on_unload(async_start_link_refresh(hass))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry. The refresh timer is stopped by the callback
    registered with `async_on_unload`."""
    return True
