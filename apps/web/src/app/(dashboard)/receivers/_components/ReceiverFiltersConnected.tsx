"use client";

import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { cn } from "@/lib/utils";

export type ReceiverStatusFilter = "active" | "inactive" | "all";

export interface ReceiverFiltersValue {
  search: string;
  status: ReceiverStatusFilter;
}

export const defaultReceiverFiltersValue: ReceiverFiltersValue = {
  search: "",
  status: "active",
};

interface ReceiverFiltersConnectedProps {
  value: ReceiverFiltersValue;
  onChange: (next: ReceiverFiltersValue) => void;
}

const statusOptions: ComboboxOption<ReceiverStatusFilter>[] = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "all", label: "Tất cả" },
];

export function ReceiverFiltersConnected({
  value,
  onChange,
}: ReceiverFiltersConnectedProps) {
  const isDirty =
    value.search.length > 0 ||
    value.status !== defaultReceiverFiltersValue.status;

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
              placeholder="Tên đơn vị, email, SĐT..."
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
            <Combobox<ReceiverStatusFilter>
              value={value.status}
              onChange={(next) =>
                onChange({
                  ...value,
                  status: (next || "active") as ReceiverStatusFilter,
                })
              }
              options={statusOptions}
              searchable={false}
            />
          </div>

          <button
            type="button"
            disabled={!isDirty}
            onClick={() => onChange(defaultReceiverFiltersValue)}
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
