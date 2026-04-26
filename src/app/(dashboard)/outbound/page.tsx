"use client";

import React from "react";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { OutboundStats } from "./_components/OutboundStats";
import { OutboundFilters } from "./_components/OutboundFilters";
import { OutboundTable } from "./_components/OutboundTable";

export default function OutboundPage() {
  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mt-2">Quản lý xuất kho</h1>
          <p className="text-sm text-text-secondary">Theo dõi và phê duyệt các phiếu xuất kho hàng hóa</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm shadow-sm">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
          <Link 
            href="/outbound/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-sm shadow-md shadow-accent/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Lập phiếu xuất
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <OutboundStats />

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-ui bg-white flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">Danh sách phiếu xuất kho</h3>
        </div>
        <div className="p-6">
          <OutboundFilters />
          <OutboundTable />
        </div>
      </div>
    </div>
  );
}
