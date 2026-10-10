/** HA's standard colour choices (the same list its own colour picker
 * offers), each with the theme CSS variable that defines it and HA's
 * default value as a fallback. A room stores the resolved #rrggbb, because
 * the saved layout (and its backend schema) holds plain hex colours. */
export interface PaletteColor {
  key: string;
  label: string;
  cssVar: string;
  fallback: string;
}

export const HA_COLORS: PaletteColor[] = [
  {
    key: "primary",
    label: "Primary",
    cssVar: "--primary-color",
    fallback: "#03a9f4",
  },
  {
    key: "accent",
    label: "Accent",
    cssVar: "--accent-color",
    fallback: "#ff9800",
  },
  { key: "red", label: "Red", cssVar: "--red-color", fallback: "#f44336" },
  { key: "pink", label: "Pink", cssVar: "--pink-color", fallback: "#e91e63" },
  {
    key: "purple",
    label: "Purple",
    cssVar: "--purple-color",
    fallback: "#926bc7",
  },
  {
    key: "deep-purple",
    label: "Deep purple",
    cssVar: "--deep-purple-color",
    fallback: "#6e41ab",
  },
  {
    key: "indigo",
    label: "Indigo",
    cssVar: "--indigo-color",
    fallback: "#3f51b5",
  },
  { key: "blue", label: "Blue", cssVar: "--blue-color", fallback: "#2196f3" },
  {
    key: "light-blue",
    label: "Light blue",
    cssVar: "--light-blue-color",
    fallback: "#03a9f4",
  },
  { key: "cyan", label: "Cyan", cssVar: "--cyan-color", fallback: "#00bcd4" },
  { key: "teal", label: "Teal", cssVar: "--teal-color", fallback: "#009688" },
  {
    key: "green",
    label: "Green",
    cssVar: "--green-color",
    fallback: "#4caf50",
  },
  {
    key: "light-green",
    label: "Light green",
    cssVar: "--light-green-color",
    fallback: "#8bc34a",
  },
  { key: "lime", label: "Lime", cssVar: "--lime-color", fallback: "#cddc39" },
  {
    key: "yellow",
    label: "Yellow",
    cssVar: "--yellow-color",
    fallback: "#ffeb3b",
  },
  {
    key: "amber",
    label: "Amber",
    cssVar: "--amber-color",
    fallback: "#ffc107",
  },
  {
    key: "orange",
    label: "Orange",
    cssVar: "--orange-color",
    fallback: "#ff9800",
  },
  {
    key: "deep-orange",
    label: "Deep orange",
    cssVar: "--deep-orange-color",
    fallback: "#ff5722",
  },
  {
    key: "brown",
    label: "Brown",
    cssVar: "--brown-color",
    fallback: "#795548",
  },
  {
    key: "light-grey",
    label: "Light grey",
    cssVar: "--light-grey-color",
    fallback: "#bdbdbd",
  },
  { key: "grey", label: "Grey", cssVar: "--grey-color", fallback: "#9e9e9e" },
  {
    key: "dark-grey",
    label: "Dark grey",
    cssVar: "--dark-grey-color",
    fallback: "#616161",
  },
  {
    key: "blue-grey",
    label: "Blue grey",
    cssVar: "--blue-grey-color",
    fallback: "#607d8b",
  },
  {
    key: "black",
    label: "Black",
    cssVar: "--black-color",
    fallback: "#000000",
  },
  {
    key: "white",
    label: "White",
    cssVar: "--white-color",
    fallback: "#ffffff",
  },
];

let ctx: CanvasRenderingContext2D | null | undefined;

/** Any CSS colour (hex, rgb(), a name) to #rrggbb, via a canvas. */
function toHex(css: string, fallback: string): string {
  if (ctx === undefined) {
    ctx = document.createElement("canvas").getContext("2d");
  }
  if (!ctx) return fallback;
  ctx.fillStyle = fallback;
  ctx.fillStyle = css;
  const out = ctx.fillStyle;
  return typeof out === "string" && out.startsWith("#") ? out : fallback;
}

/** The colour's current value in the user's HA theme, as #rrggbb. */
export function resolveColorHex(host: Element, color: PaletteColor): string {
  const raw = getComputedStyle(host).getPropertyValue(color.cssVar).trim();
  return toHex(raw || color.fallback, color.fallback);
}
