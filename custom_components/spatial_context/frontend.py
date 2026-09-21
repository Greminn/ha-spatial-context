"""Frontend static path + sidebar panel registration for Spatial Context.

Mirrors voice_satellite/frontend.py's sidebar-panel half (the
"browser_mod pattern") — Spatial Context has no Lovelace card, only a
full-page panel, so the Lovelace-resource half of that file doesn't apply.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    FRONTEND_URL_PATH,
    PANEL_FILENAME,
    SIDEBAR_ICON,
    SIDEBAR_TITLE,
    URL_BASE,
)

_LOGGER = logging.getLogger(__name__)

WWW_DIR = Path(__file__).parent / "www"


def _cache_bust_token() -> str:
    """Derive a cache-busting query token from the built JS's own mtime.

    Deliberately not a hand-maintained version constant — a forgotten bump
    there means a browser keeps serving a stale panel after every redeploy
    (this bit us once already). Tying it to the file's own mtime makes a
    fresh HA restart always pick up whatever was actually last built.
    """
    js_path = WWW_DIR / PANEL_FILENAME
    try:
        return str(int(js_path.stat().st_mtime))
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


def async_register_sidebar_panel(hass: HomeAssistant) -> None:
    """Register the Spatial Context sidebar panel (browser_mod pattern)."""
    panel_url = f"{URL_BASE}/{PANEL_FILENAME}?v={_cache_bust_token()}"

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
