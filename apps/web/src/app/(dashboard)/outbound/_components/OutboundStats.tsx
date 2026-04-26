"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Upload, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export function OutboundStats() {
  // TODO: Replace with useQuery -> GET /dashboard/stats
  const statsData = [
    {
      label: "Phiếu xuất tháng này",
      value: "132",
      trend: { value: "10.1%", isUp: true },
      icon: Upload,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Đang chờ duyệt",
      value: "18",
      trend: { value: "3", isUp: true },
      icon: Clock,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Đã xuất hôm nay",
      value: "8",
      trend: { value: "2", isUp: true },
      icon: CheckCircle2,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Cảnh báo tồn kho",
      value: "5",
      trend: { value: "1", isUp: false },
      icon: AlertTriangle,
      iconBg: "bg-danger/10 text-danger",
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
