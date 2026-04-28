"use client";

import React from "react";
import { Calendar, Filter } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useCategories } from "@/lib/hooks/use-categories";
import type { StatisticsRange } from "@wms/types";

const rangeOptions: ComboboxOption<StatisticsRange>[] = [
  { value: "7d", label: "7 ngày qua" },
  { value: "30d", label: "30 ngày qua" },
  { value: "3m", label: "3 tháng qua" },
  { value: "1y", label: "1 năm qua" },
];

interface StatsFiltersProps {
  range: StatisticsRange;
  categoryId: string;
  onRangeChange: (next: StatisticsRange) => void;
  onCategoryChange: (next: string) => void;
  onReset: () => void;
}

export function StatsFilters({
  range,
  categoryId,
  onRangeChange,
  onCategoryChange,
  onReset,
}: StatsFiltersProps) {
  const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });

  const categoryOptions = React.useMemo<ComboboxOption<string>[]>(
    () => [
      { value: "", label: "Tất cả danh mục" },
      ...(categoriesResponse?.data ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    ],
    [categoriesResponse],
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="min-w-44">
          <Combobox<StatisticsRange>
            value={range}
            onChange={(next) =>
              onRangeChange((next || "30d") as StatisticsRange)
            }
            options={rangeOptions}
            searchable={false}
            renderTrigger={(opt) => (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-text-primary text-xs font-medium">
                  {opt?.label ?? "30 ngày qua"}
                </span>
              </span>
            )}
          />
        </div>

        <div className="min-w-48">
          <Combobox<string>
            value={categoryId}
            onChange={(next) => onCategoryChange(next)}
            options={categoryOptions}
            searchPlaceholder="Tìm danh mục..."
            renderTrigger={(opt) => (
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-secondary" />
                <span className="text-text-primary text-xs font-medium">
                  {opt?.label ?? "Tất cả danh mục"}
                </span>
              </span>
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onReset}
          className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          Làm mới
        </button>
      </div>
    </div>
  );
}
