"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";

export function ProductFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          placeholder="Tìm kiếm theo tên, SKU, mã vạch..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Danh mục
          </label>
          <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-35 focus:border-accent">
            <option>Tất cả</option>
            <option>Thiết bị ngoại vi</option>
            <option>Màn hình</option>
            <option>Laptop</option>
            <option>Linh kiện</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Trạng thái
          </label>
          <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-35 focus:border-accent">
            <option>Tất cả</option>
            <option>Còn hàng</option>
            <option>Sắp hết</option>
            <option>Hết hàng</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Đơn vị
          </label>
          <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-30 focus:border-accent">
            <option>Tất cả</option>
            <option>Cái</option>
            <option>Bộ</option>
            <option>Hộp</option>
            <option>Thùng</option>
          </select>
        </div>

        <button className="mt-5 flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all">
          <RotateCcw className="w-4 h-4" />
          Xóa lọc
        </button>
      </div>
    </div>
  );
}
