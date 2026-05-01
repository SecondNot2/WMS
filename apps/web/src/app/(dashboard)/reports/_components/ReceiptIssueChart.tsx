"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useReceiptIssueReport } from "@/lib/hooks/use-reports";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

export function ReceiptIssueChart() {
  const isMounted = useIsMounted();
  const { data, isLoading, error } = useReceiptIssueReport({
    page: 1,
    limit: 20,
  });

  if (!isMounted || isLoading)
    return (
      <div className="h-80 sm:h-87.5 w-full bg-background-app animate-pulse rounded-xl" />
    );

  if (error)
    return (
      <div className="h-80 sm:h-87.5 w-full text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl p-4">
        Không thể tải biểu đồ nhập xuất
      </div>
    );

  return (
    <div className="w-full h-80 sm:h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={(data?.chart ?? []).map((item) => ({
            name: item.label,
            receipt: item.inbound,
            issue: item.outbound,
          }))}
          margin={{ top: 10, right: 8, left: -24, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReceipt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d7dd2" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2d7dd2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorIssue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f39c12" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#f39c12" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
            dy={10}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Legend
            verticalAlign="top"
            align="center"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px" }}
          />
          <Area
            name="Nhập kho"
            type="monotone"
            dataKey="receipt"
            stroke="#2d7dd2"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorReceipt)"
          />
          <Area
            name="Xuất kho"
            type="monotone"
            dataKey="issue"
            stroke="#f39c12"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIssue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
