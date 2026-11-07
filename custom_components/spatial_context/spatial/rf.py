"""Expected vs. measured signal for every radio link with both ends placed.

A port of the panel's frontend/src/canvas/weak-link.ts, extended to the
other layers and to links between levels:

    predicted_dbm = tx - loss_at_1m - 10 * n * log10(max(d, 1 m))
                    - walls crossed - slabs * slab_loss

With the panel's defaults (tx 5 dBm, 40 dB at 1 m, n = 2.0) and no slabs it
gives the panel's numbers exactly. `n` and the slab loss are settings
(`rf_path_loss_exponent`, `rf_slab_loss_db`; 13 dB is the middle of the
10-17 dB measured through a floor in #27).

The measured value is RSSI in dBm where the layer reports one (Thread
AverageRssi, UniFi signal, BLE) and is then real. Zigbee only reports LQI,
which is vendor-specific and ordinal; it is mapped onto dBm with the panel's
straight line and flagged `measured_kind: "lqi"` so nobody reads it as a
measurement. The model is deliberately rough: it is meant to rank links and
point at the ones far worse than the walls explain, not to plan coverage.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import math
from typing import Any

# weak-link.ts constants.
LOSS_AT_ONE_METRE_DB = 40.0
LQI_MIN_DBM = -100.0
LQI_MAX_DBM = -30.0

DEFAULT_PATH_LOSS_EXPONENT = 2.0
DEFAULT_SLAB_LOSS_DB = 13.0
DEFAULT_WEAK_LINK_THRESHOLD_DB = 25

# Typical transmit power per layer, dBm. Zigbee matches the panel; Thread is
# the same 802.15.4 radio class; a Wi-Fi AP is far stronger.
TX_DBM = {"zigbee": 5.0, "thread": 5.0, "wifi": 20.0, "bluetooth": 0.0}


@dataclass(slots=True)
class RFParams:
    exponent: float = DEFAULT_PATH_LOSS_EXPONENT
    slab_db: float = DEFAULT_SLAB_LOSS_DB
    loss_1m_db: float = LOSS_AT_ONE_METRE_DB

    @classmethod
    def from_settings(cls, settings: dict[str, Any]) -> RFParams:
        exponent = settings.get("rf_path_loss_exponent")
        slab = settings.get("rf_slab_loss_db")
        return cls(
            exponent=float(exponent) if exponent is not None else DEFAULT_PATH_LOSS_EXPONENT,
            slab_db=float(slab) if slab is not None else DEFAULT_SLAB_LOSS_DB,
        )


def lqi_to_dbm(lqi: float) -> float:
    """weak-link.ts lqiToDbm: 0..255 stretched over -100..-30 dBm."""
    clamped = min(255.0, max(0.0, float(lqi)))
    return LQI_MIN_DBM + clamped / 255.0 * (LQI_MAX_DBM - LQI_MIN_DBM)


def predicted_dbm(
    layer: str,
    distance_m: float,
    wall_db: float,
    slabs: int,
    params: RFParams,
) -> float:
    """Expected received signal. Closer than a metre reads as a metre: the
    formula is for the far field (as the panel)."""
    spread = 10 * params.exponent * math.log10(max(distance_m, 1.0))
    return (
        TX_DBM.get(layer, TX_DBM["zigbee"])
        - params.loss_1m_db
        - spread
        - wall_db
        - slabs * params.slab_db
    )


@dataclass(slots=True)
class PairObservation:
    """Every observation of one undirected node pair in one network."""

    layer: str
    network: str
    a: str  # node keys, sorted
    b: str
    kinds: set[str] = field(default_factory=set)
    rssi: list[float] = field(default_factory=list)
    lqi: list[float] = field(default_factory=list)
    thread_lqi: list[int] = field(default_factory=list)
    # node key of a parent, when a parent/child relation was observed
    parent: str | None = None

    def measured(self) -> tuple[float | None, str | None]:
        """The pair's weaker direction (what a route's link cost uses, as
        zigbee_mesh._merge_links), as (dBm, kind)."""
        if self.rssi:
            return min(self.rssi), "rssi"
        if self.lqi:
            return lqi_to_dbm(min(self.lqi)), "lqi"
        return None, "thread_lqi" if self.thread_lqi else None


# Zigbee neighbour-table relationships, as text (ZHA) or Z2M's numbers.
_TARGET_IS_PARENT = {"parent", "Parent", 0}
_TARGET_IS_CHILD = {"child", "Child", 1}


def aggregate_pairs(snapshots: list[Any]) -> list[PairObservation]:
    """Fold the snapshots' directed links into one observation per node pair
    and network, in a stable order."""
    pairs: dict[tuple[str, str, str, str], PairObservation] = {}
    for snap in snapshots:
        for link in snap.links:
            if link.source == link.target:
                continue
            a, b = sorted((link.source, link.target))
            key = (snap.layer, snap.network, a, b)
            obs = pairs.get(key)
            if obs is None:
                obs = pairs[key] = PairObservation(snap.layer, snap.network, a, b)
            obs.kinds.add(link.kind)
            m = link.metrics
            if m.rssi_dbm is not None:
                obs.rssi.append(float(m.rssi_dbm))
            elif m.last_rssi_dbm is not None:
                obs.rssi.append(float(m.last_rssi_dbm))
            lqi = m.lqi_norm if m.lqi_norm is not None else m.lqi
            # Readings at or below 1 are stale Z-Stack entries, not links
            # (zigbee_mesh._STALE_LQI).
            if lqi is not None and lqi > 1:
                obs.lqi.append(float(lqi))
            if m.thread_lqi is not None:
                obs.thread_lqi.append(int(m.thread_lqi))
            relationship = (link.attrs or {}).get("relationship")
            if link.kind == "parent":
                obs.parent = link.target
            elif relationship in _TARGET_IS_PARENT:
                obs.parent = link.target
            elif relationship in _TARGET_IS_CHILD:
                obs.parent = link.source
    return [pairs[k] for k in sorted(pairs)]


def evaluate(
    model: Any,
    obs: PairObservation,
    dev_a: Any,
    dev_b: Any,
    params: RFParams,
) -> dict[str, Any]:
    """One link's report: distance_m, walls[{material, db, opening}],
    wall_db, slabs, predicted_dbm, measured_dbm, measured_kind, gap_db
    (positive = weaker than predicted). Geometry fields are None when the
    ends have no metric relation (`unknown` says why)."""
    measured, kind = obs.measured()
    report: dict[str, Any] = {
        "distance_m": None,
        "walls": [],
        "wall_db": None,
        "slabs": None,
        "predicted_dbm": None,
        "measured_dbm": measured,
        "measured_kind": kind,
        "gap_db": None,
        "unknown": None,
    }
    if dev_a is None or dev_b is None:
        report["unknown"] = "not_an_ha_device"
        return report
    path = model.path(dev_a, dev_b)
    if path is None:
        report["unknown"] = model.path_unknown_reason(dev_a, dev_b)
        return report
    wall_db = sum(c["db"] for c in path["crossings"])
    predicted = predicted_dbm(obs.layer, path["distance_m"], wall_db, path["slabs"], params)
    report.update(
        distance_m=path["distance_m"],
        walls=[
            {"material": c["material"], "db": c["db"], "opening": c["through_opening"]}
            for c in path["crossings"]
        ],
        wall_db=wall_db,
        slabs=path["slabs"],
        predicted_dbm=predicted,
        gap_db=predicted - measured if measured is not None else None,
    )
    return report
