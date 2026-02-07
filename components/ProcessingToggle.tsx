"use client";

import { ProcessingMode } from "@/lib/types";

interface ProcessingToggleProps {
  mode: ProcessingMode;
  onChange: (mode: ProcessingMode) => void;
}

export default function ProcessingToggle({ mode, onChange }: ProcessingToggleProps) {
  return (
    <div className="flex items-center gap-2 font-mono">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">processing:</span>
      <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => onChange("client")}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === "client"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          } rounded-l-lg`}
        >
          client
        </button>
        <button
          onClick={() => onChange("server")}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            mode === "server"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          } rounded-r-lg`}
        >
          server
        </button>
      </div>
    </div>
  );
}
