"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Package, Database, AlertCircle, Info } from "lucide-react";
import { useInventorySummary } from "@/lib/hooks/use-inventory";

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

export function InventoryStats() {
  const { data, isLoading } = useInventorySummary();

  const placeholder = "...";
  const totalProducts = isLoading
    ? placeholder
    : new Intl.NumberFormat("vi-VN").format(data?.totalProducts ?? 0);
  const totalStock = isLoading
    ? placeholder
    : new Intl.NumberFormat("vi-VN").format(data?.totalStock ?? 0);
  const lowStockCount = isLoading
    ? placeholder
    : new Intl.NumberFormat("vi-VN").format(data?.lowStockCount ?? 0);
  const totalValue = isLoading
    ? placeholder
    : `${formatCompactCurrency(data?.totalValue ?? 0)}đ`;

  const statsData = [
    {
      label: "Tổng số mặt hàng",
      value: totalProducts,
      icon: Package,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Tổng tồn kho (Đơn vị)",
      value: totalStock,
      icon: Database,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Cần nhập hàng",
      value: lowStockCount,
      icon: AlertCircle,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Giá trị tồn kho",
      value: totalValue,
      icon: Info,
      iconBg: "bg-info/10 text-info",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
    </div>
  );
}
