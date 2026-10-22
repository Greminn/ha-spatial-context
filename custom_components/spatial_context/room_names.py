"""The name a room shows.

A room saved with an empty name follows the Home Assistant area it is linked
to (#52), so renaming the area renames the room. A typed name overrides that.
Kept free of Home Assistant imports so it can be tested on its own;
frontend/src/room-name.ts applies the same rule on the plan.
"""

from __future__ import annotations

from collections.abc import Mapping


def room_display_name(
    name: str | None, area_id: str | None, area_names: Mapping[str, str]
) -> str:
    """The room's own name, else its area's current name, else a plain label."""
    typed = (name or "").strip()
    if typed:
        return typed
    return area_names.get(area_id or "", "") or "Room"
