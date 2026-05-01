"use client";

import React from "react";
import { Folder, RotateCcw, Search } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useCategories } from "@/lib/hooks/use-categories";
import { cn } from "@/lib/utils";

export type ProductStockFilter = "all" | "lowStock" | "inactive";

export interface ProductFiltersValue {
  search: string;
  stock: ProductStockFilter;
  categoryId: string;
}

export const defaultProductFiltersValue: ProductFiltersValue = {
  search: "",
  stock: "all",
  categoryId: "",
};

interface ProductFiltersProps {
  value: ProductFiltersValue;
  onChange: (next: ProductFiltersValue) => void;
}

const stockOptions: ComboboxOption<ProductStockFilter>[] = [
  { value: "all", label: "Tất cả đang hoạt động" },
  { value: "lowStock", label: "Sắp hết / Hết hàng" },
  { value: "inactive", label: "Đã ngưng" },
];

export function ProductFilters({ value, onChange }: ProductFiltersProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
    isActive: true,
  });
  const categories = categoriesData?.data ?? [];

  const categoryOptions: ComboboxOption<string>[] = React.useMemo(
    () => [
      { value: "", label: "Tất cả danh mục" },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
        hint: `${cat.productCount} sp`,
        icon: (
          <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
            <Folder className="w-3.5 h-3.5" />
          </span>
        ),
      })),
    ],
    [categories],
  );

  const isDirty =
    value.search.length > 0 || value.stock !== "all" || value.categoryId !== "";

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
              value={value.search}
              onChange={(event) =>
                onChange({ ...value, search: event.target.value })
              }
              placeholder="Tên, SKU, mã vạch, brand, model..."
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
              Danh mục
            </label>
            <Combobox<string>
              value={value.categoryId}
              onChange={(next) => onChange({ ...value, categoryId: next })}
              options={categoryOptions}
              loading={categoriesLoading}
              placeholder="Tất cả danh mục"
              searchPlaceholder="Tìm danh mục..."
              searchable
              clearable={value.categoryId !== ""}
              emptyMessage={
                categories.length === 0
                  ? "Chưa có danh mục nào"
                  : "Không tìm thấy"
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Trạng thái tồn kho
            </label>
            <Combobox<ProductStockFilter>
              value={value.stock}
              onChange={(next) =>
                onChange({
                  ...value,
                  stock: (next || "all") as ProductStockFilter,
                })
              }
              options={stockOptions}
              searchable={false}
            />
          </div>

          <button
            type="button"
            disabled={!isDirty}
            onClick={() => onChange(defaultProductFiltersValue)}
            className={cn(
              "h-10 flex items-center justify-center gap-2 px-3 text-sm font-medium rounded-lg transition-all border border-transparent",
              isDirty
                ? "text-accent hover:bg-accent/10 hover:border-accent/20"
                : "text-text-secondary/50 cursor-not-allowed",
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Xóa lọc
          </button>
        </div>
      </div>
    </div>
  );
}
