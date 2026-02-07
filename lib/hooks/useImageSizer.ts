"use client";

import { useState, useCallback } from "react";
import {
  ProcessingMode,
  ProcessingProgress,
  ResizeResult,
  SizeDefinition,
} from "../types";
import { ALL_SIZES, getSizeById } from "../image-sizes";
import { clientResizeBatch } from "../client-resize";

export function useImageSizer() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [selectedSizeIds, setSelectedSizeIds] = useState<Set<string>>(
    new Set()
  );
  const [customSizes, setCustomSizes] = useState<SizeDefinition[]>([]);
  const [processingMode, setProcessingMode] =
    useState<ProcessingMode>("client");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [results, setResults] = useState<ResizeResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Clean up previous preview URL
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    // Clean up previous result URLs
    setResults((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });

    setError(null);
    setSourceFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Validate dimensions
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setDimensions({ width: w, height: h });
      if (w < 1024 || h < 1024) {
        setError(`Image is ${w}×${h} — 1024×1024 or larger is recommended for best quality.`);
      }
    };
    img.onerror = () => {
      setError("Failed to load image.");
      setDimensions(null);
      setSourceFile(null);
    };
    img.src = url;
  }, []);

  const toggleSize = useCallback((id: string) => {
    setSelectedSizeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    const categorySizes = ALL_SIZES.filter((s) => s.category === categoryId);
    setSelectedSizeIds((prev) => {
      const next = new Set(prev);
      const allSelected = categorySizes.every((s) => next.has(s.id));
      if (allSelected) {
        categorySizes.forEach((s) => next.delete(s.id));
      } else {
        categorySizes.forEach((s) => next.add(s.id));
      }
      return next;
    });
  }, []);

  const addCustomSize = useCallback((width: number, height: number) => {
    const id = `custom-${width}x${height}`;
    const size: SizeDefinition = {
      id,
      label: `Custom ${width}×${height}`,
      width,
      height,
      format: "png",
      filename: `custom-${width}x${height}.png`,
      category: "custom",
    };
    setCustomSizes((prev) => {
      if (prev.some((s) => s.id === id)) return prev;
      return [...prev, size];
    });
    setSelectedSizeIds((prev) => new Set(prev).add(id));
  }, []);

  const removeCustomSize = useCallback((id: string) => {
    setCustomSizes((prev) => prev.filter((s) => s.id !== id));
    setSelectedSizeIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResults((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });
    setSourceFile(null);
    setDimensions(null);
    setSelectedSizeIds(new Set());
    setCustomSizes([]);
    setProgress(null);
    setError(null);
  }, []);

  const generate = useCallback(async () => {
    if (!sourceFile || selectedSizeIds.size === 0) return;

    setIsProcessing(true);
    setError(null);
    // Clean up previous result URLs
    setResults((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });

    try {
      // Collect all selected sizes (preset + custom)
      const allSelectedSizes: SizeDefinition[] = [];
      selectedSizeIds.forEach((id) => {
        const preset = getSizeById(id);
        if (preset) {
          allSelectedSizes.push(preset);
        } else {
          const custom = customSizes.find((s) => s.id === id);
          if (custom) allSelectedSizes.push(custom);
        }
      });

      if (processingMode === "client") {
        const resized = await clientResizeBatch(
          sourceFile,
          allSelectedSizes,
          setProgress
        );
        setResults(resized);
      } else {
        // Server mode
        const formData = new FormData();
        formData.append("image", sourceFile);
        formData.append(
          "sizeIds",
          JSON.stringify(Array.from(selectedSizeIds))
        );

        setProgress({
          current: 0,
          total: 1,
          currentLabel: "Processing on server...",
        });

        const response = await fetch("/api/resize", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Server processing failed");
        }

        const blob = await response.blob();
        // For server mode, we get a ZIP directly — create a single "result"
        setResults([
          {
            sizeId: "server-zip",
            label: "All Resized Images (ZIP)",
            filename: "resized-images.zip",
            blob,
            url: URL.createObjectURL(blob),
            width: 0,
            height: 0,
          },
        ]);

        setProgress({ current: 1, total: 1, currentLabel: "Done" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  }, [sourceFile, selectedSizeIds, customSizes, processingMode]);

  return {
    sourceFile,
    previewUrl,
    dimensions,
    selectedSizeIds,
    customSizes,
    processingMode,
    isProcessing,
    progress,
    results,
    error,
    handleFileSelect,
    toggleSize,
    toggleCategory,
    addCustomSize,
    removeCustomSize,
    setProcessingMode,
    reset,
    generate,
  };
}
