"use client";

import React from "react";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useCategories } from "@/lib/hooks/use-categories";
import type { StatisticsRange } from "@wms/types";
import { cn } from "@/lib/utils";

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
  const [expanded, setExpanded] = React.useState(false);
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
    <div className="sticky top-16 z-20 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left sm:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Filter className="w-4 h-4 text-accent" />
          Bộ lọc thống kê
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-secondary transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "flex-col sm:flex sm:flex-row sm:items-center sm:justify-between gap-4",
          expanded ? "flex mt-4" : "hidden sm:flex",
        )}
      >
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:min-w-44">
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

          <div className="w-full sm:min-w-48">
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
            className="flex-1 sm:flex-none min-h-11 px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors rounded-lg bg-background-app/70 sm:bg-transparent"
          >
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
}
