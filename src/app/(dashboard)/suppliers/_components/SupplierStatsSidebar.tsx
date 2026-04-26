"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileDown, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Tổng nhà cung cấp", value: "76", icon: Truck, bg: "bg-accent/10", color: "text-accent" },
  { label: "Đang hoạt động", value: "68", percentage: "89.5%", icon: CheckCircle2, bg: "bg-success/10", color: "text-success" },
  { label: "Tạm dừng", value: "8", percentage: "10.5%", icon: Clock, bg: "bg-warning/10", color: "text-warning" },
  { label: "Phiếu nhập tháng", value: "156", icon: FileDown, bg: "bg-info/10", color: "text-info" },
];

const topSuppliers = [
  { name: "Samsung Vina", value: "1.28B" },
  { name: "Dell Global", value: "740M" },
  { name: "Công ty TNHH An Phát", value: "568M" },
  { name: "Logitech VN", value: "245M" },
];

export function SupplierStatsSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Tổng quan nhà cung cấp</h3>
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
        <h3 className="text-sm font-semibold text-text-primary mb-4">Top theo giá trị nhập</h3>
        <div className="space-y-1 flex-1">
          {topSuppliers.map((supplier, index) => (
            <div key={supplier.name} className="flex items-center justify-between py-2 px-2 hover:bg-background-app rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary truncate">{supplier.name}</span>
              </div>
              <span className="text-xs font-bold text-text-primary bg-background-app px-2 py-0.5 rounded-full">{supplier.value}</span>
            </div>
          ))}
        </div>
        <Link href="/inbound" className="w-full mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-accent hover:underline py-2 border border-accent/20 rounded-lg bg-accent/5 shrink-0 transition-all hover:bg-accent/10">
          Xem phiếu nhập gần đây <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
