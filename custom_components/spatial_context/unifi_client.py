"""Read fields of an aiounifi client object (UniFi Network integration internals)."""

from __future__ import annotations

from typing import Any


def unifi_client_value(client: Any, raw_key: str, *attributes: str) -> Any:
    """One field of an aiounifi client: its raw controller dict first, then
    the given attribute names.

    aiounifi's typed properties don't use the controller's key names (the
    AP is `access_point_mac`, not `ap_mac`), and they change between
    versions, so the raw dict the controller sent is the stable source.
    """
    raw = getattr(client, "raw", None)
    if isinstance(raw, dict) and raw.get(raw_key) not in (None, ""):
        return raw[raw_key]
    for attribute in attributes or (raw_key,):
        value = getattr(client, attribute, None)
        if value not in (None, ""):
            return value
    return None
