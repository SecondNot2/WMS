"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const mockData = [
  { name: "Tháng 1", receipt: 4000, issue: 2400 },
  { name: "Tháng 2", receipt: 3000, issue: 1398 },
  { name: "Tháng 3", receipt: 2000, issue: 9800 },
  { name: "Tháng 4", receipt: 2780, issue: 3908 },
  { name: "Tháng 5", receipt: 1890, issue: 4800 },
  { name: "Tháng 6", receipt: 2390, issue: 3800 },
  { name: "Tháng 7", receipt: 3490, issue: 4300 },
];

export function ReceiptIssueChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-87.5 w-full bg-background-app animate-pulse rounded-xl" />;

  return (
    <div className="w-full h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
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
