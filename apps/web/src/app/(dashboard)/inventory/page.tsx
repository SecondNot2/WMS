"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { InventoryStats } from "./_components/InventoryStats";
import {
  InventoryFilters,
  type InventoryStockMode,
} from "./_components/InventoryFilters";
import { InventoryTable } from "./_components/InventoryTable";
import {
  AdjustStockModal,
  type AdjustStockTarget,
} from "./_components/AdjustStockModal";
import { INVENTORY_KEYS, useInventorySummary } from "@/lib/hooks/use-inventory";
import type { InventoryItem } from "@wms/types";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const { data: summary } = useInventorySummary();

  const [search, setSearch] = React.useState("");
  const [stockMode, setStockMode] = React.useState<InventoryStockMode>("all");
  const [categoryId, setCategoryId] = React.useState("");
  const [adjustTarget, setAdjustTarget] =
    React.useState<AdjustStockTarget | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = React.useState(false);

  const handleReset = () => {
    setSearch("");
    setStockMode("all");
    setCategoryId("");
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
  };

  const handleOpenAdjust = (target: AdjustStockTarget | null) => {
    setAdjustTarget(target);
    setIsAdjustOpen(true);
  };

  const handleAdjustFromTable = (item: InventoryItem) => {
    handleOpenAdjust({
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      currentStock: item.currentStock,
    });
  };

  const lowStockCount = summary?.lowStockCount ?? 0;

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
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button
            type="button"
            onClick={() => handleOpenAdjust(null)}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            Điều chỉnh tồn kho
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStats />

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                Phát hiện {lowStockCount} sản phẩm sắp hết hàng
              </p>
              <p className="text-xs text-text-secondary">
                Hãy kiểm tra và lập phiếu nhập hàng để tránh gián đoạn kinh
                doanh.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStockMode("lowStock")}
            className="text-xs font-bold text-warning hover:underline px-4 py-2"
          >
            Xem danh sách ngay →
          </button>
        </div>
      )}

      {/* Filters + Table */}
      <InventoryFilters
        search={search}
        stockMode={stockMode}
        categoryId={categoryId}
        onSearchChange={setSearch}
        onStockModeChange={setStockMode}
        onCategoryChange={setCategoryId}
        onReset={handleReset}
      />
      <InventoryTable
        search={search}
        categoryId={categoryId}
        lowStock={stockMode === "lowStock"}
        onAdjust={handleAdjustFromTable}
      />

      {/* Modal */}
      <AdjustStockModal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        product={adjustTarget}
      />
    </div>
  );
}
