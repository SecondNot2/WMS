"use client";

import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { ReceiverFilters } from "./_components/ReceiverFilters";
import { ReceiverStatsSidebar } from "./_components/ReceiverStatsSidebar";
import { ReceiverTable } from "./_components/ReceiverTable";

export default function ReceiversPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Đơn vị nhận hàng
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý các chi nhánh, kho trung chuyển và đối tác nhận hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
          <Link
            href="/receivers/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Thêm đơn vị
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-10 space-y-5">
          <ReceiverFilters />
          <ReceiverTable />
        </div>
        <div className="xl:col-span-2 h-full">
          <ReceiverStatsSidebar className="h-full" />
        </div>
      </div>
    </div>
  );
}
