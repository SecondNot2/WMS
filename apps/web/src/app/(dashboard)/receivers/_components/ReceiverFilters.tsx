"use client";

import React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";

export function ReceiverFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          placeholder="Tìm theo tên đơn vị, người liên hệ, email, số điện thoại..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Trạng thái</label>
          <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-35 focus:border-accent">
            <option value="">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Loại đơn vị</label>
          <select className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-35 focus:border-accent">
            <option value="">Tất cả</option>
            <option value="branch">Chi nhánh</option>
            <option value="warehouse">Kho trung chuyển</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>

        <button className="mt-5 flex items-center gap-2 px-3 py-2 border border-border-ui rounded-lg text-sm font-medium text-text-primary hover:bg-background-app transition-colors">
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>

        <button className="mt-5 flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all">
          <RotateCcw className="w-4 h-4" /> Xóa lọc
        </button>
      </div>
    </div>
  );
}
