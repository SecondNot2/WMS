"use client";

import React from "react";
import { Search, Filter, Calendar } from "lucide-react";

export function OutboundFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-5">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã phiếu, lý do..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-ui rounded-lg bg-background-app focus:outline-none focus:border-accent transition-all shadow-sm"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2.5 focus:outline-none focus:border-accent min-w-40 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Đang chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
        
        <select className="border border-border-ui rounded-lg bg-background-app text-sm px-3 py-2.5 focus:outline-none focus:border-accent min-w-48 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <option value="">Tất cả đơn vị nhận</option>
          <option value="1">Chi nhánh Lạng Sơn</option>
          <option value="2">Kho trung chuyển Hà Nội</option>
          <option value="3">Cửa hàng Outlet</option>
        </select>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Khoảng thời gian"
            className="pl-9 pr-4 py-2.5 border border-border-ui rounded-lg bg-background-app text-sm focus:outline-none focus:border-accent min-w-48 shadow-sm cursor-pointer hover:bg-white transition-colors"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
          />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-all shadow-sm">
          <Filter className="w-4 h-4" /> Bộ lọc khác
        </button>
      </div>
    </div>
  );
}
