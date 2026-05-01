"use client";

import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { cn } from "@/lib/utils";

export type SupplierStatusFilter = "active" | "inactive" | "all";

export interface SupplierFiltersValue {
  search: string;
  status: SupplierStatusFilter;
}

export const defaultSupplierFiltersValue: SupplierFiltersValue = {
  search: "",
  status: "active",
};

interface SupplierFiltersConnectedProps {
  value: SupplierFiltersValue;
  onChange: (next: SupplierFiltersValue) => void;
}

const statusOptions: ComboboxOption<SupplierStatusFilter>[] = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "all", label: "Tất cả" },
];

export function SupplierFiltersConnected({
  value,
  onChange,
}: SupplierFiltersConnectedProps) {
  const isDirty =
    value.search.length > 0 ||
    value.status !== defaultSupplierFiltersValue.status;

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
              placeholder="Tên, mã số thuế, email, SĐT..."
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
              Trạng thái
            </label>
            <Combobox<SupplierStatusFilter>
              value={value.status}
              onChange={(next) =>
                onChange({
                  ...value,
                  status: (next || "active") as SupplierStatusFilter,
                })
              }
              options={statusOptions}
              searchable={false}
            />
          </div>

          <button
            type="button"
            disabled={!isDirty}
            onClick={() => onChange(defaultSupplierFiltersValue)}
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
