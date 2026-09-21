/** Shared quality grade across all three network types, so Zigbee's LQI,
 * Matter's own "strength" field, and Wi-Fi's total absence of a signal
 * metric all render through one honest color scale — "unknown" stays a
 * neutral color rather than fabricating a grade for Wi-Fi links. */
export type LinkQuality = "strong" | "medium" | "weak" | "unknown";

export function qualityColor(quality: LinkQuality): string {
  switch (quality) {
    case "strong":
      return "#2e7d32";
    case "medium":
      return "#f9a825";
    case "weak":
      return "#c62828";
    default:
      return "#607d8b";
  }
}

/** Zigbee LQI (0-255) → the shared quality scale. */
export function lqiToQuality(lqi: number): LinkQuality {
  if (lqi >= 150) return "strong";
  if (lqi >= 80) return "medium";
  return "weak";
}

/** Wi-Fi RSSI (dBm, standard `signal_strength` device_class) → the shared
 * quality scale, using the conventional -50/-70 thresholds. */
export function dbmToQuality(dbm: number): LinkQuality {
  if (dbm >= -50) return "strong";
  if (dbm >= -70) return "medium";
  return "weak";
}
