"use client";

import { ProcessingProgress } from "@/lib/types";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
  progress: ProcessingProgress | null;
}

export default function GenerateButton({
  onClick,
  disabled,
  isProcessing,
  progress,
}: GenerateButtonProps) {
  return (
    <div className="space-y-2 font-mono">
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "processing..." : "generate images"}
      </button>
      {isProcessing && progress && (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            {progress.currentLabel} [{progress.current}/{progress.total}]
          </p>
        </div>
      )}
    </div>
  );
}
