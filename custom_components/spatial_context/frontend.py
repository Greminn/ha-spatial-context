"""Frontend static path + sidebar panel registration for Spatial Context.

Mirrors voice_satellite/frontend.py's sidebar-panel half (the
"browser_mod pattern") — Spatial Context has no Lovelace card, only a
full-page panel, so the Lovelace-resource half of that file doesn't apply.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import (
    add_extra_js_url,
    async_register_built_in_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    FRONTEND_URL_PATH,
    ICONS_FILENAME,
    PANEL_FILENAME,
    SIDEBAR_ICON,
    SIDEBAR_TITLE,
    URL_BASE,
)

_LOGGER = logging.getLogger(__name__)

WWW_DIR = Path(__file__).parent / "www"


def _cache_bust_token(filename: str) -> str:
    """Derive a cache-busting query token from a served file's own mtime.

    Deliberately not a hand-maintained version constant — a forgotten bump
    there means a browser keeps serving a stale panel after every redeploy
    (this bit us once already). Tying it to the file's own mtime makes a
    fresh HA restart always pick up whatever was actually last built.
    """
    try:
        return str(int((WWW_DIR / filename).stat().st_mtime))
    except OSError:
        return "0"


async def async_register_static_paths(hass: HomeAssistant) -> None:
    """Register /spatial_context/* as a static HTTP path serving www/."""
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(WWW_DIR), False)]
        )
        _LOGGER.debug("Static path registered: %s", URL_BASE)
    except RuntimeError:
        _LOGGER.debug("Static path already registered: %s", URL_BASE)


def async_register_icons(hass: HomeAssistant) -> None:
    """Register the spatial-context: custom icon set, globally and eagerly.

    The sidebar renders before our panel's own JS would otherwise load
    (that only happens lazily, on navigating to the panel), so the icon
    registration has to ship as its own extra module URL loaded on every
    page — the same mechanism a custom theme or icon pack would use — not
    bundled into spatial-context-panel.js.
    """
    icons_url = f"{URL_BASE}/{ICONS_FILENAME}?v={_cache_bust_token(ICONS_FILENAME)}"
    add_extra_js_url(hass, icons_url)
    _LOGGER.debug("Spatial Context icon set registered: %s", icons_url)


def async_register_sidebar_panel(hass: HomeAssistant) -> None:
    """Register the Spatial Context sidebar panel (browser_mod pattern)."""
    panel_url = f"{URL_BASE}/{PANEL_FILENAME}?v={_cache_bust_token(PANEL_FILENAME)}"

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=SIDEBAR_TITLE,
        sidebar_icon=SIDEBAR_ICON,
        frontend_url_path=FRONTEND_URL_PATH,
        require_admin=False,
        config={
            "_panel_custom": {
                "name": "spatial-context-panel",
                "js_url": panel_url,
            }
        },
    )
    _LOGGER.debug("Spatial Context sidebar panel registered")
