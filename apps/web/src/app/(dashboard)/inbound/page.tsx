"use client";

import React from "react";
import { Plus, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { InboundStats } from "./_components/InboundStats";
import {
  InboundFilters,
  type InboundFilterValues,
} from "./_components/InboundFilters";
import { InboundTable } from "./_components/InboundTable";
import { inboundApi } from "@/lib/api/inbound";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";

const DEFAULT_FILTERS: InboundFilterValues = {
  search: "",
  status: "",
  supplierId: "",
  from: "",
  to: "",
};

export default function InboundPage() {
  const [filters, setFilters] =
    React.useState<InboundFilterValues>(DEFAULT_FILTERS);
  const [exporting, setExporting] = React.useState(false);
  const toast = useToast();

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const params = {
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.supplierId && { supplierId: filters.supplierId }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
      };
      const blob = await inboundApi.exportExcel(params);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inbound-${new Date().toISOString().slice(0, 10)}.xlsx`;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Quản lý nhập kho
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi và phê duyệt các phiếu nhập kho hàng hóa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? "Đang xuất..." : "Xuất báo cáo"}
          </button>
          <Link
            href="/inbound/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Lập phiếu nhập
          </Link>
        </div>
      </div>

      <InboundStats />

      <InboundFilters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
      <InboundTable filters={filters} />
    </div>
  );
}
