"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { useInventorySummary } from "@/lib/hooks/use-inventory";
import { getApiErrorMessage } from "@/lib/api/client";

const PALETTE = [
  "#2d7dd2",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#64748b",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
];

export function InventoryDonutChart() {
  const { data: summary, isLoading, isError, error } = useInventorySummary();

  const data = React.useMemo(() => {
    if (!summary) return [];
    return summary.byCategory.map((c, idx) => ({
      name: c.name,
      value: c.stock,
      color: PALETTE[idx % PALETTE.length],
    }));
  }, [summary]);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  if (isLoading) {
    return (
      <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          Tồn kho theo danh mục
        </h3>
        <div className="flex items-center justify-center flex-1 text-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-xs">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          Tồn kho theo danh mục
        </h3>
        <div className="flex items-center justify-center flex-1 text-danger text-xs px-4 text-center">
          {getApiErrorMessage(error, "Không thể tải biểu đồ")}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          Tồn kho theo danh mục
        </h3>
        <div className="flex items-center justify-center flex-1 text-text-secondary text-xs">
          Chưa có dữ liệu tồn kho
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-semibold text-text-primary mb-2">
        Tồn kho theo danh mục
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 flex-1 min-h-40">
        {/* Chart area */}
        <div className="w-48 h-48 sm:w-60 sm:h-60 relative shrink-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 1, height: 1 }}
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="82%"
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "11px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-text-secondary uppercase tracking-wider font-medium">
              TỔNG
            </span>
            <span className="text-xl font-bold text-text-primary">{total}</span>
          </div>
        </div>

        {/* Legend area */}
        <div className="w-full sm:flex-1 sm:max-w-40 space-y-3 sm:space-y-5">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center min-w-0">
                <div
                  className="w-2 h-2 rounded-full mr-2.5 shrink-0 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-bold text-text-primary">
                  {item.value}
                </span>
                <span className="text-[9px] font-medium text-text-secondary bg-background-app px-1.5 py-0.5 rounded-md min-w-8 text-center">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
