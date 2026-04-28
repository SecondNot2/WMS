"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Package, ExternalLink, Bell } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { getApiErrorMessage } from "@/lib/api/client";
import type { AlertLevel, GetAlertsQuery } from "@wms/types";

const SEVERITY_STYLES: Record<AlertLevel, string> = {
  CRITICAL: "bg-danger/10 text-danger",
  WARNING: "bg-warning/10 text-warning",
};

const SEVERITY_LABELS: Record<AlertLevel, string> = {
  CRITICAL: "Nghiêm trọng",
  WARNING: "Cảnh báo",
};

function buildMessage(name: string, currentStock: number, minStock: number) {
  if (currentStock <= 0) {
    return `Sản phẩm "${name}" đã hết hàng.`;
  }
  return `Sản phẩm "${name}" sắp hết hàng (Còn ${currentStock}/${minStock}).`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AlertTableProps {
  search?: string;
  level?: AlertLevel | "";
  categoryId?: string;
}

export function AlertTable({ search, level, categoryId }: AlertTableProps) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const filterKey = `${search ?? ""}|${level ?? ""}|${categoryId ?? ""}|${limit}`;
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const queryParams = React.useMemo<GetAlertsQuery>(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(level ? { level } : {}),
      ...(categoryId ? { categoryId } : {}),
    }),
    [page, limit, search, level, categoryId],
  );

  const { data, isLoading, isError, error } = useAlerts(queryParams);
  const alerts = data?.data ?? [];
  const meta = data?.meta;

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
                Cập nhật lần cuối
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-16 text-center text-sm text-text-secondary"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-16 text-center text-sm text-danger"
                >
                  {getApiErrorMessage(
                    error,
                    "Không thể tải danh sách cảnh báo",
                  )}
                </td>
              </tr>
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr
                  key={alert.productId}
                  className="hover:bg-background-app/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-lg bg-background-app text-accent">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm leading-relaxed font-bold text-text-primary">
                          {buildMessage(
                            alert.name,
                            alert.currentStock,
                            alert.minStock,
                          )}
                        </p>
                        <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">
                          SKU: {alert.sku} · Danh mục: {alert.category.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                        SEVERITY_STYLES[alert.level],
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {SEVERITY_LABELS[alert.level]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text-secondary">
                    {formatDateTime(alert.lastUpdated)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/products/${alert.productId}`}
                        className="flex items-center gap-1.5 p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors text-[11px] font-bold"
                        title="Xử lý"
                      >
                        Xử lý <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-text-secondary" />
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      Không có cảnh báo nào
                    </p>
                    <p className="text-xs text-text-secondary">
                      Tồn kho đang ổn định
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={meta?.page ?? page}
        totalPages={meta?.totalPages ?? 1}
        pageSize={limit}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => setLimit(size)}
      />
    </div>
  );
}
