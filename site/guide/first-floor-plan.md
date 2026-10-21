---
title: Your First Floor Plan
---

# Your First Floor Plan

This walkthrough builds one floor: a background image, a scale, rooms, walls and a placed device.

![A floor with nothing on it yet: the tools along the top, and Not calibrated at the bottom left](/screenshots/walkthrough-1-empty-floor-v3.jpeg)

Prepare an image of the floor plan as a PNG, JPEG or GIF. Crop it close to the plan and keep it straight on, so the walls run square to the edges. If the plan is a PDF, save it as an image first:

- **Mac:** open the PDF in Preview, then select **File → Export** and set the format to PNG or JPEG.
- **Windows:** open the PDF, capture the page with the Snipping Tool and save it as a PNG.
- **Any computer:** use a free online PDF to PNG converter, or take a clear screenshot or photo of the plan.

::: details Command line
`pdftoppm` is part of [Poppler](https://poppler.freedesktop.org/). Install it with `brew install poppler` on a Mac, or `sudo apt install poppler-utils` on Debian and Ubuntu. It converts each page of a PDF to a PNG at 150 dpi:

```sh
pdftoppm -png -r 150 your-floor-plan.pdf your-floor-plan
```
:::

## 1. Add the Background

1. Open **Spatial Context** and select a floor tab.
2. Select **Background** and upload the image, or drag the file onto the canvas.

![The floor plan image added as the background, still showing Not calibrated](/screenshots/walkthrough-2-background-v3.jpeg)

## 2. Set the Scale

1. Select **Set Scale**.
2. Click two points a known distance apart.
3. Enter the distance, in metres or feet to match the **Units** setting.

![The distance box, asking for the real-world distance between the two points](/screenshots/walkthrough-3-distance-v3.jpeg)

![The scale set: the measured line stays on the plan, labelled with its distance, and the scale bar replaces Not calibrated](/screenshots/walkthrough-3-scale-set-v3.jpeg)

::: warning
Set the scale before anything else. Positions, distances and wall lengths are only given in real units on a calibrated floor. An uncalibrated floor shows **Not calibrated** in place of the scale bar, and the export leaves every value in metres empty.
:::

## 3. Trace Rooms and Walls

1. Select **Trace Room**, click each corner, then click near the start to close the outline.

![Tracing a room: the hint "Click near the start to close the room", the Snap menu and Cancel in the controls row, and the corners placed so far](/screenshots/tracing-room-v3.jpeg)

2. Select the room and set its name and Home Assistant area.

![A room selected, with its card open to set the area and name](/screenshots/room-card-v3.jpeg)

3. Select **Trace Wall** and click along each wall. Select **Finish Wall** or press **Enter** to end the run.
4. Select each wall and set its [material and thickness](/guide/wall-materials).
5. Select **Add Door** or **Add Window** and click a traced wall.

![A door added to a wall and selected, with its card showing the width](/screenshots/door-v3.jpeg)

The panel helps as you draw:

- A hint in the controls row says what the next click does.
- A new point snaps onto nearby walls and room edges, so shapes meet cleanly. The **Snap** menu limits this to walls only or rooms only, or turns it off. Hold **Shift** to place one point without snapping.
- A point lines up horizontally or vertically with the one before it, and with the first point when you close a shape. A guide line shows when it has locked on.
- **Backspace** removes the last point, and **Esc** cancels the trace.

![Tracing a wall: the hint, the Snap menu, and the Finish wall and Cancel buttons in the controls row, and a guide line where the next point lines up](/screenshots/tracing-v3.jpeg)

See [Using the Panel](/guide/using-the-panel#tools) for every tool and shortcut.

## 4. Place a Device

1. Select **Place Device**.
2. Select a device in the picker, then click the plan.

![A device placed on the plan, with its card open and the Place device list beside it](/screenshots/walkthrough-5-placed-device-v3.jpeg)

See [Placing Devices](/guide/placing-devices).

## 5. Repeat for Other Floors

Repeat the steps for each floor. Floors that sit directly above one another are put in one coordinate system with **Align Floors**. Links between floors depend on it.

Place buildings and outdoor devices on the **Property** tab. See [The Property Tab](/guide/property-tab).

Changes save a few seconds after each edit when **Auto-Save Changes** is on.
