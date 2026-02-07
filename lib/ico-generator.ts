import { encode as encodeIco } from "ico-endec";

export async function generateIco(pngBlobs: Blob[]): Promise<Blob> {
  const buffers: ArrayBuffer[] = [];
  for (const blob of pngBlobs) {
    buffers.push(await blob.arrayBuffer());
  }
  const icoBuffer = encodeIco(buffers);
  return new Blob([icoBuffer.buffer as ArrayBuffer], { type: "image/x-icon" });
}
