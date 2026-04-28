/**
 * Resize ảnh client-side trước khi upload bằng canvas + toBlob.
 * Output JPEG để giảm size mạnh (trừ GIF — giữ nguyên vì animated).
 */
export interface ProcessImageOptions {
  /** Cạnh dài tối đa (px). Default 1600. */
  maxDim?: number;
  /** Chất lượng JPEG 0..1. Default 0.85. */
  quality?: number;
  /** Nếu file gốc đã nhỏ hơn ngưỡng này (bytes) và đúng kích thước → giữ nguyên. */
  skipIfSmallerThan?: number;
}

export interface ProcessedImage {
  blob: Blob;
  ext: "jpg" | "png" | "webp" | "gif";
  /** Width/Height sau resize (để debug / hiển thị). */
  width: number;
  height: number;
  /** Có phải đã resize không (false nếu giữ nguyên). */
  resized: boolean;
}

const DEFAULTS: Required<ProcessImageOptions> = {
  maxDim: 1600,
  quality: 0.85,
  skipIfSmallerThan: 300 * 1024, // 300KB
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không đọc được file ảnh"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Không thể nén ảnh"))),
      type,
      quality,
    );
  });
}

export async function processImage(
  file: File,
  options: ProcessImageOptions = {},
): Promise<ProcessedImage> {
  const opts = { ...DEFAULTS, ...options };

  // GIF có thể là animated — không resize để tránh mất animation.
  if (file.type === "image/gif") {
    return {
      blob: file,
      ext: "gif",
      width: 0,
      height: 0,
      resized: false,
    };
  }

  const img = await loadImage(file);
  const { width: srcW, height: srcH } = img;
  const scale = Math.min(opts.maxDim / srcW, opts.maxDim / srcH, 1);

  // Đã đủ nhỏ → giữ nguyên
  if (scale === 1 && file.size <= opts.skipIfSmallerThan) {
    const ext = guessExt(file.type);
    return { blob: file, ext, width: srcW, height: srcH, resized: false };
  }

  const dstW = Math.round(srcW * scale);
  const dstH = Math.round(srcH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = dstW;
  canvas.height = dstH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ canvas");
  // Cải thiện chất lượng resize
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, dstW, dstH);

  // PNG có alpha → giữ PNG; còn lại convert sang JPEG cho nhẹ
  const keepPng = file.type === "image/png";
  const outputType = keepPng ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(
    canvas,
    outputType,
    keepPng ? undefined : opts.quality,
  );

  return {
    blob,
    ext: keepPng ? "png" : "jpg",
    width: dstW,
    height: dstH,
    resized: true,
  };
}

function guessExt(mime: string): ProcessedImage["ext"] {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
