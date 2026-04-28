"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Clock } from "lucide-react";
import { useRecipientsList } from "@/lib/hooks/use-recipients";
import { cn } from "@/lib/utils";

const compactCurrency = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
};

export function ReceiverStatsSidebarConnected({
  className,
}: {
  className?: string;
}) {
  const activeQuery = useRecipientsList({ limit: 100, isActive: true });
  const inactiveQuery = useRecipientsList({ limit: 100, isActive: false });

  const totalActive = activeQuery.data?.meta?.total ?? 0;
  const totalInactive = inactiveQuery.data?.meta?.total ?? 0;
  const total = totalActive + totalInactive;

  const topReceivers = React.useMemo(() => {
    const list = activeQuery.data?.data ?? [];
    return [...list]
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 4);
  }, [activeQuery.data]);

  const stats = [
    {
      label: "Tổng đơn vị nhận",
      value: String(total),
      icon: Building2,
      bg: "bg-accent/10",
      color: "text-accent",
    },
    {
      label: "Đang hoạt động",
      value: String(totalActive),
      percentage:
        total > 0 ? `${((totalActive / total) * 100).toFixed(1)}%` : null,
      icon: CheckCircle2,
      bg: "bg-success/10",
      color: "text-success",
    },
    {
      label: "Tạm dừng",
      value: String(totalInactive),
      percentage:
        total > 0 ? `${((totalInactive / total) * 100).toFixed(1)}%` : null,
      icon: Clock,
      bg: "bg-warning/10",
      color: "text-warning",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Tổng quan đơn vị nhận
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
                    {stat.value}
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
          Top theo giá trị xuất
        </h3>
        <div className="space-y-1 flex-1">
          {topReceivers.length > 0 ? (
            topReceivers.map((receiver, index) => (
              <Link
                href={`/receivers/${receiver.id}`}
                key={receiver.id}
                className="flex items-center justify-between py-2 px-2 hover:bg-background-app rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-warning/10 text-warning text-[10px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary truncate">
                    {receiver.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-text-primary bg-background-app px-2 py-0.5 rounded-full">
                  {compactCurrency(receiver.totalAmount)}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-xs text-text-secondary italic py-4">
              Chưa có dữ liệu giá trị xuất
            </p>
          )}
        </div>
        <Link
          href="/outbound"
          className="w-full mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-accent hover:underline py-2 border border-accent/20 rounded-lg bg-accent/5 shrink-0 transition-all hover:bg-accent/10"
        >
          Xem phiếu xuất gần đây <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
