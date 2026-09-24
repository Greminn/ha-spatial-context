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
    "M8.0773,8.6957 L17.0773,7.6957 L16.9227,6.3043 L7.9227,7.3043 Z " +
    "M7.3043,7.9227 L6.3043,16.9227 L7.6957,17.0773 L8.6957,8.0773 Z " +
    "M7.5050,8.4950 L16.5050,17.4950 L17.4950,16.5050 L8.4950,7.5050 Z " +
    "M6.5,8 A1.5,1.5 0 1,0 9.5,8 A1.5,1.5 0 1,0 6.5,8 Z " +
    "M15.7,7 A1.3,1.3 0 1,0 18.3,7 A1.3,1.3 0 1,0 15.7,7 Z " +
    "M5.7,17 A1.3,1.3 0 1,0 8.3,17 A1.3,1.3 0 1,0 5.7,17 Z " +
    "M15.7,17 A1.3,1.3 0 1,0 18.3,17 A1.3,1.3 0 1,0 15.7,17 Z";

  window.customIcons = window.customIcons || {};
  window.customIcons["spatial-context"] = {
    getIcon: async () => ({ path: ICON_PATH, viewBox: "0 0 24 24" }),
  };
})();
