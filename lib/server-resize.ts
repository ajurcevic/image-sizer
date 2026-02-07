import sharp from "sharp";
import toIco from "@catdad/to-ico";
import { SizeDefinition, ResizeResult } from "./types";

async function resizeSingle(
  buffer: Buffer,
  size: SizeDefinition
): Promise<{ filename: string; data: Buffer }> {
  if (size.format === "ico" && size.icoSizes) {
    const pngBuffers: Buffer[] = [];
    for (const s of size.icoSizes) {
      const png = await sharp(buffer)
        .resize(s, s, { fit: "cover", position: "centre", kernel: "lanczos3" })
        .png()
        .toBuffer();
      pngBuffers.push(png);
    }
    const icoBuffer = await toIco(pngBuffers);
    return { filename: size.filename, data: Buffer.from(icoBuffer) };
  }

  let pipeline = sharp(buffer);

  if (size.maskable) {
    // Resize to 80% of target, then composite on white background
    const innerW = Math.round(size.width * 0.8);
    const innerH = Math.round(size.height * 0.8);
    const inner = await pipeline
      .resize(innerW, innerH, { fit: "cover", position: "centre", kernel: "lanczos3" })
      .png()
      .toBuffer();

    const result = await sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: inner, gravity: "centre" }])
      .png()
      .toBuffer();

    return { filename: size.filename, data: result };
  }

  const result = await pipeline
    .resize(size.width, size.height, { fit: "cover", position: "centre", kernel: "lanczos3" })
    .png()
    .toBuffer();

  return { filename: size.filename, data: result };
}

export async function serverResizeBatch(
  buffer: Buffer,
  sizes: SizeDefinition[]
): Promise<{ filename: string; data: Buffer }[]> {
  const results: { filename: string; data: Buffer }[] = [];

  for (const size of sizes) {
    try {
      const result = await resizeSingle(buffer, size);
      results.push(result);
    } catch (err) {
      console.error(`Server resize failed for ${size.label}:`, err);
    }
  }

  return results;
}
