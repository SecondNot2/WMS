"use client";

import React from "react";
import { ReportStats } from "../_components/ReportStats";
import { ReportFilters } from "../_components/ReportFilters";
import { InventoryValueChart } from "../_components/InventoryValueChart";
import { ReportTable } from "../_components/ReportTable";
import { PieChart as PieIcon } from "lucide-react";

export default function InventoryReportPage() {
  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Báo cáo tồn kho Snapshot
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Thống kê giá trị và số lượng tồn kho tại thời điểm báo cáo
        </p>
      </div>

      <ReportStats type="inventory" />

      <ReportFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieIcon className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Phân bổ giá trị tồn kho
            </h3>
          </div>
          <InventoryValueChart />
        </div>

        <div className="lg:col-span-2 bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border-ui">
            <h3 className="text-sm font-semibold text-text-primary">
              Bảng giá trị tồn kho chi tiết
            </h3>
          </div>
          <div className="p-5">
            <ReportTable type="inventory" />
          </div>
        </div>
      </div>
    </div>
  );
}
