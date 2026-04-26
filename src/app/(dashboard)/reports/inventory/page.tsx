"use client";

import React from "react";
import { ReportStats } from "../_components/ReportStats";
import { ReportFilters } from "../_components/ReportFilters";
import { InventoryValueChart } from "../_components/InventoryValueChart";
import { ReportTable } from "../_components/ReportTable";
import { PieChart as PieIcon } from "lucide-react";

export default function InventoryReportPage() {
  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mt-2">Báo cáo tồn kho Snapshot</h1>
        <p className="text-sm text-text-secondary">Thống kê giá trị và số lượng tồn kho tại thời điểm báo cáo</p>
      </div>

      <ReportStats type="inventory" />

      <ReportFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-border-ui shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-accent" />
            <h3 className="text-base font-bold text-text-primary">Phân bổ giá trị tồn kho</h3>
          </div>
          <InventoryValueChart />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-ui">
            <h3 className="text-base font-bold text-text-primary">Bảng giá trị tồn kho chi tiết</h3>
          </div>
          <div className="p-6">
            <ReportTable type="inventory" />
          </div>
        </div>
      </div>
    </div>
  );
}
