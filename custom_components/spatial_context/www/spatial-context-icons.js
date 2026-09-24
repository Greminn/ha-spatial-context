// Registers the "spatial-context:" custom icon set so the HA sidebar can
// show Spatial Context's own icon (a simplified floor plan with a
// device-mesh overlay) instead of a generic mdi: glyph. Loaded globally on
// every page via frontend.add_extra_js_url (see frontend.py) — the sidebar
// renders before our panel's own JS bundle would otherwise load, so this
// registration has to happen eagerly, not lazily from inside the panel.
//
// ha-svg-icon only ever fills a custom icon's path with currentColor (single
// tone, same as a built-in mdi icon), so this is the monochrome derivative
// of brand/icon.svg — see brand/icon-mono.svg for the source of truth.
(function () {
  const ICON_PATH =
    "M2.65,3.65 H21.35 V20.35 H2.65 Z " +
    "M4.35,5.35 V18.65 H19.65 V5.35 Z " +
    "M11.15,3.65 H12.85 V13 H11.15 Z " +
    "M12.5746,16.1004 L6.8746,7.9004 L5.7254,8.6996 L11.4254,16.8996 Z " +
    "M12.5746,16.8996 L18.2746,8.6996 L17.1254,7.9004 L11.4254,16.1004 Z " +
    "M10.5,16.5 A1.5,1.5 0 1,0 13.5,16.5 A1.5,1.5 0 1,0 10.5,16.5 Z " +
    "M5.0,8.3 A1.3,1.3 0 1,0 7.6,8.3 A1.3,1.3 0 1,0 5.0,8.3 Z " +
    "M16.4,8.3 A1.3,1.3 0 1,0 19.0,8.3 A1.3,1.3 0 1,0 16.4,8.3 Z";

  window.customIcons = window.customIcons || {};
  window.customIcons["spatial-context"] = {
    getIcon: async () => ({ path: ICON_PATH, viewBox: "0 0 24 24" }),
  };
})();
