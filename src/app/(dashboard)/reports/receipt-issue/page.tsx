"use client";

import React from "react";
import { ReportStats } from "../_components/ReportStats";
import { ReportFilters } from "../_components/ReportFilters";
import { ReceiptIssueChart } from "../_components/ReceiptIssueChart";
import { ReportTable } from "../_components/ReportTable";
import { BarChart3 } from "lucide-react";

export default function ReceiptIssueReportPage() {
  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mt-2">Báo cáo biến động Nhập - Xuất</h1>
        <p className="text-sm text-text-secondary">Phân tích dòng luân chuyển hàng hóa theo thời gian</p>
      </div>

      <ReportStats type="receipt-issue" />

      <ReportFilters />

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-border-ui shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-base font-bold text-text-primary">Biểu đồ so sánh Nhập - Xuất</h3>
          </div>
          <ReceiptIssueChart />
        </div>

        <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-ui">
            <h3 className="text-base font-bold text-text-primary">Bảng kê chi tiết biến động</h3>
          </div>
          <div className="p-6">
            <ReportTable type="receipt-issue" />
          </div>
        </div>
      </div>
    </div>
  );
}
