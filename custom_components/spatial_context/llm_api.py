"""Switches the assistant map tool on and off from Settings (#53).

The tool is only registered with Home Assistant's LLM APIs while the
"Let AI assistants read the map" setting is on, so with it off the API is not
even selectable in the MCP Server or a conversation agent.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .storage import async_get_settings

_LOGGER = logging.getLogger(__name__)

_UNREGISTER_KEY = "llm_api_unregister"


async def async_sync_llm_api(hass: HomeAssistant) -> None:
    """Register the API while the setting is on, and remove it when it is off."""
    enabled = bool((await async_get_settings(hass)).get("llm_api_enabled"))
    domain_data = hass.data.setdefault(DOMAIN, {})
    registered = _UNREGISTER_KEY in domain_data

    if enabled and not registered:
        try:
            from .llm_tools import async_register
        except ImportError:
            # probatio / the llm helper changed in Home Assistant 2026.10.
            _LOGGER.warning(
                "Letting AI assistants read the map needs Home Assistant 2026.10 or newer"
            )
            return
        try:
            domain_data[_UNREGISTER_KEY] = async_register(hass) or (lambda: None)
        except Exception:  # noqa: BLE001 - never let this break setup or a settings save
            _LOGGER.warning("Could not register the Spatial Context LLM API", exc_info=True)
            return
        _LOGGER.debug("Spatial Context LLM API registered")
    elif not enabled and registered:
        domain_data.pop(_UNREGISTER_KEY)()
        _LOGGER.debug("Spatial Context LLM API removed")
