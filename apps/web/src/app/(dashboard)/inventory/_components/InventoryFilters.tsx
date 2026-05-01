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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      {/* Cột 1: Tìm kiếm */}
      <div className="lg:col-span-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Cột 2: Các fields còn lại */}
      <div className="lg:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Tình trạng
            </label>
            <div className="flex bg-background-app/50 p-1 rounded-lg border border-border-ui h-10">
              <button
                type="button"
                onClick={() => onStockModeChange("all")}
                className={
                  stockMode === "all"
                    ? "flex-1 px-3 py-1 text-xs font-bold rounded-md bg-card-white text-accent shadow-sm"
                    : "flex-1 px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                }
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => onStockModeChange("lowStock")}
                className={
                  stockMode === "lowStock"
                    ? "flex-1 px-3 py-1 text-xs font-bold rounded-md bg-warning/10 text-warning shadow-sm flex items-center justify-center gap-1.5"
                    : "flex-1 px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5"
                }
              >
                <AlertTriangle className="w-3 h-3 text-warning" />
                Cần nhập
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
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
            className="h-10 flex items-center justify-center gap-2 px-3 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all border border-transparent hover:border-accent/20"
          >
            <RotateCcw className="w-4 h-4" /> Xóa lọc
          </button>
        </div>
      </div>
    </div>
  );
}
