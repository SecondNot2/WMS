"use client";

import React from "react";
import { Calendar, ChevronDown, Filter } from "lucide-react";

export function StatsFilters() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <select className="pl-9 pr-8 py-2 bg-background-app border border-border-ui rounded-lg text-xs font-medium text-text-primary outline-none focus:border-accent appearance-none min-w-35 w-full">
            <option>Tháng này</option>
            <option>Tháng trước</option>
            <option>3 tháng qua</option>
            <option>6 tháng qua</option>
            <option>Năm nay</option>
            <option>Tùy chỉnh...</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>

        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <select className="pl-9 pr-8 py-2 bg-background-app border border-border-ui rounded-lg text-xs font-medium text-text-primary outline-none focus:border-accent appearance-none min-w-40 w-full">
            <option>Tất cả danh mục</option>
            <option>Điện tử</option>
            <option>Điện lạnh</option>
            <option>Gia dụng</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
          Làm mới
        </button>
        <button className="flex-1 sm:flex-none px-4 py-2 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
          Áp dụng
        </button>
      </div>
    </div>
  );
}
