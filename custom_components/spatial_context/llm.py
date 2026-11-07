"""LLM tools platform: the spatial engine's outputs as tools for conversation
agents (Home Assistant 2026.11+, `homeassistant.components.llm`).

Off unless the `llm_tools_enabled` setting is on (#53): the plan says a lot
about a home, so handing it to an AI is the owner's explicit choice. The
tools are offered on the "Home Assistant" LLM API only, which is admin-only
like the rest of Spatial Context; the "Assist" API is bounded by entity
exposure, and these tools describe devices whatever their exposure.

Home Assistant only loads this module where the LLM integration exists, but
the imports are guarded anyway so nothing breaks if it is imported on an
older version: `async_get_tools` then offers nothing.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .spatial.ai import NotFound, async_run_tool
from .storage import cached_settings

try:
    import probatio

    from homeassistant.components.llm import LLMTools
    from homeassistant.helpers.llm import (
        LLM_API_HOME_ASSISTANT,
        LLMContext,
        Tool,
        ToolAnnotations,
        ToolInput,
        ToolResult,
    )
except ImportError:  # Home Assistant without the LLM tools platform
    probatio = None  # type: ignore[assignment]
    LLMTools = None  # type: ignore[assignment,misc]
    LLM_API_HOME_ASSISTANT = "homeassistant"
    LLMContext = ToolInput = Any  # type: ignore[assignment,misc]
    Tool = object  # type: ignore[assignment,misc]
    ToolAnnotations = ToolResult = None  # type: ignore[assignment,misc]

PROMPT = (
    "Spatial Context tools describe the home's floor plan and radio meshes "
    "(Zigbee, Thread, Wi-Fi). Start with spatial_context__summary, then ask "
    "about one device, a path between two devices, a room, or weak links. "
    "Ids like d12 (device), r3 (room) and l1 (level) are short ids from these "
    "tools; names work too. Distances are metres, signals dBm, losses dB. "
    "predicted_dbm is a rough model from distance, walls and floors; gap_db is "
    "how much weaker the measured signal is than predicted. Zigbee signal is "
    "LQI, which is ordinal and vendor-specific: use it to rank links, not as a "
    "measurement. Unplaced devices and uncalibrated levels have no geometry."
)

_LAYERS = ["zigbee", "thread", "wifi", "bluetooth"]


class _SpatialTool(Tool):  # type: ignore[misc,valid-type]
    """One spatial engine output. Read-only and local."""

    integration = DOMAIN
    tool: str

    def __init__(self) -> None:
        self.name = f"{DOMAIN}__{self.tool}"
        self.annotations = ToolAnnotations(
            read_only=True, destructive=False, idempotent=True, open_world=False
        )

    async def async_call(
        self, hass: HomeAssistant, tool_input: ToolInput, llm_context: LLMContext
    ) -> Any:
        args = self.parameters(tool_input.tool_args)
        try:
            data = await async_run_tool(hass, self.tool, args)
        except (NotFound, ValueError) as err:
            return ToolResult(data={"error": str(err)}, error=True)
        return ToolResult(data=data)


class SummaryTool(_SpatialTool):
    tool = "summary"
    title = "Home layout summary"
    description = (
        "The home at a glance: levels, rooms with neighbouring rooms, radio "
        "infrastructure (routers, border routers, access points) and where it "
        "is, networks, the top findings, and which data is approximate."
    )

    def __init__(self) -> None:
        super().__init__()
        self.parameters = probatio.Schema({})


class DeviceContextTool(_SpatialTool):
    tool = "device_context"
    title = "Device location and links"
    description = (
        "Where one device is (level, room, position), its radios, every radio "
        "link with distance, walls, predicted and measured signal, findings, "
        "and the nearest infrastructure."
    )

    def __init__(self) -> None:
        super().__init__()
        self.parameters = probatio.Schema({probatio.Required("device"): str})


class PathTool(_SpatialTool):
    tool = "path"
    title = "What is between two devices"
    description = (
        "Distance, floors and walls (material, loss) on the straight path "
        "between two devices, the rooms it passes, the predicted signal, and "
        "any measured link between them."
    )

    def __init__(self) -> None:
        super().__init__()
        self.parameters = probatio.Schema(
            {probatio.Required("a"): str, probatio.Required("b"): str}
        )


class WeakLinksTool(_SpatialTool):
    tool = "weak_links"
    title = "Weak radio links"
    description = (
        "Links whose measured signal is far below what distance, walls and "
        "floors predict, worst first. Optionally one layer or one level."
    )

    def __init__(self) -> None:
        super().__init__()
        self.parameters = probatio.Schema(
            {
                probatio.Optional("layer"): probatio.In(_LAYERS),
                probatio.Optional("level"): str,
            }
        )


class RoomTool(_SpatialTool):
    tool = "room"
    title = "Room details"
    description = (
        "One room: size, neighbouring rooms, its devices and their radio "
        "roles, links inside and out, and findings."
    )

    def __init__(self) -> None:
        super().__init__()
        self.parameters = probatio.Schema({probatio.Required("room"): str})


TOOL_CLASSES = (SummaryTool, DeviceContextTool, PathTool, WeakLinksTool, RoomTool)


@callback
def async_get_tools(
    hass: HomeAssistant, llm_context: LLMContext, api_id: str
) -> Any:
    """The spatial tools, when enabled in the settings, for the admin-only
    Home Assistant API."""
    if LLMTools is None or api_id != LLM_API_HOME_ASSISTANT:
        return None
    if not cached_settings(hass).get("llm_tools_enabled"):
        return None
    return LLMTools(tools=[cls() for cls in TOOL_CLASSES], prompt=PROMPT)
