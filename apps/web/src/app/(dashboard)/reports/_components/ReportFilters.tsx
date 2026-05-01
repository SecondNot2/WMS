"use client";

import React from "react";
import { Calendar, ChevronDown, Download, Filter, Loader2 } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { cn } from "@/lib/utils";

const categoryOptions: ComboboxOption<string>[] = [
  { value: "", label: "Tất cả" },
  { value: "1", label: "Điện tử" },
  { value: "2", label: "Điện lạnh" },
];

interface ReportFiltersProps {
  onExport?: () => void;
  isExporting?: boolean;
}

export function ReportFilters({
  onExport,
  isExporting = false,
}: ReportFiltersProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [category, setCategory] = React.useState<string>("");

  return (
    <div className="sticky top-16 z-20 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left sm:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Filter className="w-4 h-4 text-accent" />
          Bộ lọc báo cáo
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
          "flex-col sm:flex sm:flex-row sm:flex-wrap sm:items-end gap-3",
          expanded ? "flex mt-4" : "hidden sm:flex",
        )}
      >
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Từ ngày
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full sm:min-w-44 min-h-11 pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Đến ngày
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full sm:min-w-44 min-h-11 pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:min-w-44">
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
          onClick={onExport}
          disabled={isExporting}
          className="w-full sm:w-auto sm:ml-auto flex min-h-11 items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20 disabled:opacity-60"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? "Đang xuất..." : "Xuất Excel"}
        </button>
      </div>
    </div>
  );
}
