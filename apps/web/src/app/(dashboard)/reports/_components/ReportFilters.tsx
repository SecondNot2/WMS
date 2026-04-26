"use client";

import React from "react";
import { Calendar, Download } from "lucide-react";

export function ReportFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
          Từ ngày
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Chọn ngày"
            className="pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors min-w-40"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
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
            type="text"
            placeholder="Chọn ngày"
            className="pl-9 pr-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors min-w-40"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
          Danh mục
        </label>
        <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-40 focus:border-accent">
          <option value="">Tất cả</option>
          <option value="1">Điện tử</option>
          <option value="2">Điện lạnh</option>
        </select>
      </div>

      <button className="mt-5 ml-auto flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20">
        <Download className="w-4 h-4" /> Xuất Excel
      </button>
    </div>
  );
}
