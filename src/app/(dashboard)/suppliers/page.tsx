"use client";

import React from "react";
import { Truck, Plus } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Nhà cung cấp</h1>
          <p className="text-xs text-text-secondary mt-0.5">Quản lý đối tác cung ứng hàng hóa</p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-accent/20">
          <Plus className="w-4 h-4" /> Thêm đối tác
        </button>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
          <Truck className="w-8 h-8 text-text-secondary" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Chưa có nhà cung cấp</h3>
        <p className="text-xs text-text-secondary">Danh sách đối tác sẽ được hiển thị tại đây</p>
      </div>
    </div>
  );
}
