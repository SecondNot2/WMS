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
import type {
  StatisticsCategoryDistribution,
  StatisticsFlowPoint,
  StatisticsTopProduct,
} from "@wms/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = [
  "var(--color-accent)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-danger)",
  "#8b5cf6",
];

const TOP_PRODUCT_COLORS = [
  "var(--color-accent)",
  "var(--color-success)",
  "var(--color-info)",
  "var(--color-warning)",
  "var(--color-danger)",
];

function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-card-white p-4 sm:p-5 rounded-xl border border-border-ui shadow-sm h-80 sm:h-87.5 animate-pulse",
        className,
      )}
    />
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center text-xs text-text-secondary">
      {message}
    </div>
  );
}

interface FlowAnalysisChartProps {
  data?: StatisticsFlowPoint[];
  isLoading?: boolean;
}

export function FlowAnalysisChart({ data, isLoading }: FlowAnalysisChartProps) {
  if (isLoading) return <ChartSkeleton />;
  const flowData = (data ?? []).map((p) => ({
    name: p.label,
    inbound: p.inbound,
    outbound: p.outbound,
  }));
  return (
    <div className="bg-card-white p-4 sm:p-5 rounded-xl border border-border-ui shadow-sm h-80 sm:h-87.5 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Phân tích luồng hàng hóa
          </h3>
          <p className="text-[10px] text-text-secondary mt-0.5">
            So sánh sản lượng nhập và xuất kho theo thời gian
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-medium text-text-secondary">
              Nhập kho
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-[10px] font-medium text-text-secondary">
              Xuất kho
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        {flowData.length === 0 ? (
          <EmptyState message="Chưa có dữ liệu nhập/xuất trong khoảng thời gian này" />
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 1, height: 1 }}
          >
            <AreaChart
              data={flowData}
              margin={{ top: 10, right: 8, left: -24, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-warning)"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-warning)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border-ui)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
                dy={10}
                interval="preserveStartEnd"
                minTickGap={16}
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
                  fontSize: "11px",
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
        )}
      </div>
    </div>
  );
}

interface TopProductsChartProps {
  data?: StatisticsTopProduct[];
  isLoading?: boolean;
}

export function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  if (isLoading) return <ChartSkeleton />;
  const topProductsData = (data ?? [])
    .map((p, i) => ({
      name: p.name,
      value: p.quantity,
      color: TOP_PRODUCT_COLORS[i % TOP_PRODUCT_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);
  return (
    <div className="bg-card-white p-4 sm:p-5 rounded-xl border border-border-ui shadow-sm h-80 sm:h-87.5 flex flex-col">
      <div className="mb-5 sm:mb-6">
        <h3 className="text-sm font-semibold text-text-primary">
          Top sản phẩm biến động mạnh
        </h3>
        <p className="text-[10px] text-text-secondary mt-0.5">
          Dựa trên tổng sản lượng nhập và xuất
        </p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {topProductsData.length === 0 ? (
          <EmptyState message="Chưa có sản phẩm biến động" />
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 1, height: 1 }}
          >
            <BarChart
              data={topProductsData}
              layout="vertical"
              margin={{ top: 5, right: 12, left: 4, bottom: 5 }}
              barSize={12}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="var(--color-border-ui)"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--color-text-primary)",
                  fontWeight: 500,
                }}
                width={78}
                tickFormatter={(value) =>
                  String(value).length > 12
                    ? `${String(value).slice(0, 12)}…`
                    : String(value)
                }
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--color-border-ui)",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {topProductsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface CategoryDistributionChartProps {
  data?: StatisticsCategoryDistribution[];
  isLoading?: boolean;
}

export function CategoryDistributionChart({
  data,
  isLoading,
}: CategoryDistributionChartProps) {
  if (isLoading) return <ChartSkeleton />;
  const categoryData = (data ?? []).map((c, i) => ({
    name: c.name,
    value: c.value,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));
  const totalValue = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-card-white p-4 sm:p-5 rounded-xl border border-border-ui shadow-sm h-80 sm:h-87.5 flex flex-col">
      <div className="mb-5 sm:mb-6">
        <h3 className="text-sm font-semibold text-text-primary">
          Giá trị tồn kho theo danh mục
        </h3>
        <p className="text-[10px] text-text-secondary mt-0.5">
          Tỷ lệ giá trị vốn lưu động
        </p>
      </div>

      <div className="flex-1 relative min-h-0">
        {categoryData.length === 0 ? (
          <EmptyState message="Chưa có dữ liệu tồn kho" />
        ) : (
          <>
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 1, height: 1 }}
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="72%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
              <span className="text-[9px] text-text-secondary uppercase tracking-widest font-bold">
                Tổng giá trị
              </span>
              <span className="text-lg font-bold text-text-primary">
                {formatCompact(totalValue)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-3 mt-4">
        {categoryData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <p className="text-[10px] text-text-secondary truncate">
                {item.name}
              </p>
              <p className="text-[11px] font-bold text-text-primary">
                {Math.round((item.value / totalValue) * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
