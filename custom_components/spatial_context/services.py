"""Services for Spatial Context.

The services added for the link store and the spatial engine are admin-only,
like the WebSocket API, and are registered with Home Assistant's
`async_register_admin_service`: a non-admin user's call is refused, while a
call with no user (an automation or script) is allowed.
"""

from __future__ import annotations

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import async_register_admin_service

from .const import DOMAIN
from .export import async_get_map_data
from .zigbee_mesh import async_get_network_map


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register services for the Spatial Context integration."""

    async def get_map_service(call: ServiceCall) -> dict:
        """Return the spatial map data."""
        return await async_get_map_data(hass)

    hass.services.async_register(
        DOMAIN,
        "get_map",
        get_map_service,
        supports_response=SupportsResponse.ONLY,
    )

    async def refresh_zigbee_mesh_service(call: ServiceCall) -> None:
        """Force a fresh Zigbee mesh scan and populate the cache — meant to
        run from an automation (e.g. overnight) so the panel's own Load mesh
        click can serve an instant, pre-warmed cache instead of blocking for
        the 1-2+ minutes a real scan takes on a large mesh."""
        await async_get_network_map(hass, force_refresh=True)

    hass.services.async_register(
        DOMAIN,
        "refresh_zigbee_mesh",
        refresh_zigbee_mesh_service,
    )

    async def refresh_links_service(call: ServiceCall) -> dict:
        """Re-read every radio-link provider (or the given layers) into the
        link store, for an automation that wants fresher data than the
        30-minute schedule. Returns a short per-network summary."""
        from .links.store import async_refresh

        snapshots = await async_refresh(hass, call.data.get("layers"))
        return {
            "snapshots": [
                {
                    "layer": s.layer,
                    "network": s.network,
                    "provider": s.provider,
                    "captured_at": s.captured_at,
                    "nodes": len(s.nodes),
                    "links": len(s.links),
                    "errors": s.errors,
                }
                for s in snapshots
            ]
        }

    async_register_admin_service(
        hass,
        DOMAIN,
        "refresh_links",
        refresh_links_service,
        vol.Schema(
            {
                vol.Optional("layers"): vol.All(
                    cv.ensure_list, [vol.In(("zigbee", "thread", "wifi", "bluetooth"))]
                )
            }
        ),
        supports_response=SupportsResponse.OPTIONAL,
    )
