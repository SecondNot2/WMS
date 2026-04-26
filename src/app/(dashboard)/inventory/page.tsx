"use client";

import React, { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { InventoryStats } from "./_components/InventoryStats";
import { InventoryFilters } from "./_components/InventoryFilters";
import { InventoryTable } from "./_components/InventoryTable";
import { AdjustStockModal } from "./_components/AdjustStockModal";

export default function InventoryPage() {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Tồn kho realtime
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi số lượng và trạng thái hàng hóa trong kho theo thời gian
            thực
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            Điều chỉnh tồn kho
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStats />

      {/* Low Stock Alert */}
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/10 rounded-lg text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">
              Phát hiện 42 sản phẩm sắp hết hàng
            </p>
            <p className="text-xs text-text-secondary">
              Hãy kiểm tra và lập phiếu nhập hàng để tránh gián đoạn kinh doanh.
            </p>
          </div>
        </div>
        <button className="text-xs font-bold text-warning hover:underline px-4 py-2">
          Xem danh sách ngay →
        </button>
      </div>

      {/* Filters + Table */}
      <InventoryFilters />
      <InventoryTable />

      {/* Modal */}
      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={{
          sku: "SP000123",
          name: "Tai nghe Bluetooth Sony WH-1000XM4",
          currentStock: 3,
        }}
      />
    </div>
  );
}
