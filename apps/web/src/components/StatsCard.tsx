"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconBg,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-card-white p-3.5 rounded-xl border border-border-ui shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <p className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">
            {label}
          </p>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
            iconBg,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center space-x-1.5">
          <div
            className={cn(
              "flex items-center px-1 py-0.5 rounded text-[10px] font-bold",
              trend.isUp
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger",
            )}
          >
            {trend.isUp ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            )}
            {trend.value}
          </div>
          <span className="text-[10px] text-text-secondary">
            so với tháng trước
          </span>
        </div>
      )}
    </div>
  );
}
