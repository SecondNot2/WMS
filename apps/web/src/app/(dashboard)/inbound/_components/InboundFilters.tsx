"use client";

import React from "react";
import { Search, RotateCcw, Calendar } from "lucide-react";
import { useSuppliers } from "@/lib/hooks/use-suppliers";
import type { InboundStatus } from "@wms/types";

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
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={value.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Tìm kiếm theo mã phiếu, ghi chú..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Trạng thái
          </label>
          <select
            value={value.status}
            onChange={(e) =>
              update("status", e.target.value as InboundFilterValues["status"])
            }
            className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-40 focus:border-accent"
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Đang chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Nhà cung cấp
          </label>
          <select
            value={value.supplierId}
            onChange={(e) => update("supplierId", e.target.value)}
            className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-48 focus:border-accent"
          >
            <option value="">Tất cả</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
              className="pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors min-w-44"
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
              className="pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors min-w-44"
            />
          </div>
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
