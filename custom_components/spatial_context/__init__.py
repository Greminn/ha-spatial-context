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

from .frontend import async_register_sidebar_panel, async_register_static_paths
from .websocket_api import async_register_commands

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up integration-wide resources: WebSocket commands + frontend panel."""
    async_register_commands(hass)

    try:
        await async_register_static_paths(hass)
        async_register_sidebar_panel(hass)
    except Exception:  # noqa: BLE001 - never block HA startup over frontend registration
        _LOGGER.warning("Failed to register Spatial Context frontend panel", exc_info=True)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Spatial Context from a config entry. Nothing per-entry to do —
    everything lives in async_setup (WebSocket commands, frontend panel)."""
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry. Nothing per-entry to tear down."""
    return True
