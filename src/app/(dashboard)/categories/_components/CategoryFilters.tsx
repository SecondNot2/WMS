"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

export function CategoryFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên danh mục..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-border-ui rounded-lg bg-background-app focus:outline-none focus:border-accent transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2 focus:outline-none focus:border-accent min-w-37.5">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Tạm dừng</option>
        </select>
        
        <button className="flex items-center gap-2 px-3 py-2 border border-border-ui rounded-lg text-sm font-medium text-text-primary hover:bg-background-app transition-colors">
          <Filter className="w-4 h-4" /> Bộ lọc khác
        </button>
      </div>
    </div>
  );
}
