export interface SizeDefinition {
  id: string;
  label: string;
  width: number;
  height: number;
  format: "png" | "ico";
  maskable?: boolean;
  filename: string;
  category: string;
  /** For ICO format, the sub-sizes to embed */
  icoSizes?: number[];
}

export interface ResizeResult {
  sizeId: string;
  label: string;
  filename: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  currentLabel: string;
}

export type ProcessingMode = "client" | "server";
