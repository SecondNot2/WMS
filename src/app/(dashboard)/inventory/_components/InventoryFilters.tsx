"use client";

import React from "react";
import { Search, Filter, AlertTriangle } from "lucide-react";

export function InventoryFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-ui rounded-lg bg-background-app focus:outline-none focus:border-accent transition-all shadow-sm"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-background-app p-1 rounded-lg border border-border-ui shadow-sm">
          <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white text-accent shadow-sm border border-border-ui/50">
            Tất cả
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            Cần nhập hàng
          </button>
        </div>

        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2.5 focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <option value="">Tất cả danh mục</option>
          <option value="1">Điện tử</option>
          <option value="2">Điện lạnh</option>
          <option value="3">Gia dụng</option>
        </select>
        
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-all shadow-sm">
          <Filter className="w-4 h-4" /> Xuất Excel
        </button>
      </div>
    </div>
  );
}
