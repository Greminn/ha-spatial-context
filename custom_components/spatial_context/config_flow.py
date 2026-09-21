"""Config flow for Spatial Context — single-instance, no user input needed."""

from __future__ import annotations

from homeassistant import config_entries

from .const import DOMAIN


class SpatialContextConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Spatial Context config flow."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title="Spatial Context", data={})
