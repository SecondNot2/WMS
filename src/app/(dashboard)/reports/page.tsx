"use client";

import React from "react";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Báo cáo</h1>
          <p className="text-xs text-text-secondary mt-0.5">Xuất báo cáo tồn kho, nhập xuất định kỳ</p>
        </div>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-text-secondary" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Chưa có báo cáo nào được tạo</h3>
        <p className="text-xs text-text-secondary">Chọn tham số và nhấn "Tạo báo cáo" để bắt đầu</p>
      </div>
    </div>
  );
}
