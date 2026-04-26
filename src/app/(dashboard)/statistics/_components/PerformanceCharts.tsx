"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock data for Flow Analysis
const flowData = [
  { name: "01/04", inbound: 120, outbound: 80 },
  { name: "05/04", inbound: 210, outbound: 150 },
  { name: "10/04", inbound: 180, outbound: 220 },
  { name: "15/04", inbound: 300, outbound: 190 },
  { name: "20/04", inbound: 250, outbound: 280 },
  { name: "25/04", inbound: 320, outbound: 210 },
  { name: "30/04", inbound: 280, outbound: 250 },
];

// Mock data for Top Moving Products
const topProductsData = [
  { name: "Sony WH-1000XM4", value: 450, color: "var(--color-accent)" },
  { name: "Logitech M331", value: 380, color: "var(--color-success)" },
  { name: "Samsung T7 SSD", value: 310, color: "var(--color-info)" },
  { name: "Dell UltraSharp", value: 240, color: "var(--color-warning)" },
  { name: "Keychron K2", value: 190, color: "var(--color-danger)" },
].sort((a, b) => b.value - a.value);

// Mock data for Category Distribution (Value based)
const categoryData = [
  { name: "Điện tử", value: 5600, color: "#2d7dd2" },
  { name: "Điện lạnh", value: 4200, color: "#8b5cf6" },
  { name: "Gia dụng", value: 2800, color: "#22c55e" },
  { name: "Văn phòng", value: 1500, color: "#f59e0b" },
];

export function FlowAnalysisChart() {
  return (
    <div className="bg-card-white p-5 rounded-xl border border-border-ui shadow-sm h-87.5 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Phân tích luồng hàng hóa</h3>
          <p className="text-[10px] text-text-secondary mt-0.5">So sánh sản lượng nhập và xuất kho theo thời gian</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-medium text-text-secondary">Nhập kho</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-[10px] font-medium text-text-secondary">Xuất kho</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-ui)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: "12px", 
                border: "1px solid var(--color-border-ui)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "11px"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="inbound" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorInbound)" 
            />
            <Area 
              type="monotone" 
              dataKey="outbound" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOutbound)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopProductsChart() {
  return (
    <div className="bg-card-white p-5 rounded-xl border border-border-ui shadow-sm h-87.5 flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-primary">Top sản phẩm biến động mạnh</h3>
        <p className="text-[10px] text-text-secondary mt-0.5">Dựa trên tổng sản lượng nhập và xuất</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={topProductsData} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-ui)" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--color-text-primary)", fontWeight: 500 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{ 
                borderRadius: "12px", 
                border: "1px solid var(--color-border-ui)",
                fontSize: "11px"
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {topProductsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryDistributionChart() {
  const totalValue = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-card-white p-5 rounded-xl border border-border-ui shadow-sm h-87.5 flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-primary">Giá trị tồn kho theo danh mục</h3>
        <p className="text-[10px] text-text-secondary mt-0.5">Tỷ lệ giá trị vốn lưu động</p>
      </div>

      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
          <span className="text-[9px] text-text-secondary uppercase tracking-widest font-bold">Tổng giá trị</span>
          <span className="text-lg font-bold text-text-primary">{(totalValue / 1000).toFixed(1)}M</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {categoryData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="min-w-0">
              <p className="text-[10px] text-text-secondary truncate">{item.name}</p>
              <p className="text-[11px] font-bold text-text-primary">{Math.round((item.value / totalValue) * 100)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
