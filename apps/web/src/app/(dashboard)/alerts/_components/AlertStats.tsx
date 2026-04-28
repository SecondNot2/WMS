"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Bell, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useAlertStats } from "@/lib/hooks/use-alerts";

export function AlertStats() {
  const { data, isLoading } = useAlertStats();

  const statsData = [
    {
      label: "Tổng thông báo",
      value: isLoading ? "..." : String(data?.totalAlerts ?? 0),
      icon: Bell,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Nghiêm trọng (Red)",
      value: isLoading ? "..." : String(data?.criticalCount ?? 0),
      icon: AlertCircle,
      iconBg: "bg-danger/10 text-danger",
    },
    {
      label: "Cần lưu ý (Orange)",
      value: isLoading ? "..." : String(data?.warningCount ?? 0),
      icon: AlertTriangle,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Danh mục ảnh hưởng",
      value: isLoading ? "..." : String(data?.affectedCategories ?? 0),
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
