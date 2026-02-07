import { SizeDefinition, ResizeResult, ProcessingProgress } from "./types";
import { generateIco } from "./ico-generator";

function resizeImageToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  maskable: boolean
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d")!;

  if (maskable) {
    // Maskable: white background, image at 80% centered (safe zone)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const iconSize = Math.round(targetWidth * 0.8);
    const iconSizeH = Math.round(targetHeight * 0.8);
    const offsetX = Math.round((targetWidth - iconSize) / 2);
    const offsetY = Math.round((targetHeight - iconSizeH) / 2);

    // Cover fit within the 80% area
    const srcAspect = img.naturalWidth / img.naturalHeight;
    const dstAspect = iconSize / iconSizeH;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (srcAspect > dstAspect) {
      sw = Math.round(img.naturalHeight * dstAspect);
      sx = Math.round((img.naturalWidth - sw) / 2);
    } else {
      sh = Math.round(img.naturalWidth / dstAspect);
      sy = Math.round((img.naturalHeight - sh) / 2);
    }

    ctx.drawImage(img, sx, sy, sw, sh, offsetX, offsetY, iconSize, iconSizeH);
  } else {
    // Cover fit: center-crop
    const srcAspect = img.naturalWidth / img.naturalHeight;
    const dstAspect = targetWidth / targetHeight;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (srcAspect > dstAspect) {
      sw = Math.round(img.naturalHeight * dstAspect);
      sx = Math.round((img.naturalWidth - sw) / 2);
    } else {
      sh = Math.round(img.naturalWidth / dstAspect);
      sy = Math.round((img.naturalHeight - sh) / 2);
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  }

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      "image/png"
    );
  });
}

async function resizeSingle(
  img: HTMLImageElement,
  size: SizeDefinition
): Promise<ResizeResult> {
  if (size.format === "ico" && size.icoSizes) {
    // Generate multiple PNG canvases, then create ICO
    const pngBlobs: Blob[] = [];
    for (const s of size.icoSizes) {
      const canvas = resizeImageToCanvas(img, s, s, false);
      const blob = await canvasToBlob(canvas);
      pngBlobs.push(blob);
    }
    const icoBlob = await generateIco(pngBlobs);
    return {
      sizeId: size.id,
      label: size.label,
      filename: size.filename,
      blob: icoBlob,
      url: URL.createObjectURL(icoBlob),
      width: size.width,
      height: size.height,
    };
  }

  const canvas = resizeImageToCanvas(img, size.width, size.height, !!size.maskable);
  const blob = await canvasToBlob(canvas);
  return {
    sizeId: size.id,
    label: size.label,
    filename: size.filename,
    blob,
    url: URL.createObjectURL(blob),
    width: size.width,
    height: size.height,
  };
}

export async function clientResizeBatch(
  file: File,
  sizes: SizeDefinition[],
  onProgress?: (progress: ProcessingProgress) => void
): Promise<ResizeResult[]> {
  const img = await loadImage(file);
  const results: ResizeResult[] = [];

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    onProgress?.({
      current: i,
      total: sizes.length,
      currentLabel: size.label,
    });

    try {
      const result = await resizeSingle(img, size);
      results.push(result);
    } catch (err) {
      console.error(`Failed to resize ${size.label}:`, err);
    }
  }

  onProgress?.({
    current: sizes.length,
    total: sizes.length,
    currentLabel: "Done",
  });

  return results;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
