"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Bell, AlertCircle, AlertTriangle, Info } from "lucide-react";

export function AlertStats() {
  // TODO: Replace with useQuery -> GET /dashboard/alerts/summary
  const statsData = [
    {
      label: "Tổng thông báo",
      value: "156",
      icon: Bell,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Nghiêm trọng (Red)",
      value: "12",
      icon: AlertCircle,
      iconBg: "bg-danger/10 text-danger",
    },
    {
      label: "Cần lưu ý (Orange)",
      value: "42",
      icon: AlertTriangle,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Thông báo hệ thống",
      value: "102",
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
