"use client";

import React from "react";
import { X, Save, AlertCircle, Search, Loader2 } from "lucide-react";
import { useProducts } from "@/lib/hooks/use-products";
import { useAdjustInventoryStock } from "@/lib/hooks/use-inventory";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";

export interface AdjustStockTarget {
  productId: string;
  sku: string;
  name: string;
  currentStock: number;
}

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: AdjustStockTarget | null;
}

export function AdjustStockModal({
  isOpen,
  onClose,
  product,
}: AdjustStockModalProps) {
  const toast = useToast();
  const adjustMutation = useAdjustInventoryStock();

  const [selected, setSelected] = React.useState<AdjustStockTarget | null>(
    product ?? null,
  );
  const [newStockText, setNewStockText] = React.useState<string>(
    product ? String(product.currentStock) : "",
  );
  const [reason, setReason] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Reset state mỗi lần mở modal (pattern React 19 — không setState trong effect)
  const openKey = `${isOpen ? 1 : 0}|${product?.productId ?? ""}`;
  const [prevOpenKey, setPrevOpenKey] = React.useState(openKey);
  if (prevOpenKey !== openKey) {
    setPrevOpenKey(openKey);
    if (isOpen) {
      setSelected(product ?? null);
      setNewStockText(product ? String(product.currentStock) : "");
      setReason("");
      setSearchTerm("");
      setDebouncedSearch("");
      setSubmitError(null);
    }
  }

  // Debounce search
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const showPicker = !selected;
  const shouldSearch = showPicker && debouncedSearch.length > 0;
  const { data: searchResult, isFetching: isSearching } = useProducts(
    { search: debouncedSearch, page: 1, limit: 8 },
    { enabled: shouldSearch },
  );
  const searchProducts = shouldSearch ? (searchResult?.data ?? []) : [];

  if (!isOpen) return null;

  const newStockNumber = Number(newStockText);
  const isNewStockValid =
    newStockText !== "" &&
    Number.isFinite(newStockNumber) &&
    Number.isInteger(newStockNumber) &&
    newStockNumber >= 0;
  const delta =
    isNewStockValid && selected ? newStockNumber - selected.currentStock : 0;
  const canSubmit =
    !!selected &&
    isNewStockValid &&
    delta !== 0 &&
    reason.trim().length > 0 &&
    !adjustMutation.isPending;

  const handleSubmit = async () => {
    if (!selected || !canSubmit) return;
    setSubmitError(null);
    try {
      await adjustMutation.mutateAsync({
        productId: selected.productId,
        data: { quantity: delta, note: reason.trim() },
      });
      toast.success(
        `Đã điều chỉnh tồn kho "${selected.name}" (${delta > 0 ? "+" : ""}${delta})`,
      );
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể điều chỉnh tồn kho"));
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card-white w-full max-w-md rounded-2xl shadow-2xl border border-border-ui overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border-ui flex items-center justify-between bg-card-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Điều chỉnh tồn kho
              </h3>
              <p className="text-[11px] text-text-secondary uppercase font-bold tracking-tighter">
                SKU: {selected?.sku || "N/A"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {showPicker ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">
                Chọn sản phẩm <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên hoặc SKU..."
                  className="w-full pl-9 pr-4 py-2.5 bg-background-app border border-border-ui rounded-xl text-sm focus:border-accent outline-none transition-all"
                />
              </div>
              {debouncedSearch.length > 0 && (
                <div className="max-h-56 overflow-y-auto rounded-xl border border-border-ui divide-y divide-border-ui">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-text-secondary flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" /> Đang tìm...
                    </div>
                  ) : searchProducts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-text-secondary">
                      Không tìm thấy sản phẩm
                    </div>
                  ) : (
                    searchProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelected({
                            productId: p.id,
                            sku: p.sku,
                            name: p.name,
                            currentStock: p.currentStock,
                          });
                          setNewStockText(String(p.currentStock));
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-accent/5 transition-colors"
                      >
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] font-mono text-text-secondary">
                          {p.sku} · Tồn: {p.currentStock} {p.unit}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-background-app rounded-xl border border-border-ui/50 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary font-medium mb-1">
                  Sản phẩm
                </p>
                <p className="text-sm font-bold text-text-primary truncate">
                  {selected.name}
                </p>
                <p className="text-[11px] font-mono text-text-secondary mt-0.5">
                  {selected.sku}
                </p>
              </div>
              {!product && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setNewStockText("");
                  }}
                  className="text-[11px] font-bold text-accent hover:underline"
                >
                  Đổi
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">
                Tồn kho hiện tại
              </label>
              <div className="px-4 py-3 bg-background-app border border-border-ui rounded-xl text-lg font-black text-text-primary">
                {selected?.currentStock ?? 0}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">
                Tồn kho mới <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={newStockText}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d+$/.test(v)) setNewStockText(v);
                }}
                disabled={!selected}
                className="w-full px-4 py-3 bg-card-white border border-accent rounded-xl text-lg font-black text-accent outline-none focus:ring-2 ring-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="0"
              />
            </div>
          </div>

          {selected && isNewStockValid && delta !== 0 && (
            <div className="text-[11px] font-medium text-text-secondary">
              Chênh lệch:{" "}
              <span
                className={
                  delta > 0 ? "text-success font-bold" : "text-danger font-bold"
                }
              >
                {delta > 0 ? `+${delta}` : delta}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">
              Lý do điều chỉnh <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-background-app border border-border-ui rounded-xl text-sm focus:border-accent outline-none transition-all resize-none"
              placeholder="VD: Kiểm kê kho định kỳ, hàng hỏng..."
            />
          </div>

          {submitError && (
            <div className="text-xs text-danger font-medium bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
              {submitError}
            </div>
          )}
        </div>

        <div className="p-6 bg-background-app/50 border-t border-border-ui flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={adjustMutation.isPending}
            className="flex-1 py-3 bg-card-white border border-border-ui rounded-xl text-sm font-bold text-text-secondary hover:bg-background-app transition-all disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold shadow-md shadow-accent/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adjustMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
