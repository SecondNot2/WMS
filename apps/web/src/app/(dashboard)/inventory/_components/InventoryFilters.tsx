"use client";

import React from "react";
import { Search, RotateCcw, AlertTriangle } from "lucide-react";

export function InventoryFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Tình trạng
          </label>
          <div className="flex bg-background-app/50 p-1 rounded-lg border border-border-ui">
            <button className="px-3 py-1 text-xs font-bold rounded-md bg-card-white text-accent shadow-sm">
              Tất cả
            </button>
            <button className="px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-warning" />
              Cần nhập
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Danh mục
          </label>
          <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-40 focus:border-accent">
            <option value="">Tất cả</option>
            <option value="1">Điện tử</option>
            <option value="2">Điện lạnh</option>
            <option value="3">Gia dụng</option>
          </select>
        </div>

        <button className="mt-5 flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all">
          <RotateCcw className="w-4 h-4" /> Xóa lọc
        </button>
      </div>
    </div>
  );
}
