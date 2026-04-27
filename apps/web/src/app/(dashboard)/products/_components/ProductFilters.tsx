"use client";

import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProductStockFilter = "all" | "lowStock" | "inactive";

export interface ProductFiltersValue {
  search: string;
  stock: ProductStockFilter;
}

export const defaultProductFiltersValue: ProductFiltersValue = {
  search: "",
  stock: "all",
};

interface ProductFiltersProps {
  value: ProductFiltersValue;
  onChange: (next: ProductFiltersValue) => void;
}

const stockOptions: { value: ProductStockFilter; label: string }[] = [
  { value: "all", label: "Tất cả đang hoạt động" },
  { value: "lowStock", label: "Sắp hết / Hết hàng" },
  { value: "inactive", label: "Đã ngưng" },
];

export function ProductFilters({ value, onChange }: ProductFiltersProps) {
  const isDirty = value.search.length > 0 || value.stock !== "all";

  return (
    <div className="flex flex-wrap items-end gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={value.search}
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
          placeholder="Tìm kiếm theo tên, SKU, mã vạch, brand, model..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
          Trạng thái tồn kho
        </label>
        <select
          value={value.stock}
          onChange={(event) =>
            onChange({
              ...value,
              stock: event.target.value as ProductStockFilter,
            })
          }
          className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-50 focus:border-accent"
        >
          {stockOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={!isDirty}
        onClick={() => onChange(defaultProductFiltersValue)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
          isDirty
            ? "text-accent hover:bg-accent/10"
            : "text-text-secondary/50 cursor-not-allowed",
        )}
      >
        <RotateCcw className="w-4 h-4" />
        Xóa lọc
      </button>

      <p className="basis-full text-[11px] text-text-secondary mt-1">
        Lọc theo Danh mục sẽ được kích hoạt khi module Danh mục được kết nối.
      </p>
    </div>
  );
}
