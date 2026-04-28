"use client";

import React from "react";
import {
  Timer,
  Target,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EfficiencyData } from "@wms/types";

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: React.ElementType;
  color: string;
}

function MetricCard({
  label,
  value,
  trend,
  isUp,
  icon: Icon,
  color,
}: MetricCardProps) {
  return (
    <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div
          className={cn(
            "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded",
            isUp ? "text-success bg-success/10" : "text-danger bg-danger/10",
          )}
        >
          {isUp ? (
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
          )}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-1">
          {label}
        </p>
        <h4 className="text-xl font-bold text-text-primary tracking-tight">
          {value}
        </h4>
      </div>
    </div>
  );
}

interface EfficiencyMetricsProps {
  data?: EfficiencyData;
  isLoading?: boolean;
}

export function EfficiencyMetrics({ data, isLoading }: EfficiencyMetricsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-28 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="Tỉ lệ quay vòng"
        value={`${data.turnoverRate.toFixed(1)}x`}
        trend={`${data.outboundFulfillmentRate.toFixed(1)}%`}
        isUp={data.outboundFulfillmentRate >= 90}
        icon={Repeat}
        color="bg-accent"
      />
      <MetricCard
        label="Độ chính xác"
        value={`${data.stockAccuracy.toFixed(1)}%`}
        trend={`${data.approvalRate.toFixed(1)}%`}
        isUp={data.stockAccuracy >= 95}
        icon={Target}
        color="bg-success"
      />
      <MetricCard
        label="TG Xử lý TB"
        value={`${data.avgApprovalTime.toFixed(1)} giờ`}
        trend={`${data.inboundFulfillmentRate.toFixed(1)}%`}
        isUp={data.avgApprovalTime <= 4}
        icon={Timer}
        color="bg-info"
      />
    </div>
  );
}
