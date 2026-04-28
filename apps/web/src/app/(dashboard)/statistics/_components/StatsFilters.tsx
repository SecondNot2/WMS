"use client";

import React from "react";
import { Calendar, Filter } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";

const rangeOptions: ComboboxOption<string>[] = [
  { value: "this-month", label: "Tháng này" },
  { value: "last-month", label: "Tháng trước" },
  { value: "3m", label: "3 tháng qua" },
  { value: "6m", label: "6 tháng qua" },
  { value: "year", label: "Năm nay" },
  { value: "custom", label: "Tùy chỉnh..." },
];

const categoryOptions: ComboboxOption<string>[] = [
  { value: "", label: "Tất cả danh mục" },
  { value: "1", label: "Điện tử" },
  { value: "2", label: "Điện lạnh" },
  { value: "3", label: "Gia dụng" },
];

export function StatsFilters() {
  const [range, setRange] = React.useState<string>("this-month");
  const [category, setCategory] = React.useState<string>("");

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="min-w-44">
          <Combobox<string>
            value={range}
            onChange={(next) => setRange(next || "this-month")}
            options={rangeOptions}
            searchable={false}
            renderTrigger={(opt) => (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-text-primary text-xs font-medium">
                  {opt?.label ?? "Tháng này"}
                </span>
              </span>
            )}
          />
        </div>

        <div className="min-w-48">
          <Combobox<string>
            value={category}
            onChange={(next) => setCategory(next)}
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
        <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
          Làm mới
        </button>
        <button className="flex-1 sm:flex-none px-4 py-2 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
          Áp dụng
        </button>
      </div>
    </div>
  );
}
