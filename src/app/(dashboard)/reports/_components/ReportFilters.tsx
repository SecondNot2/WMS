"use client";

import React from "react";
import { Calendar, Filter, Download } from "lucide-react";

export function ReportFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Từ ngày"
            className="pl-9 pr-4 py-2.5 border border-border-ui rounded-lg bg-background-app text-sm focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-all"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
          />
        </div>
        
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Đến ngày"
            className="pl-9 pr-4 py-2.5 border border-border-ui rounded-lg bg-background-app text-sm focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-all"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
          />
        </div>

        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2.5 focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <option value="">Tất cả danh mục</option>
          <option value="1">Điện tử</option>
          <option value="2">Điện lạnh</option>
        </select>
        
        <button className="flex items-center gap-2 px-4 py-2.5 bg-background-app border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-white transition-all shadow-sm">
          <Filter className="w-4 h-4" /> Lọc báo cáo
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-md shadow-accent/20 transition-all">
          <Download className="w-4 h-4" /> Xuất Excel (.xlsx)
        </button>
      </div>
    </div>
  );
}
