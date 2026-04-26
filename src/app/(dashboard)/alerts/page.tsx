"use client";

import React from "react";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { AlertStats } from "./_components/AlertStats";
import { AlertFilters } from "./_components/AlertFilters";
import { AlertTable } from "./_components/AlertTable";

export default function AlertsPage() {
  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mt-2">Trung tâm thông báo</h1>
          <p className="text-sm text-text-secondary">Theo dõi và xử lý các cảnh báo vận hành và thông báo hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm shadow-sm">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-sm shadow-md shadow-accent/20 transition-all">
            <CheckCheck className="w-4 h-4" /> Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AlertStats />

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-ui bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="text-base font-bold text-text-primary">Tất cả thông báo</h3>
          </div>
          <div className="flex bg-background-app p-1 rounded-lg border border-border-ui shadow-sm">
            <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white text-accent shadow-sm border border-border-ui/50">
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
        <div className="p-6">
          <AlertFilters />
          <AlertTable />
        </div>
      </div>
    </div>
  );
}
