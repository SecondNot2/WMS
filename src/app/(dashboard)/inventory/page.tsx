"use client";

import React, { useState } from "react";
import { Search, Download, AlertTriangle, RefreshCw } from "lucide-react";
import { InventoryStats } from "./_components/InventoryStats";
import { InventoryFilters } from "./_components/InventoryFilters";
import { InventoryTable } from "./_components/InventoryTable";
import { AdjustStockModal } from "./_components/AdjustStockModal";

export default function InventoryPage() {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mt-2">Tồn kho Realtime</h1>
          <p className="text-sm text-text-secondary">Theo dõi số lượng và trạng thái hàng hóa trong kho theo thời gian thực</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm shadow-sm">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button 
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-sm shadow-md shadow-accent/20 transition-all"
          >
            Điều chỉnh tồn kho
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStats />

      {/* Alert Banner for Low Stock (Optional but good UX) */}
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/10 rounded-lg text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Phát hiện 42 sản phẩm sắp hết hàng</p>
            <p className="text-xs text-text-secondary">Hãy kiểm tra và lập phiếu nhập hàng để tránh gián đoạn kinh doanh.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-warning hover:underline px-4 py-2">
          Xem danh sách ngay →
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-ui bg-white flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">Bảng theo dõi tồn kho chi tiết</h3>
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Đang cập nhật trực tuyến
          </div>
        </div>
        <div className="p-6">
          <InventoryFilters />
          <InventoryTable />
        </div>
      </div>

      {/* Modal */}
      <AdjustStockModal 
        isOpen={isAdjustModalOpen} 
        onClose={() => setIsAdjustModalOpen(false)} 
        product={{ sku: "SP000123", name: "Tai nghe Bluetooth Sony WH-1000XM4", currentStock: 3 }}
      />
    </div>
  );
}
