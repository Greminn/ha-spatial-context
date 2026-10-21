---
title: The Map Data
---

# The Map Data

`spatial_context.get_map` and **⋮ → Export JSON** return the same document: floors, rooms, walls, openings and placed devices.

Trimmed, it looks like this:

```json
{
  "exported_at": "2026-10-11T08:30:00+00:00",
  "floors": [
    {
      "floor_id": "top_floor",
      "name": "Top Floor",
      "meters_per_unit": 0.016,
      "rooms": [
        {
          "id": "…",
          "name": "Lounge",
          "devices": [
            {
              "device_id": "…",
              "entity_id": "light.lounge_light",
              "name": "Lounge Light",
              "domain": "light",
              "area_name": "Lounge",
              "x_m": 4.2,
              "y_m": 3.1,
              "height_m": 2.4
            }
          ]
        }
      ],
      "walls": [
        {
          "material": "concrete_block",
          "thickness_cm": 20,
          "attenuation_db": 12.0,
          "points_m": [[0.0, 0.0], [6.1, 0.0]],
          "openings": [{ "type": "door", "width_m": 0.9 }]
        }
      ]
    }
  ],
  "property_meters_per_unit": 0.05,
  "outdoor_devices": []
}
```

## Units

Metric values (`x_m`, `y_m`, `points_m`, `width_m`) are in metres once the floor is calibrated, and empty (`null` in the JSON) until then. Each device also carries its raw `x` and `y`.

## Signal Loss

`attenuation_db` is the wall's [material rate](/guide/wall-materials) multiplied by its thickness.

## Outdoor Devices

Devices outside every building are listed in `outdoor_devices`. They have real-world positions once a placed building has a calibrated floor. See [Scale](/guide/property-tab#scale).
