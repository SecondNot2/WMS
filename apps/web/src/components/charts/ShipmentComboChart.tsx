"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Combobox } from "@/components/ui/Combobox";

const data = [
  { name: "T2", inbound: 400, outbound: 240, stock: 1200 },
  { name: "T3", inbound: 300, outbound: 139, stock: 1361 },
  { name: "T4", inbound: 200, outbound: 980, stock: 581 },
  { name: "T5", inbound: 278, outbound: 390, stock: 469 },
  { name: "T6", inbound: 189, outbound: 480, stock: 178 },
  { name: "T7", inbound: 239, outbound: 380, stock: 37 },
  { name: "CN", inbound: 349, outbound: 430, stock: -44 },
];

export function ShipmentComboChart() {
  const [range, setRange] = React.useState<string>("7d");
  return (
    <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-text-primary">
          Biểu đồ nhập / xuất kho
        </h3>
        <div className="min-w-32">
          <Combobox<string>
            value={range}
            onChange={(next) => setRange(next || "7d")}
            options={[
              { value: "7d", label: "7 ngày qua" },
              { value: "30d", label: "30 ngày qua" },
              { value: "3m", label: "3 tháng qua" },
            ]}
            searchable={false}
          />
        </div>
      </div>

      <div className="h-36 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "11px",
              }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: "0",
                paddingBottom: "15px",
                fontSize: "10px",
              }}
            />
            <Bar
              name="Nhập kho"
              dataKey="inbound"
              barSize={24}
              fill="#2d7dd2"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              name="Xuất kho"
              dataKey="outbound"
              barSize={24}
              fill="#f59e0b"
              radius={[3, 3, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border-ui flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent/20 border border-accent/40" />
          <span className="text-[11px] text-text-secondary">
            Tuần trước:{" "}
            <span className="font-bold text-text-primary">1,450</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent border border-accent" />
          <span className="text-[11px] text-text-secondary">
            Tuần này: <span className="font-bold text-text-primary">1,820</span>
          </span>
          <span className="text-[10px] font-bold text-success flex items-center">
            +12%
          </span>
        </div>
      </div>
    </div>
  );
}
