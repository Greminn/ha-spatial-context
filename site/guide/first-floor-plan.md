---
title: Your First Floor Plan
---

# Your First Floor Plan

This walkthrough builds one floor: a background image, a scale, rooms, walls and a placed device.

Prepare an image of the floor plan as a PNG, JPEG or GIF. A PDF has to be rasterised first:

```sh
pdftoppm -png -r 150 your-floor-plan.pdf your-floor-plan
```

## 1. Add the Background

1. Open **Spatial Context** and select a floor tab.
2. Select **Background** and upload the image, or drag the file onto the canvas.

## 2. Set the Scale

1. Select **Set Scale**.
2. Click two points a known distance apart.
3. Enter the distance.

::: warning
Set the scale before anything else. Positions, distances and wall lengths are only given in real units on a calibrated floor. An uncalibrated floor shows **Not Calibrated** in place of the scale bar, and the export returns `null` for every metric value.
:::

## 3. Trace Rooms and Walls

1. Select **Trace Room**, click each corner, then click near the start to close the outline.
2. Select the room and set its name and Home Assistant area.
3. Select **Trace Wall** and click along each wall. Select **Finish Wall** or press **Enter** to end the run.
4. Select each wall and set its [material and thickness](/guide/wall-materials).
5. Select **Add Door** or **Add Window** and click a traced wall.

## 4. Place a Device

1. Select **Place Device**.
2. Select a device in the picker, then click the plan.

See [Placing Devices](/guide/placing-devices).

## 5. Repeat for Other Floors

Repeat the steps for each floor. Floors that sit directly above one another are put in one coordinate system with **Align Floors**. Links between floors depend on it.

Place buildings and outdoor devices on the **Property** tab. See [The Property Tab](/guide/property-tab).

Changes save a few seconds after each edit when **Auto-Save Changes** is on.
