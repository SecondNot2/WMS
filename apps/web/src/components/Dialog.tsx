"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogVariant = "danger" | "warning" | "success" | "info";

const VARIANT_STYLES: Record<
  DialogVariant,
  {
    icon: typeof AlertTriangle;
    iconCls: string;
    iconBg: string;
    confirmCls: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    iconCls: "text-danger",
    iconBg: "bg-danger/10",
    confirmCls: "bg-danger hover:bg-danger/90 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconCls: "text-warning",
    iconBg: "bg-warning/10",
    confirmCls: "bg-warning hover:bg-warning/90 text-white",
  },
  success: {
    icon: CheckCircle2,
    iconCls: "text-success",
    iconBg: "bg-success/10",
    confirmCls: "bg-success hover:bg-success/90 text-white",
  },
  info: {
    icon: Info,
    iconCls: "text-accent",
    iconBg: "bg-accent/10",
    confirmCls: "bg-accent hover:bg-accent/90 text-white",
  },
};

interface BaseDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  children?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
}

function DialogShell({
  open,
  onClose,
  title,
  message,
  variant = "info",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  loading,
  children,
  onConfirm,
}: BaseDialogProps) {
  const cfg = VARIANT_STYLES[variant];
  const Icon = cfg.icon;

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in"
      onClick={() => !loading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-card-white rounded-xl shadow-2xl w-full max-w-md border border-border-ui overflow-hidden"
      >
        <div className="flex items-start gap-4 p-6">
          <div
            className={cn(
              "shrink-0 p-2.5 rounded-full",
              cfg.iconBg,
              cfg.iconCls,
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-text-primary leading-snug">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="p-1 -mt-1 -mr-1 text-text-secondary hover:text-text-primary hover:bg-background-app rounded-md disabled:opacity-50"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {message && (
              <div className="mt-2 text-sm text-text-secondary leading-relaxed">
                {message}
              </div>
            )}
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-background-app/40 border-t border-border-ui">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-background-app rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-60",
              cfg.confirmCls,
            )}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ConfirmDialog
// ─────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  return <DialogShell {...props} />;
}

// ─────────────────────────────────────────
// PromptDialog (with input)
// ─────────────────────────────────────────

interface PromptDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  variant?: DialogVariant;
  inputLabel?: string;
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
  multiline?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: (value: string) => void | Promise<void>;
}

export function PromptDialog({
  open,
  onClose,
  title,
  message,
  variant = "warning",
  inputLabel,
  placeholder,
  initialValue = "",
  required = true,
  multiline = true,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  loading,
  onConfirm,
}: PromptDialogProps) {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
    }
  }, [open, initialValue]);

  const handleConfirm = async () => {
    const trimmed = value.trim();
    if (required && !trimmed) {
      setError("Vui lòng nhập nội dung");
      return;
    }
    await onConfirm(trimmed);
  };

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={title}
      message={message}
      variant={variant}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      loading={loading}
      onConfirm={handleConfirm}
    >
      {inputLabel && (
        <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-2">
          {inputLabel}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          rows={3}
          autoFocus
          disabled={loading}
          className={cn(
            "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors resize-none",
            error ? "border-danger" : "border-border-ui",
          )}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          autoFocus
          disabled={loading}
          className={cn(
            "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
            error ? "border-danger" : "border-border-ui",
          )}
        />
      )}
      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </DialogShell>
  );
}
