"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { Upload, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useOutboundStats } from "@/lib/hooks/use-outbound";

export function OutboundStats() {
  const { data, isLoading } = useOutboundStats();

  const fmt = (n?: number) => (isLoading ? "…" : String(n ?? 0));

  const statsData = [
    {
      label: "Phiếu xuất tháng này",
      value: fmt(data?.thisMonth),
      icon: Upload,
      iconBg: "bg-accent/10 text-accent",
    },
    {
      label: "Đang chờ duyệt",
      value: fmt(data?.pending),
      icon: Clock,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Đã xuất hôm nay",
      value: fmt(data?.approvedToday),
      icon: CheckCircle2,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Bị từ chối tháng này",
      value: fmt(data?.rejected),
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
