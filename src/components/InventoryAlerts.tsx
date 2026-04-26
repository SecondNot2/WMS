"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    name: "Laptop Dell XPS 13",
    sku: "SKU-DELL-01",
    stock: 2,
    threshold: 10,
    priority: "high",
  },
  {
    name: "Chuột không dây Logitech",
    sku: "SKU-LOGI-W",
    stock: 5,
    threshold: 20,
    priority: "medium",
  },
  {
    name: "Bàn phím cơ Keychron K2",
    sku: "SKU-KEY-K2",
    stock: 0,
    threshold: 5,
    priority: "high",
  },
  {
    name: "Màn hình LG 27GL850",
    sku: "SKU-LG-27",
    stock: 3,
    threshold: 8,
    priority: "medium",
  },
];

export function InventoryAlerts() {
  return (
    <div className="bg-card-white p-3.5 rounded-xl border border-border-ui shadow-sm h-full overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-text-primary mb-3.5">
        Cảnh báo tồn kho
      </h3>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-hide">
        {alerts.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center p-2.5 rounded-lg border border-transparent hover:border-border-ui hover:bg-background-app transition-all cursor-pointer group"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-105",
                item.priority === "high"
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
                  item.stock === 0 ? "text-danger" : "text-warning",
                )}
              >
                Tồn: {item.stock}
              </p>
              <p className="text-[10px] text-text-secondary">
                Ngưỡng: {item.threshold}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3 border-t border-border-ui flex justify-end">
        <button className="text-[11px] font-bold text-accent hover:underline flex items-center">
          Kiểm kê tất cả <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
}
