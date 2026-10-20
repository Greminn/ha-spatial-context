---
title: Wall Materials
---

# Wall Materials

Each wall has a material and a thickness, which give its estimated signal loss.

The loss is the material's rate per centimetre multiplied by the thickness. It appears in the [map data](/ai/map-data) as `attenuation_db`.

| Material | Loss (dB/cm) | Default Thickness |
|---|---|---|
| Timber Framed (Drywall) | 0.3 | 10 cm |
| Brick Veneer | 0.55 | 11 cm |
| Concrete / Block | 0.6 | 20 cm |
| Aerated / Foam Concrete Block (Plastered) | 0.37 | 13 cm |
| Ceramic / Poroton Block | 0.42 | 25 cm |
| Glass | 2.0 | 1 cm |
| Steel Frame | 1.0 | 10 cm |

::: warning
The rates are approximate 2.4 GHz figures. They are suitable for reasoning about a layout, not for RF engineering.
:::

Select a wall to set its material and thickness on its info card.
