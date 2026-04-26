"use client";

import React from "react";
import { Search, Filter, CheckCheck } from "lucide-react";

export function AlertFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Tìm kiếm nội dung thông báo..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-ui rounded-lg bg-background-app focus:outline-none focus:border-accent transition-all shadow-sm"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2.5 focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <option value="">Tất cả mức độ</option>
          <option value="CRITICAL">Nghiêm trọng</option>
          <option value="WARNING">Cảnh báo</option>
          <option value="INFO">Thông tin</option>
        </select>
        
        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2.5 focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <option value="">Tất cả loại</option>
          <option value="STOCK">Tồn kho</option>
          <option value="WORKFLOW">Quy trình</option>
          <option value="SYSTEM">Hệ thống</option>
        </select>
        
        <button className="flex items-center gap-2 px-4 py-2.5 bg-background-app border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-white transition-all shadow-sm">
          <CheckCheck className="w-4 h-4 text-accent" /> Đánh dấu đã đọc tất cả
        </button>
      </div>
    </div>
  );
}
