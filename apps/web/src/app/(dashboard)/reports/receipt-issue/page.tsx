"use client";

import React from "react";
import { ReportStats } from "../_components/ReportStats";
import { ReportFilters } from "../_components/ReportFilters";
import { ReceiptIssueChart } from "../_components/ReceiptIssueChart";
import { ReportTable } from "../_components/ReportTable";
import { BarChart3 } from "lucide-react";
import { reportsApi } from "@/lib/api/reports";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";

export default function ReceiptIssueReportPage() {
  const [exporting, setExporting] = React.useState(false);
  const toast = useToast();

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await reportsApi.exportExcel({ type: "receipt-issue" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reports-receipt-issue-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Đã xuất báo cáo Excel");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xuất báo cáo"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Báo cáo biến động Nhập - Xuất
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Phân tích dòng luân chuyển hàng hóa theo thời gian
        </p>
      </div>

      <ReportStats type="receipt-issue" />

      <ReportFilters onExport={handleExport} isExporting={exporting} />

      <div className="grid grid-cols-1 gap-5">
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Biểu đồ so sánh Nhập - Xuất
            </h3>
          </div>
          <ReceiptIssueChart />
        </div>

        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border-ui">
            <h3 className="text-sm font-semibold text-text-primary">
              Bảng kê chi tiết biến động
            </h3>
          </div>
          <div className="p-5">
            <ReportTable type="receipt-issue" />
          </div>
        </div>
      </div>
    </div>
  );
}
