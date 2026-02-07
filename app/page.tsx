"use client";

import { useImageSizer } from "@/lib/hooks/useImageSizer";
import AppLogo from "@/components/AppLogo";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import CategorySelector from "@/components/CategorySelector";
import CustomSizeInput from "@/components/CustomSizeInput";
import ProcessingToggle from "@/components/ProcessingToggle";
import GenerateButton from "@/components/GenerateButton";
import DownloadArea from "@/components/DownloadArea";

export default function Home() {
  const {
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
  } = useImageSizer();

  return (
    <div className="min-h-screen font-mono bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <AppLogo className="h-8 w-8" />
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              image sizer
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {sourceFile && (
              <button
                onClick={reset}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                reset
              </button>
            )}
            <ProcessingToggle mode={processingMode} onChange={setProcessingMode} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Steps */}
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="text-zinc-700 dark:text-zinc-300">1.</span> upload image
          <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">2.</span> select output sizes
          <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">3.</span> generate
        </p>

        {/* Error */}
        {error && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            error.includes("recommended")
              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
          }`}>
            {error}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Upload + Preview */}
          <div className="space-y-4">
            <ImageUploader
              onFileSelect={handleFileSelect}
              hasImage={!!sourceFile}
            />
            {previewUrl && dimensions && (
              <ImagePreview
                previewUrl={previewUrl}
                dimensions={dimensions}
                onReset={reset}
              />
            )}
          </div>

          {/* Right: Size Selection */}
          <div className="space-y-6">
            <CategorySelector
              selectedSizeIds={selectedSizeIds}
              onToggleSize={toggleSize}
              onToggleCategory={toggleCategory}
            />
            <CustomSizeInput
              customSizes={customSizes}
              onAddCustomSize={addCustomSize}
              onRemoveCustomSize={removeCustomSize}
            />
          </div>
        </div>

        {/* Generate */}
        <div className="mx-auto mt-8 max-w-md">
          <GenerateButton
            onClick={generate}
            disabled={!sourceFile || selectedSizeIds.size === 0}
            isProcessing={isProcessing}
            progress={progress}
          />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8">
            <DownloadArea results={results} />
          </div>
        )}
      </main>
    </div>
  );
}
