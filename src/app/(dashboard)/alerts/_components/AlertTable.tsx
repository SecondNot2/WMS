"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Package,
  FileText,
  Settings,
  ExternalLink,
  Trash2,
  Bell,
} from "lucide-react";
import { Pagination } from "@/components/Pagination";

type AlertType = "STOCK" | "WORKFLOW" | "SYSTEM";
type AlertSeverity = "CRITICAL" | "WARNING" | "INFO";

interface AlertRow {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  targetId: string | null;
  targetCode: string | null;
  createdAt: string;
  isRead: boolean;
}

const mockAlerts: AlertRow[] = [
  {
    id: "1",
    type: "STOCK",
    severity: "CRITICAL",
    message: "Sản phẩm 'Chuột không dây Logitech M331' đã hết hàng.",
    targetId: "p1",
    targetCode: "SP001",
    createdAt: "10 phút trước",
    isRead: false,
  },
  {
    id: "2",
    type: "WORKFLOW",
    severity: "WARNING",
    message: "Phiếu nhập kho PNK-2024-0056 đang chờ duyệt hơn 24 giờ.",
    targetId: "r1",
    targetCode: "PNK-2024-0056",
    createdAt: "2 giờ trước",
    isRead: false,
  },
  {
    id: "3",
    type: "SYSTEM",
    severity: "INFO",
    message: "Hệ thống sẽ bảo trì định kỳ vào 23:00 tối nay.",
    targetId: null,
    targetCode: null,
    createdAt: "5 giờ trước",
    isRead: true,
  },
  {
    id: "4",
    type: "STOCK",
    severity: "WARNING",
    message: "Sản phẩm 'Bàn phím cơ Keychron K2' sắp hết hàng (Còn 3).",
    targetId: "p2",
    targetCode: "SP002",
    createdAt: "Hôm qua",
    isRead: true,
  },
];

const TYPE_CONFIG = {
  STOCK: { icon: Package, cls: "text-accent" },
  WORKFLOW: { icon: FileText, cls: "text-warning" },
  SYSTEM: { icon: Settings, cls: "text-text-secondary" },
};

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  CRITICAL: "bg-danger/10 text-danger",
  WARNING: "bg-warning/10 text-warning",
  INFO: "bg-info/10 text-info",
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  CRITICAL: "Nghiêm trọng",
  WARNING: "Cảnh báo",
  INFO: "Thông tin",
};

export function AlertTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const alerts = mockAlerts;

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-background-app/50 border-b border-border-ui">
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Mức độ
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const config = TYPE_CONFIG[alert.type];
                const Icon = config.icon;
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div
                        className={cn(
                          "flex items-start gap-3",
                          alert.isRead ? "opacity-60" : "opacity-100",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 p-2 rounded-lg bg-background-app",
                            config.cls,
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p
                            className={cn(
                              "text-sm leading-relaxed",
                              !alert.isRead
                                ? "font-bold text-text-primary"
                                : "font-medium text-text-secondary",
                            )}
                          >
                            {alert.message}
                          </p>
                          {alert.targetCode && (
                            <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">
                              Mã liên quan: {alert.targetCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                          SEVERITY_STYLES[alert.severity],
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {SEVERITY_LABELS[alert.severity]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-secondary">
                      {alert.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {alert.targetId && (
                          <Link
                            href={
                              alert.type === "STOCK"
                                ? `/products/${alert.targetId}`
                                : `/inbound/${alert.targetId}`
                            }
                            className="flex items-center gap-1.5 p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors text-[11px] font-bold"
                            title="Xử lý"
                          >
                            Xử lý <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        <button
                          className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-text-secondary" />
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      Không có thông báo nào
                    </p>
                    <p className="text-xs text-text-secondary">
                      Hệ thống chưa phát sinh cảnh báo mới
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={3}
        pageSize={pageSize}
        totalItems={28}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
