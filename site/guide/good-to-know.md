---
title: Good to Know
---

# Good to Know

This page lists the current limits of Spatial Context and how the panel behaves after an update.

## Status

Spatial Context is a beta. Every release is a pre-release. The interface may still change between releases, and it has not been tested against the range of Home Assistant setups a stable release needs to cover.

## Not Built Yet

- An RF coverage heatmap with repeater suggestions.
- Flagging links whose measured signal is worse than the walls predict.
- Further integrations for the Connectivity Map beyond those listed in [Requirements by Feature](/guide/install#requirements-by-feature).

## Limits

- ZHA support for the Zigbee layer is new and has had little testing on real ZHA networks. Report what it shows.
- Wall loss figures are approximate 2.4 GHz values. See [Wall Materials](/guide/wall-materials).
- The German translation is machine-drafted. Corrections are welcome as a pull request or an issue against `frontend/src/translations/de.json`. Untranslated strings fall back to English.

## After Updating

The panel compares itself with the installed version each time it opens and whenever its tab regains focus.

| Banner | Meaning |
|---|---|
| Restart Home Assistant | Home Assistant has not restarted since the update. Some changes cannot be saved until it does. |
| Reload the page | The browser is running an older copy of the panel. |

## Language

The panel follows the language of the Home Assistant user profile. English and German are included.

## Stored Data

Layouts are stored by Home Assistant, separately from the integration files, so updates keep them. **⋮ → Export JSON** downloads a copy as [map data](/ai/map-data).
