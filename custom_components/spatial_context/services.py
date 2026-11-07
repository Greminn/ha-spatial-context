"""Services for Spatial Context."""

from __future__ import annotations

from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers.service import async_register_admin_service

from .const import DOMAIN
from .export import async_get_map_data
from .zigbee_mesh import async_get_network_map


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register services for the Spatial Context integration."""

    async def get_map_service(call: ServiceCall) -> dict:
        """Return the spatial map data."""
        return await async_get_map_data(hass)

    async_register_admin_service(
        hass,
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

    async_register_admin_service(
        hass,
        DOMAIN,
        "refresh_zigbee_mesh",
        refresh_zigbee_mesh_service,
    )
