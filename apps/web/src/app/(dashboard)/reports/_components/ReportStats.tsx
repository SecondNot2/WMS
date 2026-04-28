"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, TrendingDown, Layers, DollarSign } from "lucide-react";
import { useReportStats } from "@/lib/hooks/use-reports";

export function ReportStats({
  type = "receipt-issue",
}: {
  type?: "receipt-issue" | "inventory";
}) {
  const { data, isLoading, error } = useReportStats({ type });

  const receiptIssueStats = [
    {
      label: "Tổng nhập kho",
      value: data?.[0]?.value ?? 0,
      trend:
        data?.[0]?.trend !== undefined
          ? { value: `${data[0].trend}%`, isUp: data[0].trend >= 0 }
          : undefined,
      icon: TrendingUp,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Tổng xuất kho",
      value: data?.[1]?.value ?? 0,
      trend:
        data?.[1]?.trend !== undefined
          ? { value: `${data[1].trend}%`, isUp: data[1].trend >= 0 }
          : undefined,
      icon: TrendingDown,
      iconBg: "bg-danger/10 text-danger",
    },
    {
      label: "Biến động ròng",
      value: data?.[2]?.value ?? 0,
      trend:
        data?.[2]?.trend !== undefined
          ? { value: `${data[2].trend}%`, isUp: data[2].trend >= 0 }
          : undefined,
      icon: Layers,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Số lượng phiếu",
      value: data?.[3]?.value ?? 0,
      trend:
        data?.[3]?.trend !== undefined
          ? { value: `${data[3].trend}%`, isUp: data[3].trend >= 0 }
          : undefined,
      icon: DollarSign,
      iconBg: "bg-info/10 text-info",
    },
  ];

  const inventoryStats = [
    {
      label: "Tổng giá trị tồn",
      value: data?.[0]?.value ?? 0,
      icon: DollarSign,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "SKU hiện có",
      value: data?.[1]?.value ?? 0,
      icon: Layers,
      iconBg: "bg-info/10 text-info",
    },
    {
      label: "Đã hết hàng",
      value: data?.[2]?.value ?? 0,
      icon: TrendingDown,
      iconBg: "bg-danger/10 text-danger",
    },
    {
      label: "Tỉ lệ lấp đầy",
      value: `${data?.[3]?.value ?? 0}%`,
      icon: TrendingUp,
      iconBg: "bg-success/10 text-success",
    },
  ];

  const statsData =
    type === "receipt-issue" ? receiptIssueStats : inventoryStats;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 bg-background-app animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl p-4">
        Không thể tải thống kê báo cáo
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
    </div>
  );
}
