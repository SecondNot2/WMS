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
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm nội dung thông báo..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-40">
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

        <div className="flex flex-col gap-1 min-w-40">
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
          className="mt-5 flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Xóa lọc
        </button>
      </div>
    </div>
  );
}
