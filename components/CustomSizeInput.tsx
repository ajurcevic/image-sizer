"use client";

import { useState } from "react";
import { SizeDefinition } from "@/lib/types";

interface CustomSizeInputProps {
  customSizes: SizeDefinition[];
  onAddCustomSize: (width: number, height: number) => void;
  onRemoveCustomSize: (id: string) => void;
}

export default function CustomSizeInput({
  customSizes,
  onAddCustomSize,
  onRemoveCustomSize,
}: CustomSizeInputProps) {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const handleAdd = () => {
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (w > 0 && h > 0 && w <= 4096 && h <= 4096) {
      onAddCustomSize(w, h);
      setWidth("");
      setHeight("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="space-y-2 font-mono">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        custom size
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          onKeyDown={handleKeyDown}
          min={1}
          max={4096}
          className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
        />
        <span className="text-zinc-400">x</span>
        <input
          type="number"
          placeholder="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onKeyDown={handleKeyDown}
          min={1}
          max={4096}
          className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={!width || !height}
        >
          add
        </button>
      </div>
      {customSizes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customSizes.map((size) => (
            <span
              key={size.id}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {size.width}×{size.height}
              <button
                onClick={() => onRemoveCustomSize(size.id)}
                className="ml-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
