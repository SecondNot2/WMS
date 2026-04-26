"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Package, Database, AlertCircle, Info } from "lucide-react";

export function InventoryStats() {
  // TODO: Replace with useQuery -> GET /dashboard/stats & /stock/summary
  const statsData = [
    {
      label: "Tổng số mặt hàng",
      value: "1.254",
      trend: { value: "12", isUp: true },
      icon: Package,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Tổng tồn kho (Đơn vị)",
      value: "25.680",
      trend: { value: "2.5%", isUp: true },
      icon: Database,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Cần nhập hàng",
      value: "42",
      trend: { value: "8", isUp: true },
      icon: AlertCircle,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Giá trị tồn kho",
      value: "5.68B",
      trend: { value: "3.7%", isUp: true },
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
