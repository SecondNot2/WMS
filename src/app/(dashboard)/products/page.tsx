"use client";

import React from "react";
import Link from "next/link";
import { Plus, Download, FileUp } from "lucide-react";
import { ProductTable } from "./_components/ProductTable";
import { ProductFilters } from "./_components/ProductFilters";
import { ProductStatsSidebar } from "./_components/ProductStatsSidebar";
import { RecentProductChanges } from "./_components/RecentProductChanges";

export default function ProductsPage() {
  return (
    <div className="p-5 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Danh sách sản phẩm
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý toàn bộ hàng hóa trong kho
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
          <Link 
            href="/products/import"
            className="flex items-center gap-2 bg-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <FileUp className="w-4 h-4" /> Nhập Excel
          </Link>
          <Link 
            href="/products/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Main Content Area */}
        <div className="xl:col-span-10 space-y-5">
          <ProductFilters />
          <ProductTable />
        </div>

        {/* Sidebar Area */}
        <div className="xl:col-span-2 h-full">
          <ProductStatsSidebar className="h-full" />
        </div>
      </div>

      {/* Full Width Section */}
      <RecentProductChanges />
    </div>
  );
}
