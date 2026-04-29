"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function InventoryAlerts() {
  const { data, isLoading, isError, error } = useAlerts({ limit: 6 });
  const alerts = data?.data ?? [];

  return (
    <div className="bg-card-white p-3.5 rounded-xl border border-border-ui shadow-sm h-full overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-text-primary mb-3.5">
        Cảnh báo tồn kho
      </h3>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-hide">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-xs">Đang tải...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-32 text-danger text-xs px-2 text-center">
            {getApiErrorMessage(error, "Không thể tải cảnh báo")}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-text-secondary text-xs">
            Không có cảnh báo
          </div>
        ) : (
          alerts.map((item) => {
            const isCritical = item.level === "CRITICAL";
            return (
              <Link
                key={item.productId}
                href={`/products/${item.productId}`}
                className="flex items-center p-2.5 rounded-lg border border-transparent hover:border-border-ui hover:bg-background-app transition-all cursor-pointer group"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-105",
                    isCritical
                      ? "bg-danger/10 text-danger"
                      : "bg-warning/10 text-warning",
                  )}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-text-primary truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-text-secondary">{item.sku}</p>
                </div>
                <div className="text-right ml-3">
                  <p
                    className={cn(
                      "text-[12px] font-bold",
                      item.currentStock === 0 ? "text-danger" : "text-warning",
                    )}
                  >
                    Tồn: {item.currentStock}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    Ngưỡng: {item.minStock}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <div className="mt-auto pt-3 border-t border-border-ui flex justify-end">
        <Link
          href="/alerts"
          className="text-[11px] font-bold text-accent hover:underline flex items-center"
        >
          Xem tất cả <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
