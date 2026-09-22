"""Services for Spatial Context."""

from __future__ import annotations

from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse

from .const import DOMAIN
from .export import async_get_map_data


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
