"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useInventoryReport } from "@/lib/hooks/use-reports";

const COLORS = ["#2d7dd2", "#34d399", "#f39c12"];

export function InventoryValueChart() {
  const [isMounted, setIsMounted] = useState(false);
  const { data, isLoading, error } = useInventoryReport({ page: 1, limit: 20 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading)
    return (
      <div className="h-87.5 w-full bg-background-app animate-pulse rounded-xl" />
    );

  if (error)
    return (
      <div className="h-87.5 w-full text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl p-4">
        Không thể tải biểu đồ tồn kho
      </div>
    );

  const chartData = data?.chart ?? [];

  return (
    <div className="w-full h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown) =>
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(value as number)
            }
            contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
