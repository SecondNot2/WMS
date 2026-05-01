"use client";

import React from "react";
import { Search, RotateCcw, Calendar, Truck } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useSuppliers } from "@/lib/hooks/use-suppliers";
import type { InboundStatus } from "@wms/types";

const statusOptions: ComboboxOption<"" | InboundStatus>[] = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Đang chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Đã từ chối" },
];

export interface InboundFilterValues {
  search: string;
  status: "" | InboundStatus;
  supplierId: string;
  from: string;
  to: string;
}

interface InboundFiltersProps {
  value: InboundFilterValues;
  onChange: (next: InboundFilterValues) => void;
  onReset: () => void;
}

export function InboundFilters({
  value,
  onChange,
  onReset,
}: InboundFiltersProps) {
  const { data: suppliersData } = useSuppliers({ limit: 100 });
  const suppliers = suppliersData?.data ?? [];

  const update = <K extends keyof InboundFilterValues>(
    key: K,
    next: InboundFilterValues[K],
  ) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      {/* Cột 1: Tìm kiếm */}
      <div className="lg:col-span-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              value={value.search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Mã phiếu, ghi chú..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Cột 2: Các fields còn lại */}
      <div className="lg:col-span-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Trạng thái
            </label>
            <Combobox<"" | InboundStatus>
              value={value.status}
              onChange={(next) =>
                update("status", (next || "") as InboundFilterValues["status"])
              }
              options={statusOptions}
              searchable={false}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Nhà cung cấp
            </label>
            <Combobox<string>
              value={value.supplierId}
              onChange={(next) => update("supplierId", next)}
              options={[
                { value: "", label: "Tất cả" },
                ...suppliers.map<ComboboxOption<string>>((s) => ({
                  value: s.id,
                  label: s.name,
                  description: [s.taxCode, s.phone].filter(Boolean).join(" · "),
                  icon: (
                    <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5" />
                    </span>
                  ),
                })),
              ]}
              placeholder="Tất cả"
              searchPlaceholder="Tìm nhà cung cấp..."
              clearable={Boolean(value.supplierId)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Từ ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="date"
                value={value.from}
                onChange={(e) => update("from", e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Đến ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="date"
                value={value.to}
                onChange={(e) => update("to", e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
              />
            </div>
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
