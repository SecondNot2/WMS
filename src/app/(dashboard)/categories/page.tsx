"use client";

import React from "react";
import Link from "next/link";
import { Plus, Tag, FileUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { CategoryTable } from "./_components/CategoryTable";
import { CategoryFilters } from "./_components/CategoryFilters";

export default function CategoriesPage() {
  return (
    <div className="p-5 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Danh sách danh mục
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý và phân loại nhóm hàng hóa trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/categories/import"
            className="flex items-center gap-2 bg-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <FileUp className="w-4 h-4" /> Nhập Excel
          </Link>
          <Link
            href="/categories/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Thêm danh mục
          </Link>
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Tổng danh mục"
          value="24"
          icon={Tag}
          iconBg="bg-accent/10 text-accent"
          trend={{ value: "2", isUp: true }}
        />
        <StatsCard
          label="Đang hoạt động"
          value="20"
          icon={Tag}
          iconBg="bg-success/10 text-success"
        />
        <StatsCard
          label="Tạm dừng"
          value="4"
          icon={Tag}
          iconBg="bg-warning/10 text-warning"
        />
        <StatsCard
          label="Tổng sản phẩm"
          value="1,248"
          icon={Tag}
          iconBg="bg-info/10 text-info"
        />
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm">
        {/* Filters + Table */}
        <div className="p-5">
          <CategoryFilters />
          <CategoryTable />
        </div>
      </div>
    </div>
  );
}
