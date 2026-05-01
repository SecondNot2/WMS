"use client";

import React from "react";
import { Calendar, ChevronDown, Filter, Search } from "lucide-react";
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
  search: string;
  range: StatisticsRange;
  categoryId: string;
  onSearchChange: (next: string) => void;
  onRangeChange: (next: StatisticsRange) => void;
  onCategoryChange: (next: string) => void;
  onReset: () => void;
}

export function StatsFilters({
  search,
  range,
  categoryId,
  onSearchChange,
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
          "flex-col lg:grid lg:grid-cols-12 gap-4",
          expanded ? "flex mt-4" : "hidden lg:grid",
        )}
      >
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
                placeholder="Tìm kiếm sản phẩm..."
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
                Thời gian
              </label>
              <Combobox<StatisticsRange>
                value={range}
                onChange={(next) =>
                  onRangeChange((next || "30d") as StatisticsRange)
                }
                options={rangeOptions}
                searchable={false}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
                Danh mục
              </label>
              <Combobox<string>
                value={categoryId}
                onChange={(next) => onCategoryChange(next)}
                options={categoryOptions}
                searchPlaceholder="Tìm danh mục..."
              />
            </div>

            <button
              onClick={onReset}
              className="h-10 flex items-center justify-center gap-2 px-3 text-xs font-bold text-text-secondary hover:text-accent hover:bg-accent/5 transition-all rounded-lg border border-transparent hover:border-accent/20"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
