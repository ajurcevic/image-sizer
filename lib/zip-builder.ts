import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ResizeResult } from "./types";

export async function downloadAsZip(results: ResizeResult[]): Promise<void> {
  const zip = new JSZip();

  for (const result of results) {
    const arrayBuffer = await result.blob.arrayBuffer();
    zip.file(result.filename, arrayBuffer);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "resized-images.zip");
}

export function downloadSingleFile(result: ResizeResult): void {
  saveAs(result.blob, result.filename);
}
