"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Download, Clock, CheckCircle2, XCircle } from "lucide-react";

export function InboundStats() {
  // TODO: Replace with useQuery -> GET /dashboard/stats
  const statsData = [
    {
      label: "Phiếu nhập tháng này",
      value: "156",
      trend: { value: "12.5%", isUp: true },
      icon: Download,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Đang chờ duyệt",
      value: "24",
      trend: { value: "2", isUp: true },
      icon: Clock,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Đã duyệt hôm nay",
      value: "12",
      trend: { value: "5", isUp: true },
      icon: CheckCircle2,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Bị từ chối",
      value: "3",
      trend: { value: "1", isUp: false },
      icon: XCircle,
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
