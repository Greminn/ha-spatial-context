"""Frontend static path + sidebar panel registration for Spatial Context.

Mirrors voice_satellite/frontend.py's sidebar-panel half (the
"browser_mod pattern") — Spatial Context has no Lovelace card, only a
full-page panel, so the Lovelace-resource half of that file doesn't apply.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import (
    async_register_built_in_panel,
)
from aiohttp import web

from homeassistant.components.http import HomeAssistantView, StaticPathConfig
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


# The panel bundle's own URL — outside URL_BASE's static path, so it can be
# served with `Cache-Control: no-cache` (see PanelBundleView).
PANEL_URL = f"{URL_BASE}_panel.js"


class PanelBundleView(HomeAssistantView):
    """Serves the panel bundle with `Cache-Control: no-cache`.

    The registered panel URL only changes at startup (its ?v= token), and
    without cache headers a browser — Safari especially — may reuse a stale
    copy indefinitely after the file is updated in place. no-cache keeps
    caching but revalidates every load (a cheap 304 via ETag/Last-Modified),
    so an updated bundle is always picked up.
    """

    url = PANEL_URL
    name = "spatial_context:panel_bundle"
    # Loaded by the frontend as a plain module import, which carries no
    # auth header — same as the static path it replaces.
    requires_auth = False

    async def get(self, request: web.Request) -> web.FileResponse:
        return web.FileResponse(
            WWW_DIR / PANEL_FILENAME, headers={"Cache-Control": "no-cache"}
        )


async def async_register_static_paths(hass: HomeAssistant) -> None:
    """Register /spatial_context/* as a static HTTP path serving www/."""
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(WWW_DIR), False)]
        )
        _LOGGER.debug("Static path registered: %s", URL_BASE)
    except RuntimeError:
        _LOGGER.debug("Static path already registered: %s", URL_BASE)
    hass.http.register_view(PanelBundleView())


def async_register_sidebar_panel(hass: HomeAssistant) -> None:
    """Register the Spatial Context sidebar panel (browser_mod pattern)."""
    panel_url = f"{PANEL_URL}?v={_cache_bust_token(PANEL_FILENAME)}"

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
