"""Version handshake and opt-in debug logging for Spatial Context.

Two things that are otherwise invisible from outside the browser:

- **Which code is actually running.** HA only loads Python at startup, and a
  browser can keep a cached panel bundle across reloads — so after an
  update, the panel, the backend HA is running and the files on disk can all
  disagree. `async_get_version_info` reports the latter two so the panel can
  say "reload" or "restart Home Assistant" instead of failing quietly.
- **What the panel did.** With Settings → Debug logging on, the panel sends
  short event records here, appended to `<config>/spatial_context_debug.log`
  (capped, one rotation) — readable by a maintainer over SSH, or attached to
  an issue via the panel's "Download debug report". Records carry ids and
  counts, never device names or positions.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN, PANEL_FILENAME
from .storage import (
    async_get_all_layouts,
    async_get_property_layout,
    async_get_settings,
)

_LOGGER = logging.getLogger(__name__)

_COMPONENT_DIR = Path(__file__).parent
_BUILD_INFO = _COMPONENT_DIR / "www" / PANEL_FILENAME.replace(".js", ".build.json")
_MANIFEST = _COMPONENT_DIR / "manifest.json"
_LOADED_VERSION_KEY = "loaded_version"

LOG_FILENAME = "spatial_context_debug.log"
_LOG_MAX_BYTES = 1024 * 1024
_REPORT_TAIL_LINES = 300


async def async_record_loaded_version(hass: HomeAssistant) -> None:
    """Remember the version HA loaded at startup — the backend's real
    version until the next restart, whatever is on disk by then."""
    integration = await async_get_integration(hass, DOMAIN)
    hass.data.setdefault(DOMAIN, {})[_LOADED_VERSION_KEY] = str(integration.version)


def _read_disk_versions() -> dict[str, str | None]:
    def _json(path: Path) -> dict[str, Any]:
        try:
            return json.loads(path.read_text())
        except (OSError, ValueError):
            return {}

    return {
        "installed_version": _json(_MANIFEST).get("version"),
        "panel_build_id": _json(_BUILD_INFO).get("build_id"),
    }


async def async_get_version_info(hass: HomeAssistant) -> dict[str, Any]:
    """{loaded_version, installed_version, panel_build_id} — the backend
    HA is running vs. what's installed on disk now, and the build id of the
    panel bundle on disk (the panel compares that with its own)."""
    disk = await hass.async_add_executor_job(_read_disk_versions)
    return {
        "loaded_version": hass.data.get(DOMAIN, {}).get(_LOADED_VERSION_KEY),
        **disk,
    }


def _log_path(hass: HomeAssistant) -> Path:
    return Path(hass.config.path(LOG_FILENAME))


def _append_lines(path: Path, lines: list[str]) -> None:
    try:
        if path.exists() and path.stat().st_size > _LOG_MAX_BYTES:
            path.replace(path.with_suffix(path.suffix + ".1"))
        with path.open("a", encoding="utf-8") as handle:
            handle.writelines(line + "\n" for line in lines)
    except OSError:
        _LOGGER.warning("Couldn't write the Spatial Context debug log", exc_info=True)


async def async_append_debug_entries(
    hass: HomeAssistant, entries: list[dict[str, Any]]
) -> None:
    """Append panel events, one JSON object per line, prefixed with the
    time they were received. A no-op unless Debug logging is on."""
    if not (await async_get_settings(hass)).get("debug_logging"):
        return
    received = datetime.now(timezone.utc).isoformat(timespec="milliseconds")
    lines = [
        json.dumps({"received": received, **entry}, separators=(",", ":"), default=str)
        for entry in entries
    ]
    await hass.async_add_executor_job(_append_lines, _log_path(hass), lines)


def _tail(path: Path, count: int) -> list[str]:
    try:
        return path.read_text(encoding="utf-8").splitlines()[-count:]
    except OSError:
        return []


async def async_build_debug_report(hass: HomeAssistant) -> dict[str, Any]:
    """Everything useful for a bug report, safe to post publicly: versions,
    settings, per-floor *counts* (no names or positions) and the tail of
    the debug log."""
    floors = await async_get_all_layouts(hass)
    property_layout = await async_get_property_layout(hass)
    log_tail = await hass.async_add_executor_job(
        _tail, _log_path(hass), _REPORT_TAIL_LINES
    )
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "ha_version": HA_VERSION,
        "versions": await async_get_version_info(hass),
        "settings": await async_get_settings(hass),
        "floors": {
            floor_id: {
                "rooms": len(layout.get("rooms", [])),
                "walls": len(layout.get("walls", [])),
                "openings": len(layout.get("openings", [])),
                "pins": len(layout.get("pins", [])),
                "has_scale": layout.get("scale") is not None,
                "has_background": layout.get("background_image_id") is not None,
                "aligned": layout.get("building_id") is not None,
            }
            for floor_id, layout in floors.items()
        },
        "property": {
            "placements": len(property_layout.get("placements", [])),
            "outdoor_pins": len(property_layout.get("pins", [])),
            "has_background": property_layout.get("background_image_id") is not None,
        },
        "log_tail": _parse_lines(log_tail),
    }


def _parse_lines(lines: list[str]) -> list[Any]:
    parsed: list[Any] = []
    for line in lines:
        try:
            parsed.append(json.loads(line))
        except ValueError:
            parsed.append(line)  # kept raw rather than dropped
    return parsed
