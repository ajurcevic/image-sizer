"use client";

import { useState } from "react";
import { SIZE_CATEGORIES, getSizesByCategory } from "@/lib/image-sizes";
import { SizeDefinition } from "@/lib/types";

interface CategorySelectorProps {
  selectedSizeIds: Set<string>;
  onToggleSize: (id: string) => void;
  onToggleCategory: (categoryId: string) => void;
}

export default function CategorySelector({
  selectedSizeIds,
  onToggleSize,
  onToggleCategory,
}: CategorySelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  return (
    <div className="space-y-2 font-mono">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        output sizes
      </h3>
      {SIZE_CATEGORIES.map((category) => {
        const sizes = getSizesByCategory(category.id);
        const allSelected = sizes.every((s) => selectedSizeIds.has(s.id));
        const someSelected = sizes.some((s) => selectedSizeIds.has(s.id));
        const isExpanded = expandedCategories.has(category.id);

        return (
          <div
            key={category.id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                onClick={() => toggleExpand(category.id)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <svg
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <label className="flex flex-1 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={() => onToggleCategory(category.id)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                />
                <span className="text-sm font-medium lowercase text-zinc-700 dark:text-zinc-300">
                  {category.label}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  [{sizes.filter((s) => selectedSizeIds.has(s.id)).length}/{sizes.length}]
                </span>
              </label>
            </div>
            {isExpanded && (
              <div className="border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {sizes.map((size) => (
                    <label
                      key={size.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizeIds.has(size.id)}
                        onChange={() => onToggleSize(size.id)}
                        className="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                      />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {size.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
