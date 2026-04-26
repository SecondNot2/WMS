"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, TrendingDown, Layers, DollarSign } from "lucide-react";

export function ReportStats({ type = "receipt-issue" }: { type?: "receipt-issue" | "inventory" }) {
  // TODO: Replace with useQuery -> GET /reports/...
  const receiptIssueStats = [
    {
      label: "Tổng nhập kho",
      value: "420M",
      trend: { value: "12%", isUp: true },
      icon: TrendingUp,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Tổng xuất kho",
      value: "380M",
      trend: { value: "8%", isUp: true },
      icon: TrendingDown,
      iconBg: "bg-danger/10 text-danger",
    },
    {
      label: "Biến động ròng",
      value: "+40M",
      trend: { value: "5%", isUp: true },
      icon: Layers,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Số lượng phiếu",
      value: "288",
      trend: { value: "15", isUp: true },
      icon: DollarSign,
      iconBg: "bg-info/10 text-info",
    },
  ];

  const inventoryStats = [
    {
      label: "Tổng giá trị tồn",
      value: "5.68B",
      trend: { value: "3.2%", isUp: true },
      icon: DollarSign,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "SKU hiện có",
      value: "1.254",
      icon: Layers,
      iconBg: "bg-info/10 text-info",
    },
    {
      label: "Đã hết hàng",
      value: "12",
      icon: TrendingDown,
      iconBg: "bg-danger/10 text-danger",
    },
    {
      label: "Tỉ lệ lấp đầy",
      value: "96%",
      icon: TrendingUp,
      iconBg: "bg-success/10 text-success",
    },
  ];

  const statsData = type === "receipt-issue" ? receiptIssueStats : inventoryStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
    </div>
  );
}
