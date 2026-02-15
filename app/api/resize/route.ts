import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";
import { getSizeById } from "@/lib/image-sizes";
import { serverResizeBatch } from "@/lib/server-resize";
import { SizeDefinition } from "@/lib/types";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const sizeIdsJson = formData.get("sizeIds") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!sizeIdsJson) {
      return NextResponse.json({ error: "No sizes selected" }, { status: 400 });
    }

    const sizeIds: string[] = JSON.parse(sizeIdsJson);
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate image is readable
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Could not read image dimensions" },
        { status: 400 }
      );
    }

    // Resolve size definitions
    const sizes: SizeDefinition[] = [];
    const failedIds: string[] = [];

    for (const id of sizeIds) {
      if (id.startsWith("custom-")) {
        const match = id.match(/^custom-(\d+)x(\d+)$/);
        if (match) {
          const w = parseInt(match[1], 10);
          const h = parseInt(match[2], 10);
          sizes.push({
            id,
            label: `Custom ${w}x${h}`,
            width: w,
            height: h,
            format: "png" as const,
            filename: `custom-${w}x${h}.png`,
            category: "custom",
          });
          continue;
        }
      }

      const preset = getSizeById(id);
      if (preset) {
        sizes.push(preset);
      } else {
        failedIds.push(id);
      }
    }

    if (sizes.length === 0) {
      return NextResponse.json(
        { error: `No valid sizes selected${failedIds.length > 0 ? `. Unrecognized size IDs: ${failedIds.join(", ")}` : ""}` },
        { status: 400 }
      );
    }

    const results = await serverResizeBatch(buffer, sizes);

    // Build ZIP
    const zip = new JSZip();
    for (const result of results) {
      zip.file(result.filename, result.data);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="resized-images.zip"',
      },
    });
  } catch (err) {
    console.error("Resize API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
