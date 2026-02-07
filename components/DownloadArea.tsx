"use client";

import { ResizeResult } from "@/lib/types";
import { downloadAsZip, downloadSingleFile } from "@/lib/zip-builder";

interface DownloadAreaProps {
  results: ResizeResult[];
}

export default function DownloadArea({ results }: DownloadAreaProps) {
  if (results.length === 0) return null;

  // Server mode returns a single ZIP result
  const isServerZip = results.length === 1 && results[0].sizeId === "server-zip";

  if (isServerZip) {
    return (
      <div className="space-y-3 font-mono">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          download
        </h3>
        <button
          onClick={() => downloadSingleFile(results[0])}
          className="w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
        >
          download zip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          results [{results.length} images]
        </h3>
        <button
          onClick={() => downloadAsZip(results)}
          className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-green-700"
        >
          download all [zip]
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((result) => (
          <div
            key={result.sizeId}
            className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="flex items-center justify-center bg-zinc-50 p-3 dark:bg-zinc-900">
              {result.filename.endsWith(".ico") ? (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-zinc-200 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                  ico
                </div>
              ) : (
                <img
                  src={result.url}
                  alt={result.label}
                  className="max-h-16 max-w-full object-contain"
                />
              )}
            </div>
            <div className="border-t border-zinc-100 px-2 py-1.5 dark:border-zinc-700">
              <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {result.label}
              </p>
              <p className="text-xs text-zinc-400">{result.filename}</p>
              <button
                onClick={() => downloadSingleFile(result)}
                className="mt-1 w-full rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600"
              >
                download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
