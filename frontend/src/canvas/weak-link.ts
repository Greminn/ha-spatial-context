/** Does a Zigbee link read much worse than the walls between its two devices
 * predict? (#29) A weak link that matches what the walls cost is just
 * physics; one far weaker is a sign of something else (interference, a
 * failing radio, a metal cabinet that is not on the plan).
 *
 * This is a deliberately rough model, meant to be tuned against real links:
 * the expected signal is a typical Zigbee transmit power minus free-space
 * loss over the real distance and minus the loss of every wall the straight
 * path crosses (see rf-path.ts). The measured LQI is turned into dBm with a
 * straight line, which is only approximate. It needs the floor's scale to
 * know the real distance, so an uncalibrated floor is never flagged. */

import type { Opening, Scale, Wall } from "../types";
import { distance } from "./geometry";
import { pathLoss } from "./rf-path";

/** A typical Zigbee transmit power, dBm. */
export const ZIGBEE_TX_DBM = 5;
/** Free-space loss at one metre at 2.4 GHz, dB. */
export const LOSS_AT_ONE_METRE_DB = 40;
/** The LQI scale is stretched over this dBm range: 0 reads as the weakest a
 * receiver can hear, 255 as a very strong signal. */
const LQI_MIN_DBM = -100;
const LQI_MAX_DBM = -30;

/** The threshold used until the user sets one, in dB. */
export const DEFAULT_WEAK_LINK_THRESHOLD_DB = 25;

export interface WeakLinkCheck {
  /** How far below the prediction the measured signal is; negative when it
   * is stronger than predicted. */
  gapDb: number;
  predictedDbm: number;
  measuredDbm: number;
  /** What the walls on the straight path cost. */
  wallDb: number;
  distanceM: number;
}

export function lqiToDbm(lqi: number): number {
  const clamped = Math.min(255, Math.max(0, lqi));
  return LQI_MIN_DBM + (clamped / 255) * (LQI_MAX_DBM - LQI_MIN_DBM);
}

/** Stored units per real metre, or null without a usable calibration. */
export function unitsPerMetre(scale: Scale | null): number | null {
  if (!scale || !(scale.meters > 0)) return null;
  const [[x1, y1], [x2, y2]] = scale.points;
  const units = distance(x1, y1, x2, y2);
  return units > 0 ? units / scale.meters : null;
}

export function checkWeakLink(opts: {
  from: [number, number];
  to: [number, number];
  walls: Wall[];
  openings: Opening[];
  scale: Scale | null;
  lqi: number;
}): WeakLinkCheck | null {
  const perMetre = unitsPerMetre(opts.scale);
  if (perMetre === null) return null;
  const distanceM =
    distance(opts.from[0], opts.from[1], opts.to[0], opts.to[1]) / perMetre;
  const wallDb = pathLoss(
    opts.from,
    opts.to,
    opts.walls,
    opts.openings,
  ).totalDb;
  // Closer than a metre reads as a metre: the formula is for the far field.
  const spread = 20 * Math.log10(Math.max(distanceM, 1));
  const predictedDbm = ZIGBEE_TX_DBM - LOSS_AT_ONE_METRE_DB - spread - wallDb;
  const measuredDbm = lqiToDbm(opts.lqi);
  return {
    gapDb: predictedDbm - measuredDbm,
    predictedDbm,
    measuredDbm,
    wallDb,
    distanceM,
  };
}

/** The check, only when it is far enough below the prediction to flag. A
 * threshold of 0 turns the check off. */
export function weakLinkToFlag(
  check: WeakLinkCheck | null,
  thresholdDb: number,
): WeakLinkCheck | null {
  if (!check || thresholdDb <= 0) return null;
  return check.gapDb > thresholdDb ? check : null;
}
