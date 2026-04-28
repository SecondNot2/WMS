"use client";

import React from "react";
import { Clock, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { useToast } from "@/components/Toast";
import {
  SUPABASE_BUCKET,
  extractStoragePath,
  getSupabaseClient,
  isSupabaseConfigured,
  removeStorageFileByUrl,
} from "@/lib/supabase";
import { processImage, formatBytes } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

/**
 * Imperative API expose qua ref. Form cha gọi `commit()` trước khi submit.
 * commit() sẽ:
 *  - Upload file đang chờ (nếu có) lên bucket → trả URL mới
 *  - Xóa ảnh cũ (URL của props.value) khỏi bucket nếu user đã thay/gỡ
 *  - Trả về URL cuối cùng để parent ghi vào form data
 */
export interface ImageUploadHandle {
  commit(): Promise<string | null>;
  hasPending(): boolean;
  reset(): void;
}

interface ImageUploadProps {
  /** Public URL đã lưu trong DB (state hiện tại từ form) */
  value: string | null;
  /** Chỉ gọi khi user CLEAR ảnh (×). KHÔNG gọi khi pick file mới — phải đợi commit(). */
  onChange?: (url: string | null) => void;
  /** Callback khi trạng thái pending đổi (form có thể enable nút Lưu). */
  onPendingChange?: (hasPending: boolean) => void;
  /** Folder con trong bucket: 'products' | 'avatars' | ... */
  folder: string;
  /** Tỉ lệ khung preview */
  aspect?: "square" | "video" | "wide";
  /** Kích thước file gốc tối đa (KB) trước khi resize. Default: 10240 (10MB). */
  maxSizeKB?: number;
  /** Cạnh dài tối đa sau resize (px). Default 1600. */
  maxDim?: number;
  /** Chất lượng JPEG 0..1. Default 0.85. */
  quality?: number;
  /** MIME types chấp nhận. Default: image/* */
  accept?: string;
  /** Class bổ sung cho container */
  className?: string;
  /** Disable mọi tương tác */
  disabled?: boolean;
}

const ASPECT_CLS: Record<NonNullable<ImageUploadProps["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[3/1]",
};

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

type Pending =
  | { kind: "none" }
  | {
      kind: "replace";
      blob: Blob;
      ext: string;
      baseName: string;
      previewUrl: string;
      sizeOriginal: number;
      sizeProcessed: number;
      resized: boolean;
    }
  | { kind: "remove" };

export const ImageUpload = React.forwardRef<
  ImageUploadHandle,
  ImageUploadProps
>(function ImageUpload(
  {
    value,
    onChange,
    folder,
    aspect = "square",
    maxSizeKB = 10 * 1024,
    maxDim = 1600,
    quality = 0.85,
    accept = "image/*",
    className,
    disabled,
    onPendingChange,
  },
  ref,
) {
  const toast = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [pending, setPending] = React.useState<Pending>({ kind: "none" });
  const [processing, setProcessing] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragOver, setDragOver] = React.useState(false);

  const supabaseReady = isSupabaseConfigured();

  // Cleanup object URL khi unmount hoặc khi pending replace đổi
  React.useEffect(() => {
    return () => {
      if (pending.kind === "replace") URL.revokeObjectURL(pending.previewUrl);
    };
  }, [pending]);

  // Notify parent về trạng thái pending
  React.useEffect(() => {
    onPendingChange?.(pending.kind !== "none");
  }, [pending, onPendingChange]);

  const setReplacePending = (next: Extract<Pending, { kind: "replace" }>) => {
    setPending((prev) => {
      if (prev.kind === "replace") URL.revokeObjectURL(prev.previewUrl);
      return next;
    });
  };

  const handleFile = async (file: File | undefined | null) => {
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG / PNG / WEBP / GIF");
      return;
    }
    const sizeKB = file.size / 1024;
    if (sizeKB > maxSizeKB) {
      toast.error(
        `Ảnh quá lớn (${formatBytes(file.size)}). Tối đa ${Math.round(
          maxSizeKB / 1024,
        )}MB.`,
      );
      return;
    }
    if (!supabaseReady) {
      toast.error(
        "Chưa cấu hình Supabase Storage (NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY).",
      );
      return;
    }

    setProcessing(true);
    try {
      const processed = await processImage(file, { maxDim, quality });
      const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
      const previewUrl = URL.createObjectURL(processed.blob);
      setReplacePending({
        kind: "replace",
        blob: processed.blob,
        ext: processed.ext,
        baseName,
        previewUrl,
        sizeOriginal: file.size,
        sizeProcessed: processed.blob.size,
        resized: processed.resized,
      });
      if (processed.resized) {
        toast.success(
          `Đã nén ảnh: ${formatBytes(file.size)} → ${formatBytes(
            processed.blob.size,
          )}`,
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không xử lý được ảnh";
      toast.error(msg);
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading || processing) return;
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  const handleClear = () => {
    if (disabled || uploading || processing) return;
    // Nếu đang có pending replace → bỏ pending, giữ value cũ
    if (pending.kind === "replace") {
      URL.revokeObjectURL(pending.previewUrl);
      setPending({ kind: "none" });
      return;
    }
    // Nếu đã có value (URL DB) → đánh dấu remove (sẽ xóa khi commit)
    if (value) {
      setPending({ kind: "remove" });
      onChange?.(null); // báo form là sẽ gỡ ảnh khi save
    }
  };

  const handleUndoRemove = () => {
    if (pending.kind === "remove") {
      setPending({ kind: "none" });
      onChange?.(value); // khôi phục
    }
  };

  // ── Imperative API ───────────────────────────────────────────────
  React.useImperativeHandle(
    ref,
    () => ({
      hasPending: () => pending.kind !== "none",
      reset: () => {
        if (pending.kind === "replace") URL.revokeObjectURL(pending.previewUrl);
        setPending({ kind: "none" });
      },
      commit: async () => {
        // 1. Không thay đổi → giữ URL hiện tại
        if (pending.kind === "none") return value ?? null;

        // 2. User đã gỡ ảnh → xóa file cũ trên bucket
        if (pending.kind === "remove") {
          if (value) {
            const res = await removeStorageFileByUrl(value);
            if (!res.ok && res.error) {
              // Best-effort: log warning nhưng không block save
              // eslint-disable-next-line no-console
              console.warn("Không xóa được file cũ:", res.error);
            }
          }
          setPending({ kind: "none" });
          return null;
        }

        // 3. User đã chọn ảnh mới → upload, sau đó xóa file cũ (nếu khác)
        const supabase = getSupabaseClient();
        if (!supabase) throw new Error("Supabase chưa cấu hình");

        const path = `${folder}/${uuid()}-${
          pending.baseName || "image"
        }.${pending.ext}`;

        setUploading(true);
        setProgress(0);
        const tick = window.setInterval(() => {
          setProgress((p) => (p < 85 ? p + 5 : p));
        }, 120);

        try {
          const { error: uploadError } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(path, pending.blob, {
              cacheControl: "3600",
              upsert: false,
              contentType:
                pending.ext === "png"
                  ? "image/png"
                  : pending.ext === "gif"
                    ? "image/gif"
                    : pending.ext === "webp"
                      ? "image/webp"
                      : "image/jpeg",
            });
          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from(SUPABASE_BUCKET)
            .getPublicUrl(path);
          setProgress(100);

          // Xóa ảnh cũ nếu có và khác URL mới
          const oldPath = extractStoragePath(value);
          const newPath = path;
          if (oldPath && oldPath !== newPath) {
            const res = await removeStorageFileByUrl(value);
            if (!res.ok && res.error) {
              // eslint-disable-next-line no-console
              console.warn("Không xóa được file cũ:", res.error);
            }
          }

          URL.revokeObjectURL(pending.previewUrl);
          setPending({ kind: "none" });
          return data.publicUrl;
        } finally {
          window.clearInterval(tick);
          setUploading(false);
          setTimeout(() => setProgress(0), 600);
        }
      },
    }),
    [pending, value, folder],
  );

  // ── Display logic ────────────────────────────────────────────────
  const displayUrl =
    pending.kind === "replace"
      ? pending.previewUrl
      : pending.kind === "remove"
        ? null
        : value;
  const busy = uploading || processing;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !busy) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !busy && !displayUrl) inputRef.current?.click();
        }}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed transition-colors overflow-hidden bg-background-app/40",
          ASPECT_CLS[aspect],
          dragOver
            ? "border-accent bg-accent/5"
            : "border-border-ui hover:border-accent/60",
          !displayUrl && !disabled && !busy && "cursor-pointer",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="Ảnh đã chọn"
              className="w-full h-full object-cover"
            />
            {pending.kind === "replace" && (
              <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/90 text-white text-[10px] font-bold shadow">
                <Clock className="w-3 h-3" />
                Chưa lưu
              </span>
            )}
            {!disabled && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  disabled={busy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-card-white text-text-primary text-xs font-bold rounded-lg shadow-lg hover:bg-background-app"
                >
                  <Upload className="w-3.5 h-3.5" /> Đổi ảnh
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  disabled={busy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white text-xs font-bold rounded-lg shadow-lg hover:bg-danger/90"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            )}
          </>
        ) : pending.kind === "remove" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
            <span className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </span>
            <p className="text-sm font-bold text-text-primary">
              Sẽ gỡ ảnh khi lưu
            </p>
            <button
              type="button"
              onClick={handleUndoRemove}
              className="text-[11px] text-accent font-bold hover:underline"
            >
              Hoàn tác
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 gap-2 text-text-secondary">
            <span className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <ImagePlus className="w-6 h-6" />
            </span>
            <p className="text-sm font-bold text-text-primary">
              Kéo thả ảnh hoặc click để chọn
            </p>
            <p className="text-[11px]">
              JPG, PNG, WEBP, GIF · Tối đa {Math.round(maxSizeKB / 1024)}MB · tự
              nén
            </p>
            {!supabaseReady && (
              <p className="text-[10px] text-warning font-medium mt-1">
                Chưa cấu hình Supabase Storage
              </p>
            )}
          </div>
        )}

        {processing && (
          <div className="absolute inset-0 bg-card-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
            <p className="text-[12px] text-text-secondary font-medium">
              Đang nén ảnh...
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-card-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
            <div className="w-2/3 max-w-60">
              <div className="h-1.5 bg-background-app rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-text-secondary mt-2 text-center">
                Đang tải lên... {progress}%
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {pending.kind === "replace" && (
        <div className="flex items-center justify-between gap-2 text-[11px] text-text-secondary">
          <span className="truncate">
            {pending.resized ? (
              <>
                Đã nén: <strong>{formatBytes(pending.sizeOriginal)}</strong> →{" "}
                <strong className="text-success">
                  {formatBytes(pending.sizeProcessed)}
                </strong>
              </>
            ) : (
              <>Kích thước: {formatBytes(pending.sizeProcessed)}</>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(pending.previewUrl);
              setPending({ kind: "none" });
            }}
            className="text-danger hover:underline shrink-0 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Hủy chọn
          </button>
        </div>
      )}

      {pending.kind === "none" && value && (
        <div className="flex items-center justify-between gap-2 text-[11px] text-text-secondary">
          <span className="truncate font-mono opacity-70">{value}</span>
        </div>
      )}
    </div>
  );
});
