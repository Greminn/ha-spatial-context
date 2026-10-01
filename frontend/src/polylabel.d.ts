declare module "polylabel" {
  /** Mapbox polylabel — the pole of inaccessibility (the interior point
   * farthest from the polygon's edges) of `polygon`, a list of rings. */
  export default function polylabel(
    polygon: number[][][],
    precision?: number,
  ): [number, number] & { distance: number };
}
