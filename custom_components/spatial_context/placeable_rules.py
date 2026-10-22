"""Which devices and entities can be placed on the plan.

Kept free of Home Assistant imports so the rules can be tested on their own.
registry_snapshot.py applies them to the live registries.
"""

from __future__ import annotations

from collections.abc import Iterable

# Home Assistant files apps, hubs and bridges as service devices, and
# placement skips those because they are not a thing with a position. The
# OpenThread Border Router app is the exception: it is the Thread border
# router, a real radio that links are drawn to (#42), so it can be placed
# and chosen under Settings > Border router. Matched on the identifier the
# Supervisor gives that one app, not on every app.
_PLACEABLE_SERVICE_DEVICES = frozenset({("hassio", "core_openthread_border_router")})

# Home Assistant's own radio hardware. Its only entity is often a firmware
# `update`, which placement normally ignores, so without this the device
# could never be placed or chosen as the border router (#42).
_HARDWARE_INTEGRATIONS = frozenset(
    {
        "homeassistant_yellow",
        "homeassistant_green",
        "homeassistant_sky_connect",
        "homeassistant_connect_zbt2",
    }
)


def device_is_placeable(
    entry_type: object | None, identifiers: Iterable[tuple[str, ...]]
) -> bool:
    """A normal device, or the one service device that stands for a border router."""
    if entry_type is None:
        return True
    return any(tuple(i[:2]) in _PLACEABLE_SERVICE_DEVICES for i in identifiers)


def entity_domain_is_placeable(
    domain: str,
    integration_domain: str | None,
    placeable_domains: frozenset[str],
) -> bool:
    """An entity of a placeable domain, or a firmware `update` on Home
    Assistant's own radio hardware."""
    if domain in placeable_domains:
        return True
    return domain == "update" and integration_domain in _HARDWARE_INTEGRATIONS
