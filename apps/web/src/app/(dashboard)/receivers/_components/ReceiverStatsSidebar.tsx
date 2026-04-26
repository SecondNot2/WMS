"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Clock, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Tổng đơn vị", value: "54", icon: Building2, bg: "bg-accent/10", color: "text-accent" },
  { label: "Đang hoạt động", value: "49", percentage: "90.7%", icon: CheckCircle2, bg: "bg-success/10", color: "text-success" },
  { label: "Tạm dừng", value: "5", percentage: "9.3%", icon: Clock, bg: "bg-warning/10", color: "text-warning" },
  { label: "Phiếu xuất tháng", value: "132", icon: FileUp, bg: "bg-info/10", color: "text-info" },
];

const topReceivers = [
  { name: "Kho trung chuyển Hà Nội", value: "980M" },
  { name: "Chi nhánh Lạng Sơn", value: "452M" },
  { name: "Cửa hàng Outlet", value: "126M" },
  { name: "Đại lý Quảng Ninh", value: "84M" },
];

export function ReceiverStatsSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Tổng quan đơn vị nhận</h3>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-text-primary">{stat.value}</span>
                  {stat.percentage && <span className="text-[11px] text-text-secondary">({stat.percentage})</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Top theo giá trị xuất</h3>
        <div className="space-y-1 flex-1">
          {topReceivers.map((receiver, index) => (
            <div key={receiver.name} className="flex items-center justify-between py-2 px-2 hover:bg-background-app rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-warning/10 text-warning text-[10px] font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary truncate">{receiver.name}</span>
              </div>
              <span className="text-xs font-bold text-text-primary bg-background-app px-2 py-0.5 rounded-full">{receiver.value}</span>
            </div>
          ))}
        </div>
        <Link href="/outbound" className="w-full mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-accent hover:underline py-2 border border-accent/20 rounded-lg bg-accent/5 shrink-0 transition-all hover:bg-accent/10">
          Xem phiếu xuất gần đây <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
