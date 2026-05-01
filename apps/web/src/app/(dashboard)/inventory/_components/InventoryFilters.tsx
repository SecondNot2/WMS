"use client";

import React from "react";
import { Search, RotateCcw, AlertTriangle } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useCategories } from "@/lib/hooks/use-categories";

export type InventoryStockMode = "all" | "lowStock";

interface InventoryFiltersProps {
  search: string;
  stockMode: InventoryStockMode;
  categoryId: string;
  onSearchChange: (value: string) => void;
  onStockModeChange: (value: InventoryStockMode) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function InventoryFilters({
  search,
  stockMode,
  categoryId,
  onSearchChange,
  onStockModeChange,
  onCategoryChange,
  onReset,
}: InventoryFiltersProps) {
  const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });
  const categoryOptions = React.useMemo<ComboboxOption<string>[]>(
    () => [
      { value: "", label: "Tất cả" },
      ...(categoriesResponse?.data ?? []).map((category) => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categoriesResponse?.data],
  );

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 bg-card-white p-3 sm:p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative w-full sm:flex-1 sm:min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Tình trạng
          </label>
          <div className="flex bg-background-app/50 p-1 rounded-lg border border-border-ui">
            <button
              type="button"
              onClick={() => onStockModeChange("all")}
              className={
                stockMode === "all"
                  ? "px-3 py-1 text-xs font-bold rounded-md bg-card-white text-accent shadow-sm"
                  : "px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              }
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => onStockModeChange("lowStock")}
              className={
                stockMode === "lowStock"
                  ? "px-3 py-1 text-xs font-bold rounded-md bg-warning/10 text-warning shadow-sm flex items-center gap-1.5"
                  : "px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
              }
            >
              <AlertTriangle className="w-3 h-3 text-warning" />
              Cần nhập
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto sm:min-w-44">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Danh mục
          </label>
          <Combobox<string>
            value={categoryId}
            onChange={(next) => onCategoryChange(next || "")}
            options={categoryOptions}
            placeholder="Tất cả"
            clearable={Boolean(categoryId)}
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="sm:mt-5 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Xóa lọc
        </button>
      </div>
    </div>
  );
}
