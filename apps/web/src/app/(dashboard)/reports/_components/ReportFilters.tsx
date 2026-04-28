"use client";

import React from "react";
import { Calendar, Download } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";

const categoryOptions: ComboboxOption<string>[] = [
  { value: "", label: "Tất cả" },
  { value: "1", label: "Điện tử" },
  { value: "2", label: "Điện lạnh" },
];

export function ReportFilters() {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [category, setCategory] = React.useState<string>("");

  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
          Từ ngày
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
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
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors min-w-44"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-44">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
          Danh mục
        </label>
        <Combobox<string>
          value={category}
          onChange={(next) => setCategory(next)}
          options={categoryOptions}
          placeholder="Tất cả"
          clearable={Boolean(category)}
        />
      </div>

      <button
        type="button"
        className="mt-5 ml-auto flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
      >
        <Download className="w-4 h-4" /> Xuất Excel
      </button>
    </div>
  );
}
