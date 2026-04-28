"use client";

import React from "react";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";
import { useAdjustProductStock } from "@/lib/hooks/use-products";
import { cn } from "@/lib/utils";

interface StockAdjustDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  currentStock: number;
  unit: string;
  onSuccess?: () => void;
}

type Direction = "in" | "out";

export function StockAdjustDialog({
  open,
  onClose,
  productId,
  productName,
  currentStock,
  unit,
  onSuccess,
}: StockAdjustDialogProps) {
  const [direction, setDirection] = React.useState<Direction>("in");
  const [amount, setAmount] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const adjust = useAdjustProductStock(productId);
  const toast = useToast();

  React.useEffect(() => {
    if (open) {
      setDirection("in");
      setAmount("");
      setNote("");
      setError(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !adjust.isPending) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, adjust.isPending, onClose]);

  if (!open) return null;

  const numericAmount = Number(amount);
  const isValidAmount = Number.isInteger(numericAmount) && numericAmount > 0;
  const delta = direction === "in" ? numericAmount : -numericAmount;
  const stockAfter = isValidAmount ? currentStock + delta : currentStock;
  const insufficient = direction === "out" && stockAfter < 0;

  const handleSubmit = async () => {
    setError(null);
    if (!isValidAmount) {
      setError("Số lượng phải là số nguyên dương");
      return;
    }
    if (insufficient) {
      setError("Tồn kho không đủ để xuất");
      return;
    }
    try {
      await adjust.mutateAsync({
        quantity: delta,
        note: note.trim() ? note.trim() : undefined,
      });
      toast.success(
        direction === "in"
          ? `Đã cộng ${numericAmount} ${unit} cho ${productName}`
          : `Đã trừ ${numericAmount} ${unit} từ ${productName}`,
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Không thể điều chỉnh tồn kho");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={() => !adjust.isPending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-card-white rounded-xl shadow-2xl w-full max-w-md border border-border-ui overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-3">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Điều chỉnh tồn kho
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
              {productName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={adjust.isPending}
            className="p-1.5 -mr-1.5 -mt-1 text-text-secondary hover:bg-background-app rounded-md disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection("in")}
              disabled={adjust.isPending}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold border transition-all",
                direction === "in"
                  ? "bg-success/10 text-success border-success/30"
                  : "bg-card-white text-text-secondary border-border-ui hover:bg-background-app",
              )}
            >
              <Plus className="w-4 h-4" /> Nhập thêm
            </button>
            <button
              type="button"
              onClick={() => setDirection("out")}
              disabled={adjust.isPending}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold border transition-all",
                direction === "out"
                  ? "bg-danger/10 text-danger border-danger/30"
                  : "bg-card-white text-text-secondary border-border-ui hover:bg-background-app",
              )}
            >
              <Minus className="w-4 h-4" /> Giảm trừ
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Số lượng <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={adjust.isPending}
              autoFocus
              placeholder="VD: 10"
              className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Lý do (khuyến nghị)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={adjust.isPending}
              rows={2}
              maxLength={500}
              placeholder="VD: Kiểm kê thực tế, hàng hỏng, sai số kiểm đếm..."
              className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="bg-background-app/60 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Tồn hiện tại:</span>
              <span className="font-bold text-text-primary">
                {currentStock} {unit}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-text-secondary">Sau điều chỉnh:</span>
              <span
                className={cn(
                  "font-bold",
                  insufficient
                    ? "text-danger"
                    : direction === "in"
                      ? "text-success"
                      : "text-warning",
                )}
              >
                {isValidAmount ? `${stockAfter} ${unit}` : "—"}
                {isValidAmount && (
                  <span className="ml-2 text-[11px] font-normal text-text-secondary">
                    ({delta > 0 ? "+" : ""}
                    {delta})
                  </span>
                )}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-background-app/40 border-t border-border-ui">
          <button
            type="button"
            onClick={onClose}
            disabled={adjust.isPending}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-background-app rounded-lg disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={adjust.isPending || !isValidAmount || insufficient}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-accent hover:bg-accent/90 text-white shadow-sm flex items-center gap-2 disabled:opacity-60"
          >
            {adjust.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
