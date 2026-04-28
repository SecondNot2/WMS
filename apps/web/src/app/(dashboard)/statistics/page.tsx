"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { cn } from "@/lib/utils";
import {
  Box,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  BarChart3,
  Download,
} from "lucide-react";
import { StatsFilters } from "./_components/StatsFilters";
import {
  FlowAnalysisChart,
  TopProductsChart,
  CategoryDistributionChart,
} from "./_components/PerformanceCharts";
import { EfficiencyMetrics } from "./_components/EfficiencyMetrics";
import { useEfficiency, usePerformance } from "@/lib/hooks/use-statistics";
import type { StatisticsRange } from "@wms/types";

function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatTrend(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export default function StatisticsPage() {
  const [range, setRange] = React.useState<StatisticsRange>("30d");
  const [categoryId, setCategoryId] = React.useState<string>("");

  const query = React.useMemo(
    () => ({ range, ...(categoryId ? { categoryId } : {}) }),
    [range, categoryId],
  );

  const performanceQuery = usePerformance(query);
  const efficiencyQuery = useEfficiency(query);

  const summary = performanceQuery.data?.summary;
  const isLoadingPerf = performanceQuery.isLoading;
  return (
    <div className="p-5 space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Thống kê vận hành
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi hiệu suất kho và xu hướng lưu thông hàng hóa trong thời
            gian thực
          </p>
        </div>
        <button className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Xuất báo cáo tổng hợp
        </button>
      </div>

      {/* Filter Bar */}
      <StatsFilters
        range={range}
        categoryId={categoryId}
        onRangeChange={setRange}
        onCategoryChange={setCategoryId}
        onReset={() => {
          setRange("30d");
          setCategoryId("");
        }}
      />

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Tổng nhập kho"
          value={
            isLoadingPerf
              ? "—"
              : (summary?.totalInbound.value ?? 0).toLocaleString("vi-VN")
          }
          icon={ArrowDownCircle}
          iconBg="bg-success/10 text-success"
          trend={
            summary
              ? {
                  value: formatTrend(summary.totalInbound.trend),
                  isUp: summary.totalInbound.trend >= 0,
                }
              : undefined
          }
        />
        <StatsCard
          label="Tổng xuất kho"
          value={
            isLoadingPerf
              ? "—"
              : (summary?.totalOutbound.value ?? 0).toLocaleString("vi-VN")
          }
          icon={ArrowUpCircle}
          iconBg="bg-warning/10 text-warning"
          trend={
            summary
              ? {
                  value: formatTrend(summary.totalOutbound.trend),
                  isUp: summary.totalOutbound.trend >= 0,
                }
              : undefined
          }
        />
        <StatsCard
          label="Giá trị tồn kho"
          value={
            isLoadingPerf
              ? "—"
              : formatCompact(summary?.inventoryValue.value ?? 0)
          }
          icon={DollarSign}
          iconBg="bg-info/10 text-info"
        />
        <StatsCard
          label="Sản phẩm hoạt động"
          value={
            isLoadingPerf
              ? "—"
              : (summary?.activeProducts.value ?? 0).toLocaleString("vi-VN")
          }
          icon={Box}
          iconBg="bg-accent/10 text-accent"
        />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column: Flow Analysis (Takes 2/3 space on large screens) */}
        <div className="xl:col-span-2 space-y-5">
          <FlowAnalysisChart
            data={performanceQuery.data?.flowSeries}
            isLoading={performanceQuery.isLoading}
          />
          <EfficiencyMetrics
            data={efficiencyQuery.data}
            isLoading={efficiencyQuery.isLoading}
          />

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Tình trạng lưu kho (Aging)
                </h3>
              </div>
              <button className="text-[10px] font-bold text-accent hover:underline">
                Chi tiết
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Dưới 30 ngày",
                  value: "65%",
                  count: "556 SP",
                  color: "bg-success",
                },
                {
                  label: "30 - 60 ngày",
                  value: "20%",
                  count: "171 SP",
                  color: "bg-info",
                },
                {
                  label: "60 - 90 ngày",
                  value: "10%",
                  count: "86 SP",
                  color: "bg-warning",
                },
                {
                  label: "Trên 90 ngày",
                  value: "5%",
                  count: "43 SP",
                  color: "bg-danger",
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="text-text-primary">
                      {item.count} ({item.value})
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-background-app rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.color,
                      )}
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Side Analytics */}
        <div className="space-y-5">
          <CategoryDistributionChart
            data={performanceQuery.data?.categoryDistribution}
            isLoading={performanceQuery.isLoading}
          />
          <TopProductsChart
            data={performanceQuery.data?.topProducts}
            isLoading={performanceQuery.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
