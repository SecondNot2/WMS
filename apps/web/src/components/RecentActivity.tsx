"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Upload,
  Activity,
  Box,
  Loader2,
  Tag,
  Truck,
  UserRound,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useActivityLogs } from "@/lib/hooks/use-activity-log";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@wms/types";

function formatRelative(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  if (Number.isNaN(ms) || ms < 0) return "Vừa xong";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

const targetIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  GoodsReceipt: { icon: Download, color: "bg-success/10 text-success" },
  GoodsIssue: { icon: Upload, color: "bg-warning/10 text-warning" },
  Product: { icon: Box, color: "bg-accent/10 text-accent" },
  Category: { icon: Tag, color: "bg-info/10 text-info" },
  Supplier: { icon: Truck, color: "bg-warning/10 text-warning" },
  Recipient: { icon: Truck, color: "bg-accent/10 text-accent" },
  User: { icon: UserRound, color: "bg-accent/10 text-accent" },
  Role: { icon: Shield, color: "bg-info/10 text-info" },
};

function getActionLabel(action: string): string {
  const a = action.toLowerCase();
  if (a.includes("create")) return "đã tạo";
  if (a.includes("update")) return "đã cập nhật";
  if (a.includes("delete")) return "đã xóa";
  if (a.includes("approve")) return "đã duyệt";
  if (a.includes("reject")) return "đã từ chối";
  if (a.includes("adjust")) return "đã điều chỉnh";
  if (a.includes("import")) return "đã import";
  if (a.includes("login")) return "đã đăng nhập";
  if (a.includes("logout")) return "đã đăng xuất";
  return action;
}

function getTargetHref(log: ActivityLog): string | null {
  if (!log.targetId) return null;
  switch (log.targetType) {
    case "Product":
      return `/products/${log.targetId}`;
    case "Category":
      return `/categories`;
    case "GoodsReceipt":
      return `/inbound/${log.targetId}`;
    case "GoodsIssue":
      return `/outbound/${log.targetId}`;
    case "Supplier":
      return `/suppliers/${log.targetId}`;
    case "Recipient":
      return `/receivers/${log.targetId}`;
    case "User":
      return `/users/${log.targetId}`;
    case "Role":
      return `/roles`;
    default:
      return null;
  }
}

export function RecentActivity() {
  const { data, isLoading, isError, error } = useActivityLogs({ limit: 5 });
  const logs = data?.data ?? [];

  return (
    <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-semibold text-text-primary mb-6">
        Hoạt động gần đây
      </h3>
      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4.25 before:h-full before:w-0.5 before:bg-background-app flex-1 overflow-y-auto pr-1 scrollbar-hide">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-xs">Đang tải...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-32 text-danger text-xs px-2 text-center">
            {getApiErrorMessage(error, "Không thể tải hoạt động")}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-text-secondary text-xs">
            Chưa có hoạt động
          </div>
        ) : (
          logs.map((log) => {
            const config = (log.targetType &&
              targetIconMap[log.targetType]) || {
              icon: Activity,
              color: "bg-background-app text-text-secondary",
            };
            const href = getTargetHref(log);
            const target = log.targetCode ?? log.detail ?? log.targetType ?? "";
            return (
              <div
                key={log.id}
                className="relative flex items-start pl-10 group"
              >
                <div
                  className={cn(
                    "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110",
                    config.color,
                  )}
                >
                  <config.icon className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[12px] text-text-primary leading-snug">
                    <span className="font-semibold">{log.user.name}</span>{" "}
                    {getActionLabel(log.action)}
                    {target ? " " : ""}
                    {target ? (
                      href ? (
                        <Link
                          href={href}
                          className="font-medium text-accent hover:underline"
                        >
                          {target}
                        </Link>
                      ) : (
                        <span className="font-medium text-text-primary">
                          {target}
                        </span>
                      )
                    ) : null}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    {formatRelative(log.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-auto pt-3 border-t border-border-ui flex justify-end">
        <Link
          href="/activity-log"
          className="text-[11px] font-bold text-accent hover:underline flex items-center"
        >
          Xem tất cả <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
