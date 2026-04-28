"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";

type Severity = "" | "CRITICAL" | "WARNING" | "INFO";
type AlertKind = "" | "STOCK" | "WORKFLOW" | "SYSTEM";

const severityOptions: ComboboxOption<Severity>[] = [
  { value: "", label: "Tất cả" },
  { value: "CRITICAL", label: "Nghiêm trọng" },
  { value: "WARNING", label: "Cảnh báo" },
  { value: "INFO", label: "Thông tin" },
];

const kindOptions: ComboboxOption<AlertKind>[] = [
  { value: "", label: "Tất cả" },
  { value: "STOCK", label: "Tồn kho" },
  { value: "WORKFLOW", label: "Quy trình" },
  { value: "SYSTEM", label: "Hệ thống" },
];

export function AlertFilters() {
  const [search, setSearch] = React.useState("");
  const [severity, setSeverity] = React.useState<Severity>("");
  const [kind, setKind] = React.useState<AlertKind>("");

  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm nội dung thông báo..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-40">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Mức độ
          </label>
          <Combobox<Severity>
            value={severity}
            onChange={(next) => setSeverity((next || "") as Severity)}
            options={severityOptions}
            searchable={false}
          />
        </div>

        <div className="flex flex-col gap-1 min-w-40">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Loại
          </label>
          <Combobox<AlertKind>
            value={kind}
            onChange={(next) => setKind((next || "") as AlertKind)}
            options={kindOptions}
            searchable={false}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setSeverity("");
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
