/** Background sources beyond plain PNG/JPEG/GIF: PDF (page 1, rendered by
 * the lazily loaded pdf.js module in www/pdf/) and SVG (rasterized through
 * an <img> and a canvas), both turned into a PNG before the same image
 * upload. Home Assistant's image store only serves raster images, and a
 * PNG keeps a line drawing crisp. The size and parsing helpers are pure
 * and unit tested; the rendering needs a real browser. */

export type BackgroundKind = "raster" | "svg" | "pdf";

const RASTER_TYPES = new Set(["image/png", "image/jpeg", "image/gif"]);
const RASTER_EXTENSIONS = /\.(png|jpe?g|gif)$/i;

/** Longest side of a rasterized PDF/SVG background. Big enough to zoom
 * into a floor plan, small enough to upload and draw quickly. */
export const MAX_RASTER_EDGE = 4096;
/** A vector drawing with a tiny nominal size still gets this much. */
export const MIN_RASTER_EDGE = 2048;
/** Re-render smaller past this many bytes (HA's upload limit is larger;
 * this keeps the panel quick). */
export const MAX_UPLOAD_BYTES = 9 * 1024 * 1024;

/** What kind of background a picked or dropped file is, or null if it
 * can't be one. The MIME type first; the extension for browsers that hand
 * over an empty type (common for SVG and PDF drag-and-drop). */
export function classifyBackgroundFile(file: {
  type: string;
  name: string;
}): BackgroundKind | null {
  const type = file.type.toLowerCase();
  if (RASTER_TYPES.has(type)) return "raster";
  if (type === "image/svg+xml") return "svg";
  if (type === "application/pdf") return "pdf";
  if (type === "" || type === "application/octet-stream") {
    if (RASTER_EXTENSIONS.test(file.name)) return "raster";
    if (/\.svg$/i.test(file.name)) return "svg";
    if (/\.pdf$/i.test(file.name)) return "pdf";
  }
  return null;
}

/** The <input accept> list matching classifyBackgroundFile. */
export const BACKGROUND_ACCEPT =
  "image/png,image/jpeg,image/gif,image/svg+xml,.svg,application/pdf,.pdf";

/** Pixel size to rasterize a `width` x `height` drawing at: scaled so the
 * longer side is between MIN and MAX, aspect kept. */
export function rasterSize(
  width: number,
  height: number,
  maxEdge = MAX_RASTER_EDGE,
  minEdge = MIN_RASTER_EDGE,
): { width: number; height: number } {
  if (!(width > 0) || !(height > 0)) return { width: minEdge, height: minEdge };
  const long = Math.max(width, height);
  const target = Math.min(maxEdge, Math.max(minEdge, long));
  const k = target / long;
  return {
    width: Math.max(1, Math.round(width * k)),
    height: Math.max(1, Math.round(height * k)),
  };
}

/** A length attribute in user units (px). Percentages and unknown units
 * give null. */
function svgLength(value: string | undefined): number | null {
  if (!value) return null;
  const m = /^\s*([0-9.]+(?:e[-+]?\d+)?)\s*(px|pt|mm|cm|in)?\s*$/i.exec(value);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = (m[2] ?? "px").toLowerCase();
  const perPx: Record<string, number> = {
    px: 1,
    pt: 4 / 3,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    in: 96,
  };
  return Number.isFinite(n) && n > 0 ? n * perPx[unit]! : null;
}

function rootTag(svgText: string): { tag: string; start: number } | null {
  // Comments blanked out (same length, so offsets still match) so an
  // "<svg" inside one is not taken for the root.
  const masked = svgText.replace(/<!--[\s\S]*?-->/g, (m) =>
    " ".repeat(m.length),
  );
  const start = masked.search(/<svg[\s>]/i);
  if (start < 0) return null;
  const end = masked.indexOf(">", start);
  if (end < 0) return null;
  return { tag: svgText.slice(start, end + 1), start };
}

function attr(tag: string, name: string): string | undefined {
  const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(
    tag,
  );
  return m ? (m[2] ?? m[3]) : undefined;
}

/** The SVG's own size: width/height, else its viewBox. Null when it
 * states neither (the browser would draw it at 300x150). */
export function svgIntrinsicSize(
  svgText: string,
): { width: number; height: number } | null {
  const root = rootTag(svgText);
  if (!root) return null;
  const w = svgLength(attr(root.tag, "width"));
  const h = svgLength(attr(root.tag, "height"));
  const vb = attr(root.tag, "viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const vbOk = vb && vb.length === 4 && vb[2]! > 0 && vb[3]! > 0;
  if (w && h) return { width: w, height: h };
  if (vbOk) {
    const ratio = vb[3]! / vb[2]!;
    if (w) return { width: w, height: w * ratio };
    if (h) return { width: h / ratio, height: h };
    return { width: vb[2]!, height: vb[3]! };
  }
  return null;
}

/** The SVG with its root width/height set to exactly this many pixels, so
 * an <img> draws it at that resolution instead of its nominal size. Adds
 * a viewBox from the old size when it had none, so it scales rather than
 * crops. */
export function withSvgSize(
  svgText: string,
  width: number,
  height: number,
): string {
  const root = rootTag(svgText);
  if (!root) return svgText;
  let tag = root.tag;
  const size = svgIntrinsicSize(svgText);
  if (!attr(tag, "viewBox") && size) {
    tag = tag.replace(
      /^<svg/i,
      `<svg viewBox="0 0 ${size.width} ${size.height}"`,
    );
  }
  tag = tag
    .replace(/\swidth\s*=\s*("[^"]*"|'[^']*')/i, "")
    .replace(/\sheight\s*=\s*("[^"]*"|'[^']*')/i, "")
    .replace(/^<svg/i, `<svg width="${width}" height="${height}"`);
  // preserveAspectRatio defaults to xMidYMid meet, so a mismatched ratio
  // letterboxes rather than distorts.
  return (
    svgText.slice(0, root.start) +
    tag +
    svgText.slice(root.start + root.tag.length)
  );
}

/** A file name for the uploaded PNG: same stem, .png. */
export function pngName(name: string): string {
  const stem = name.replace(/\.[^./\\]+$/, "") || "background";
  return `${stem}.png`;
}

// --- browser-only rendering ----------------------------------------------

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode a PNG")),
      "image/png",
    ),
  );
}

/** Draws at the given size, then shrinks until the PNG is small enough. */
async function renderToPng(
  size: { width: number; height: number },
  draw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => Promise<void>,
): Promise<Blob> {
  let { width, height } = size;
  for (let attempt = 0; ; attempt++) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available");
    // Transparent areas would show as black once the dark theme inverts
    // the plan; a white sheet is what a printed plan has anyway.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    await draw(ctx, width, height);
    const blob = await canvasToPng(canvas);
    if (blob.size <= MAX_UPLOAD_BYTES || attempt >= 4) return blob;
    width = Math.round(width * 0.75);
    height = Math.round(height * 0.75);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read the SVG"));
    img.src = url;
  });
}

/** SVG → PNG through an <img> (scripts and external resources in it are
 * ignored, as for any SVG drawn as an image). */
export async function rasterizeSvg(file: File): Promise<File> {
  const text = await file.text();
  const nominal = svgIntrinsicSize(text) ?? { width: 1000, height: 1000 };
  const size = rasterSize(nominal.width, nominal.height);
  const blob = await renderToPng(size, async (ctx, width, height) => {
    const sized = withSvgSize(text, width, height);
    const url = URL.createObjectURL(
      new Blob([sized], { type: "image/svg+xml" }),
    );
    try {
      const img = await loadImage(url);
      ctx.drawImage(img, 0, 0, width, height);
    } finally {
      URL.revokeObjectURL(url);
    }
  });
  return new File([blob], pngName(file.name), { type: "image/png" });
}

/** What the lazily loaded pdf module (src/pdf/pdf-glue.ts, built into
 * www/pdf/) exports. */
export interface PdfGlueModule {
  firstPageSize(data: ArrayBuffer): Promise<{ width: number; height: number }>;
  renderFirstPage(
    data: ArrayBuffer,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ): Promise<void>;
}

/** PDF page 1 → PNG with pdf.js, loaded on first use only. */
export async function renderPdf(
  file: File,
  loadGlue: () => Promise<PdfGlueModule>,
): Promise<File> {
  const glue = await loadGlue();
  const data = await file.arrayBuffer();
  // pdf.js may transfer (detach) the buffer it is given, so each call
  // gets its own copy.
  const page = await glue.firstPageSize(data.slice(0));
  const size = rasterSize(page.width, page.height);
  const blob = await renderToPng(size, (ctx, width, height) =>
    glue.renderFirstPage(data.slice(0), ctx, width, height),
  );
  return new File([blob], pngName(file.name), { type: "image/png" });
}

/** Turns any accepted background file into an uploadable raster image. */
export async function toUploadableImage(
  file: File,
  loadPdfGlue: () => Promise<PdfGlueModule>,
): Promise<File | null> {
  switch (classifyBackgroundFile(file)) {
    case "raster":
      return file;
    case "svg":
      return rasterizeSvg(file);
    case "pdf":
      return renderPdf(file, loadPdfGlue);
    default:
      return null;
  }
}

/** Background rotation, normalized to (-180, 180]. */
export function normalizeRotation(deg: number): number {
  if (!Number.isFinite(deg)) return 0;
  let r = deg % 360;
  if (r > 180) r -= 360;
  if (r <= -180) r += 360;
  return Math.round(r * 10) / 10;
}

// --- camera snapshots ----------------------------------------------------

/** Camera names that are usually a robot vacuum's map rather than a
 * video feed — listed first. */
const MAP_CAMERA =
  /map|vacuum|robot|valetudo|roborock|narwal|dreame|xiaomi|ecovacs|roomba/i;

/** Every camera.* entity, map-like ones first, then by name. */
export function cameraEntities(
  states: Record<string, { attributes: Record<string, unknown> } | undefined>,
): { entityId: string; name: string; isMap: boolean }[] {
  return Object.keys(states)
    .filter((id) => id.startsWith("camera.") && states[id])
    .map((entityId) => {
      const friendly = states[entityId]!.attributes["friendly_name"];
      const name =
        typeof friendly === "string" && friendly ? friendly : entityId;
      return { entityId, name, isMap: MAP_CAMERA.test(`${entityId} ${name}`) };
    })
    .sort(
      (a, b) =>
        Number(b.isMap) - Number(a.isMap) || a.name.localeCompare(b.name),
    );
}

/** The path HA serves a camera's current still image on. */
export function cameraProxyPath(entityId: string): string {
  return `/api/camera_proxy/${encodeURIComponent(entityId)}`;
}

/** A camera snapshot as an uploadable image file: PNG/JPEG/GIF as is,
 * anything else (WebP, say) redrawn into a PNG. */
export async function snapshotToFile(
  blob: Blob,
  entityId: string,
): Promise<File> {
  const stem = entityId.replace(/^camera\./, "") || "camera";
  const type = blob.type.split(";")[0]!.trim().toLowerCase();
  if (RASTER_TYPES.has(type)) {
    const ext = type === "image/jpeg" ? "jpg" : type.slice("image/".length);
    return new File([blob], `${stem}.${ext}`, { type });
  }
  const bitmap = await createImageBitmap(blob);
  try {
    const out = await renderToPng(
      { width: bitmap.width, height: bitmap.height },
      async (ctx) => {
        ctx.drawImage(bitmap, 0, 0);
      },
    );
    return new File([out], `${stem}.png`, { type: "image/png" });
  } finally {
    bitmap.close();
  }
}
