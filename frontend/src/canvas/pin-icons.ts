import {
  mdiAccount,
  mdiAirHumidifier,
  mdiBullhorn,
  mdiCctv,
  mdiCogPlay,
  mdiCrosshairsGps,
  mdiDotsGrid,
  mdiEye,
  mdiFan,
  mdiHelpBox,
  mdiLightbulb,
  mdiLock,
  mdiMicrophoneVariant,
  mdiRobotVacuum,
  mdiScriptText,
  mdiShieldHome,
  mdiSpeaker,
  mdiThermostat,
  mdiToggleSwitch,
  mdiToggleSwitchOutline,
  mdiValve,
  mdiWaterBoiler,
  mdiWindowShutter,
} from "@mdi/js";

/** Real per-domain icon paths for pins on the SVG canvas. `<ha-icon>` (used
 * everywhere else in this app) can't be used here — Safari fails to
 * namespace `<foreignObject>` correctly inside SVG (confirmed earlier in
 * this project), so pins render a plain nested `<svg><path>` instead,
 * which sidesteps that bug entirely since it's SVG-in-SVG, not
 * HTML-in-SVG. Mirrors pin-tool.ts's DOMAIN_ICONS name-for-name. */
const DOMAIN_ICON_PATHS: Record<string, string> = {
  light: mdiLightbulb,
  switch: mdiToggleSwitch,
  sensor: mdiEye,
  binary_sensor: mdiEye,
  climate: mdiThermostat,
  lock: mdiLock,
  cover: mdiWindowShutter,
  camera: mdiCctv,
  media_player: mdiSpeaker,
  fan: mdiFan,
  humidifier: mdiAirHumidifier,
  vacuum: mdiRobotVacuum,
  alarm_control_panel: mdiShieldHome,
  person: mdiAccount,
  device_tracker: mdiCrosshairsGps,
  water_heater: mdiWaterBoiler,
  valve: mdiValve,
  siren: mdiBullhorn,
  assist_satellite: mdiMicrophoneVariant,
  input_boolean: mdiToggleSwitchOutline,
  automation: mdiCogPlay,
  script: mdiScriptText,
};

const FALLBACK_ICON_PATH = mdiHelpBox;

export function pinIconPath(domain: string): string {
  return DOMAIN_ICON_PATHS[domain] ?? FALLBACK_ICON_PATH;
}

/** Marker for 2+ devices co-located at (near enough) the same spot. */
export const GROUP_ICON_PATH = mdiDotsGrid;

/** Per-domain pin-dot fill color — lets a device's *type* read at a glance
 * from across the room (icon glyph alone is only legible up close), the
 * same way HA's own more-info dialogs tint an entity's icon by domain.
 * Deliberately not identical to HA's exact per-domain theme colors (those
 * are tuned for a small icon over a card background, not a solid dot) —
 * just a distinct, readable palette with no two adjacent-likely domains
 * sharing a color. Falls back to the app's accent color (also used for the
 * multi-device group marker, so a "mixed" pin reads as neutral/composite
 * rather than any one type). */
const DOMAIN_COLORS: Record<string, string> = {
  light: "#f9a825",
  switch: "#1e88e5",
  sensor: "#00897b",
  binary_sensor: "#00897b",
  climate: "#fb8c00",
  lock: "#6d4c41",
  cover: "#43a047",
  camera: "#8e24aa",
  media_player: "#3949ab",
  fan: "#00acc1",
  humidifier: "#26c6da",
  vacuum: "#5e35b1",
  alarm_control_panel: "#e53935",
  person: "#7cb342",
  device_tracker: "#7cb342",
  water_heater: "#d84315",
  valve: "#0097a7",
  siren: "#ad1457",
  assist_satellite: "#ab47bc",
  input_boolean: "#757575",
  automation: "#757575",
  script: "#757575",
};

const FALLBACK_COLOR = "var(--sc-accent)";

export function pinColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? FALLBACK_COLOR;
}
