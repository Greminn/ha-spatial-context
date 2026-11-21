"""The Home Assistant LLM API that hands an assistant the map (#53).

Imports Home Assistant's `llm` helper and `probatio` at module level, so it
only loads on Home Assistant 2026.10 or newer; llm_api.py imports it lazily
and just logs on an older one.
"""

from __future__ import annotations

from collections.abc import Callable

import probatio

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import llm

from .const import DOMAIN
from .export import MapFilterError, async_get_map_data, filter_map_data

TOOL_NAME = "GetSpatialMap"

_API_PROMPT = (
    "Spatial Context knows where things are in this home: use GetSpatialMap to "
    "look up which floor and room a device is in, where it sits, and what walls "
    "are between devices."
)


class GetSpatialMapTool(llm.Tool):
    """Read-only: returns the same data as the `spatial_context.get_map` action."""

    name = TOOL_NAME
    title = "Get spatial map"
    description = (
        "Return the Spatial Context map of this home: floors, rooms, walls (with "
        "material and signal attenuation) and every placed device with its name, "
        "entity_id, area and position. Positions are in metres (x_m, y_m, "
        "height_m) when the floor has been calibrated, otherwise in map units "
        "(x, y). Call with no arguments for the whole map, or name a floor "
        "and/or room to get just that part."
    )
    parameters = probatio.Schema(
        {
            probatio.Optional(
                "floor", description="Only this floor, by name (e.g. 'Top Floor')."
            ): str,
            probatio.Optional(
                "room", description="Only this room, by name (e.g. 'Lounge')."
            ): str,
        }
    )
    # Reads only, never reaches outside Home Assistant. Marked read-only so the
    # MCP Server's stateless mode, which offers only read-only tools, includes it.
    annotations = llm.ToolAnnotations(
        read_only=True, destructive=False, idempotent=True, open_world=False
    )
    integration = DOMAIN

    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: llm.ToolInput,
        llm_context: llm.LLMContext,
    ) -> llm.ToolResult:
        # The panel and its commands are admin-only, so the map is too. A call
        # with no user behind it (a voice assistant, an automation) is allowed:
        # the owner has switched this on for assistants.
        user_id = llm_context.context.user_id if llm_context.context else None
        if user_id:
            user = await hass.auth.async_get_user(user_id)
            if user is not None and not user.is_admin:
                return llm.ToolResult(
                    data={"error": "The spatial map is only available to administrators."},
                    error=True,
                )

        floor = tool_input.tool_args.get("floor")
        room = tool_input.tool_args.get("room")
        if not all(value is None or isinstance(value, str) for value in (floor, room)):
            return llm.ToolResult(
                data={"error": "floor and room must be text."}, error=True
            )

        data = await async_get_map_data(hass)
        try:
            return llm.ToolResult(data=filter_map_data(data, floor, room))
        except MapFilterError as err:
            return llm.ToolResult(data={"error": str(err)}, error=True)


class SpatialContextAPI(llm.API):
    """The `spatial_context` LLM API: one tool, the map."""

    def __init__(self, hass: HomeAssistant) -> None:
        super().__init__(hass=hass, id=DOMAIN, name="Spatial Context")

    async def async_get_api_instance(
        self, llm_context: llm.LLMContext
    ) -> llm.APIInstance:
        return llm.APIInstance(
            api=self,
            api_prompt=_API_PROMPT,
            llm_context=llm_context,
            tools=[GetSpatialMapTool()],
        )


def async_register(hass: HomeAssistant) -> Callable[[], None] | None:
    """Register the API; returns the function that removes it again."""
    try:
        return llm.async_register_api(hass, SpatialContextAPI(hass))
    except HomeAssistantError:
        # Already registered (a reload of this integration): leave it as is.
        return None
