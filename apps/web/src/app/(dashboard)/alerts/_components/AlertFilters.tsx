"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useCategories } from "@/lib/hooks/use-categories";
import type { AlertLevel } from "@wms/types";

type Severity = "" | AlertLevel;

const severityOptions: ComboboxOption<Severity>[] = [
  { value: "", label: "Tất cả" },
  { value: "CRITICAL", label: "Nghiêm trọng" },
  { value: "WARNING", label: "Cảnh báo" },
];

interface AlertFiltersProps {
  search: string;
  level: Severity;
  categoryId: string;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: Severity) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function AlertFilters({
  search,
  level,
  categoryId,
  onSearchChange,
  onLevelChange,
  onCategoryChange,
  onReset,
}: AlertFiltersProps) {
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
              placeholder="Tìm kiếm nội dung thông báo..."
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
              Mức độ
            </label>
            <Combobox<Severity>
              value={level}
              onChange={(next) => onLevelChange((next || "") as Severity)}
              options={severityOptions}
              searchable={false}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Danh mục
            </label>
            <Combobox<string>
              value={categoryId}
              onChange={(next) => onCategoryChange(next || "")}
              options={categoryOptions}
              searchable
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
