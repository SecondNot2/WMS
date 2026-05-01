"use client";

import React from "react";
import { Plus, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { OutboundStats } from "./_components/OutboundStats";
import {
  OutboundFilters,
  type OutboundFilterValues,
} from "./_components/OutboundFilters";
import { OutboundTable } from "./_components/OutboundTable";
import { outboundApi } from "@/lib/api/outbound";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";
import { Can } from "@/components/Can";
import { PageHeader } from "@/components/PageHeader";

const DEFAULT_FILTERS: OutboundFilterValues = {
  search: "",
  status: "",
  recipientId: "",
  from: "",
  to: "",
};

export default function OutboundPage() {
  const [filters, setFilters] =
    React.useState<OutboundFilterValues>(DEFAULT_FILTERS);
  const [exporting, setExporting] = React.useState(false);
  const toast = useToast();

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const params = {
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.recipientId && { recipientId: filters.recipientId }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
      };
      const blob = await outboundApi.exportExcel(params);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `outbound-${new Date().toISOString().slice(0, 10)}.xlsx`;
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
      <PageHeader
        title="Quản lý xuất kho"
        description="Theo dõi và phê duyệt các phiếu xuất kho hàng hóa"
        actions={
          <>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting ? "Đang xuất..." : "Xuất báo cáo"}
            </button>
            <Can action="issue.create">
              <Link
                href="/outbound/new"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
              >
                <Plus className="w-4 h-4" /> Lập phiếu xuất
              </Link>
            </Can>
          </>
        }
      />

      <OutboundStats />

      <OutboundFilters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
      <OutboundTable filters={filters} />
    </div>
  );
}
