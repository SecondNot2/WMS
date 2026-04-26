"use client";

import React from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export function AdjustStockModal({ isOpen, onClose, product }: AdjustStockModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-border-ui overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border-ui flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Điều chỉnh tồn kho</h3>
              <p className="text-[11px] text-text-secondary uppercase font-bold tracking-tighter">SKU: {product?.sku || "N/A"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-background-app rounded-xl border border-border-ui/50">
            <p className="text-xs text-text-secondary font-medium mb-1">Sản phẩm</p>
            <p className="text-sm font-bold text-text-primary">{product?.name || "Chọn sản phẩm..."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Tồn kho hiện tại</label>
              <div className="px-4 py-3 bg-background-app border border-border-ui rounded-xl text-lg font-black text-text-primary">
                {product?.currentStock || 0}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Tồn kho mới</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-white border border-accent rounded-xl text-lg font-black text-accent outline-none focus:ring-2 ring-accent/20 transition-all"
                placeholder="0"
                defaultValue={product?.currentStock}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">Lý do điều chỉnh <span className="text-danger">*</span></label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-background-app border border-border-ui rounded-xl text-sm focus:border-accent outline-none transition-all resize-none"
              placeholder="VD: Kiểm kê kho định kỳ, hàng hỏng..."
            />
          </div>
        </div>

        <div className="p-6 bg-[#f8fafc] border-t border-border-ui flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-border-ui rounded-xl text-sm font-bold text-text-secondary hover:bg-background-app transition-all"
          >
            Hủy bỏ
          </button>
          <button className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold shadow-md shadow-accent/20 flex items-center justify-center gap-2 transition-all">
            <Save className="w-4 h-4" /> Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
