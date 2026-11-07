// The legacy build carries the polyfills older Safari / WebViews (the HA
// companion app on an older iPad) need; the modern build needs Safari 17.4+.
import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PdfGlueModule } from "../background-file";

/** The PDF module: pdf.js plus the two calls the panel needs, built
 * separately into www/pdf/ (see rollup.config.js) and imported only when
 * someone picks a PDF background, so pdf.js stays out of the panel bundle.
 * The worker and the image-decoder wasm files sit beside this file. */

const here = new URL(".", import.meta.url).href;
GlobalWorkerOptions.workerSrc = `${here}pdf.worker.min.mjs`;

function open(data: ArrayBuffer) {
  return getDocument({
    data: new Uint8Array(data),
    // JBIG2 (scanned B/W plans) and JPEG 2000 decoders.
    wasmUrl: `${here}wasm/`,
    // A plan is a drawing: no forms.
    enableXfa: false,
  });
}

/** Page 1's size in PDF points (1/72 in), rotation applied. */
export const firstPageSize: PdfGlueModule["firstPageSize"] = async (data) => {
  const task = open(data);
  try {
    const doc = await task.promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    return { width: viewport.width, height: viewport.height };
  } finally {
    await task.destroy();
  }
};

/** Draws page 1 to fill `width` x `height` of the context. */
export const renderFirstPage: PdfGlueModule["renderFirstPage"] = async (
  data,
  ctx,
  width,
  height,
) => {
  const task = open(data);
  try {
    const doc = await task.promise;
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(width / base.width, height / base.height);
    const viewport = page.getViewport({ scale });
    await page.render({
      canvas: null,
      canvasContext: ctx,
      viewport,
      background: "#ffffff",
    }).promise;
  } finally {
    await task.destroy();
  }
};
