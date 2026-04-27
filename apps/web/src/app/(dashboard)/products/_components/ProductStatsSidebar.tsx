"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Package,
  PauseCircle,
} from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/use-products";
import { cn } from "@/lib/utils";

function formatCount(value: number | undefined) {
  if (value === undefined) return "—";
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatPercentage(part: number | undefined, total: number | undefined) {
  if (!part || !total) return null;
  const pct = (part / total) * 100;
  if (!Number.isFinite(pct)) return null;
  return `${pct.toFixed(1)}%`;
}

export function ProductStatsSidebar({ className }: { className?: string }) {
  const totalQuery = useProducts({ limit: 1 });
  const lowStockQuery = useProducts({ limit: 1, lowStock: true });
  const inactiveQuery = useProducts({ limit: 1, isActive: false });

  const total = totalQuery.data?.meta?.total;
  const lowStock = lowStockQuery.data?.meta?.total;
  const inactive = inactiveQuery.data?.meta?.total;
  const inStock =
    total !== undefined && lowStock !== undefined
      ? Math.max(total - lowStock, 0)
      : undefined;

  const isLoading =
    totalQuery.isLoading || lowStockQuery.isLoading || inactiveQuery.isLoading;

  const stats = [
    {
      label: "Đang hoạt động",
      value: total,
      percentage: null,
      icon: Package,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Còn hàng",
      value: inStock,
      percentage: formatPercentage(inStock, total),
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Sắp hết / Hết hàng",
      value: lowStock,
      percentage: formatPercentage(lowStock, total),
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Đã ngưng",
      value: inactive,
      percentage: null,
      icon: PauseCircle,
      color: "text-text-secondary",
      bg: "bg-text-secondary/10",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Tổng quan sản phẩm
        </h3>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  stat.bg,
                )}
              >
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-text-primary">
                    {isLoading ? "…" : formatCount(stat.value)}
                  </span>
                  {stat.percentage && (
                    <span className="text-[11px] text-text-secondary">
                      ({stat.percentage})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Danh mục sản phẩm
        </h3>
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-xs text-text-secondary leading-relaxed max-w-50">
            Bảng phân bổ theo danh mục sẽ hiển thị sau khi module Danh mục được
            kết nối.
          </p>
        </div>
        <Link
          href="/categories"
          className="w-full mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-accent hover:underline py-2 border border-accent/20 rounded-lg bg-accent/5 shrink-0 transition-all hover:bg-accent/10"
        >
          Mở trang Danh mục <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
