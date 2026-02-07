"use client";

interface ImagePreviewProps {
  previewUrl: string;
  dimensions: { width: number; height: number };
  onReset: () => void;
}

export default function ImagePreview({ previewUrl, dimensions, onReset }: ImagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="relative">
        <img
          src={previewUrl}
          alt="Uploaded preview"
          className="mx-auto max-h-64 w-full object-contain"
        />
      </div>
      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 font-mono dark:border-zinc-700">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {dimensions.width} x {dimensions.height} pixels
        </p>
        <button
          onClick={onReset}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
        >
          use another image
        </button>
      </div>
    </div>
  );
}
