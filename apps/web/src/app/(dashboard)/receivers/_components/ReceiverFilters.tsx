"use client";

import React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";

type ReceiverStatus = "" | "ACTIVE" | "INACTIVE";
type ReceiverKind = "" | "branch" | "warehouse" | "customer";

const statusOptions: ComboboxOption<ReceiverStatus>[] = [
  { value: "", label: "Tất cả" },
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Tạm dừng" },
];

const kindOptions: ComboboxOption<ReceiverKind>[] = [
  { value: "", label: "Tất cả" },
  { value: "branch", label: "Chi nhánh" },
  { value: "warehouse", label: "Kho trung chuyển" },
  { value: "customer", label: "Khách hàng" },
];

export function ReceiverFilters() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ReceiverStatus>("");
  const [kind, setKind] = React.useState<ReceiverKind>("");

  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên đơn vị, người liên hệ, email, số điện thoại..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-36">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Trạng thái
          </label>
          <Combobox<ReceiverStatus>
            value={status}
            onChange={(next) => setStatus((next || "") as ReceiverStatus)}
            options={statusOptions}
            searchable={false}
          />
        </div>

        <div className="flex flex-col gap-1 min-w-44">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Loại đơn vị
          </label>
          <Combobox<ReceiverKind>
            value={kind}
            onChange={(next) => setKind((next || "") as ReceiverKind)}
            options={kindOptions}
            searchable={false}
          />
        </div>

        <button
          type="button"
          className="mt-5 flex items-center gap-2 px-3 py-2 border border-border-ui rounded-lg text-sm font-medium text-text-primary hover:bg-background-app transition-colors"
        >
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatus("");
            setKind("");
          }}
          className="mt-5 flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Xóa lọc
        </button>
      </div>
    </div>
  );
}
