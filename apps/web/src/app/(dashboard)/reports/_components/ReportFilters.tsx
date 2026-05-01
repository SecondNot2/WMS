"use client";

import React from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Search,
  Folder,
} from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { cn } from "@/lib/utils";

const categoryOptions: ComboboxOption<string>[] = [
  { value: "", label: "Tất cả danh mục" },
  {
    value: "1",
    label: "Điện tử",
    icon: (
      <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
        <Folder className="w-3.5 h-3.5" />
      </span>
    ),
  },
  {
    value: "2",
    label: "Điện lạnh",
    icon: (
      <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
        <Folder className="w-3.5 h-3.5" />
      </span>
    ),
  },
];

interface ReportFiltersProps {
  search: string;
  from: string;
  to: string;
  categoryId: string;
  onSearchChange: (next: string) => void;
  onFromChange: (next: string) => void;
  onToChange: (next: string) => void;
  onCategoryChange: (next: string) => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export function ReportFilters({
  search,
  from,
  to,
  categoryId,
  onSearchChange,
  onFromChange,
  onToChange,
  onCategoryChange,
  onExport,
  isExporting = false,
}: ReportFiltersProps) {
  const [expanded, setExpanded] = React.useState(false);

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
          "flex-col lg:grid lg:grid-cols-12 gap-4",
          expanded ? "flex mt-4" : "hidden lg:grid",
        )}
      >
        {/* Cột 1: Tìm kiếm */}
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm kiếm nội dung..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Cột 2: Các fields còn lại */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
                Từ ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => onFromChange(e.target.value)}
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
                  value={to}
                  onChange={(e) => onToChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
                Danh mục
              </label>
              <Combobox<string>
                value={categoryId}
                onChange={(next) => onCategoryChange(next)}
                options={categoryOptions}
                placeholder="Tất cả"
                clearable={Boolean(categoryId)}
              />
            </div>

            <button
              type="button"
              onClick={onExport}
              disabled={isExporting}
              className="h-10 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-xs font-bold px-3 rounded-lg transition-colors shadow-lg shadow-accent/20 disabled:opacity-60"
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
      </div>
    </div>
  );
}
