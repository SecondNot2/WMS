"use client";

import React from "react";
import { BarChart } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Thống kê</h1>
          <p className="text-xs text-text-secondary mt-0.5">Phân tích hiệu suất kho và xu hướng hàng hóa</p>
        </div>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
          <BarChart className="w-8 h-8 text-text-secondary" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Dữ liệu thống kê đang được xử lý</h3>
        <p className="text-xs text-text-secondary">Biểu đồ phân tích sẽ hiển thị sau khi thu thập đủ dữ liệu</p>
      </div>
    </div>
  );
}
