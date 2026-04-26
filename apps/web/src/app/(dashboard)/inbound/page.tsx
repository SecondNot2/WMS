"use client";

import React from "react";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { InboundStats } from "./_components/InboundStats";
import { InboundFilters } from "./_components/InboundFilters";
import { InboundTable } from "./_components/InboundTable";

export default function InboundPage() {
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
          <button className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
          <Link
            href="/inbound/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Lập phiếu nhập
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <InboundStats />

      {/* Filters + Table */}
      <InboundFilters />
      <InboundTable />
    </div>
  );
}
