"use client";

import React from "react";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { AlertStats } from "./_components/AlertStats";
import { AlertFilters } from "./_components/AlertFilters";
import { AlertTable } from "./_components/AlertTable";

export default function AlertsPage() {
  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Trung tâm thông báo
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi và xử lý các cảnh báo vận hành và thông báo hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20">
            <CheckCheck className="w-4 h-4" /> Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AlertStats />

      {/* Read-state tabs */}
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary mr-2">
          Tất cả thông báo
        </span>
        <div className="flex bg-card-white p-1 rounded-lg border border-border-ui shadow-sm">
          <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-accent/10 text-accent">
            Mới nhất
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
            Chưa đọc
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
            Đã đọc
          </button>
        </div>
      </div>

      {/* Filters + Table */}
      <AlertFilters />
      <AlertTable />
    </div>
  );
}
