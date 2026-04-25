"use client";

import React from "react";
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const stats = [
  {
    label: "Tổng số sản phẩm",
    value: "1.254",
    icon: Package,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Còn hàng",
    value: "986",
    percentage: "78.6%",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Sắp hết hàng",
    value: "168",
    percentage: "13.4%",
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Hết hàng",
    value: "100",
    percentage: "8.0%",
    icon: XCircle,
    color: "text-danger",
    bg: "bg-danger/10",
  },
];

const categories = [
  { name: "Thiết bị ngoại vi", count: 320 },
  { name: "Màn hình", count: 120 },
  { name: "Laptop", count: 85 },
  { name: "Thiết bị văn phòng", count: 210 },
  { name: "Vật tư văn phòng", count: 180 },
  { name: "Nội thất", count: 95 },
  { name: "Khác", count: 244 },
];

export function ProductStatsSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Overview Stats */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Tổng quan sản phẩm</h3>
        <div className="space-y-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-text-primary">{stat.value}</span>
                  {stat.percentage && (
                    <span className="text-[11px] text-text-secondary">({stat.percentage})</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Danh mục sản phẩm</h3>
        <div className="space-y-1 flex-1 overflow-y-auto">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 px-2 hover:bg-background-app rounded-lg transition-colors cursor-pointer group">
              <span className="text-sm text-text-secondary group-hover:text-text-primary">{cat.name}</span>
              <span className="text-xs font-bold text-text-primary bg-background-app px-2 py-0.5 rounded-full">{cat.count}</span>
            </div>
          ))}
        </div>
        <Link 
          href="/categories"
          className="w-full mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-accent hover:underline py-2 border border-accent/20 rounded-lg bg-accent/5 shrink-0 transition-all hover:bg-accent/10"
        >
          Xem tất cả danh mục <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
