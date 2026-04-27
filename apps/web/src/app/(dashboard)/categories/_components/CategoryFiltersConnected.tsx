"use client";

import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type CategoryStatusFilter = "active" | "inactive" | "all";

export interface CategoryFiltersValue {
  search: string;
  status: CategoryStatusFilter;
}

export const defaultCategoryFiltersValue: CategoryFiltersValue = {
  search: "",
  status: "active",
};

interface CategoryFiltersConnectedProps {
  value: CategoryFiltersValue;
  onChange: (next: CategoryFiltersValue) => void;
}

const statusOptions: { value: CategoryStatusFilter; label: string }[] = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã ngưng" },
  { value: "all", label: "Tất cả" },
];

export function CategoryFiltersConnected({
  value,
  onChange,
}: CategoryFiltersConnectedProps) {
  const isDirty =
    value.search.length > 0 || value.status !== defaultCategoryFiltersValue.status;

  return (
    <div className="flex flex-wrap items-end gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={value.search}
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
          placeholder="Tìm kiếm theo tên, mô tả..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
          Trạng thái
        </label>
        <select
          value={value.status}
          onChange={(event) =>
            onChange({
              ...value,
              status: event.target.value as CategoryStatusFilter,
            })
          }
          className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-44 focus:border-accent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={!isDirty}
        onClick={() => onChange(defaultCategoryFiltersValue)}
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
    </div>
  );
}
