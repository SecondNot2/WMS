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
  Download
} from "lucide-react";
import { StatsFilters } from "./_components/StatsFilters";
import { 
  FlowAnalysisChart, 
  TopProductsChart, 
  CategoryDistributionChart 
} from "./_components/PerformanceCharts";
import { EfficiencyMetrics } from "./_components/EfficiencyMetrics";

export default function StatisticsPage() {
  return (
    <div className="p-5 space-y-6 max-w-400 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Thống kê vận hành</h1>
          <p className="text-xs text-text-secondary">Theo dõi hiệu suất kho và xu hướng lưu thông hàng hóa trong thời gian thực</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <Download className="w-4 h-4" /> Xuất báo cáo tổng hợp
        </button>
      </div>

      {/* Filter Bar */}
      <StatsFilters />

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="Tổng nhập kho" 
          value="1,250" 
          icon={ArrowDownCircle} 
          iconBg="bg-success/10 text-success"
          trend={{ value: "12.5%", isUp: true }}
        />
        <StatsCard 
          label="Tổng xuất kho" 
          value="980" 
          icon={ArrowUpCircle} 
          iconBg="bg-warning/10 text-warning"
          trend={{ value: "8.2%", isUp: true }}
        />
        <StatsCard 
          label="Giá trị tồn kho" 
          value="5.68B" 
          icon={DollarSign} 
          iconBg="bg-info/10 text-info"
          trend={{ value: "3.7%", isUp: true }}
        />
        <StatsCard 
          label="Sản phẩm hoạt động" 
          value="856" 
          icon={Box} 
          iconBg="bg-accent/10 text-accent"
          trend={{ value: "5", isUp: true }}
        />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Flow Analysis (Takes 2/3 space on large screens) */}
        <div className="xl:col-span-2 space-y-6">
          <FlowAnalysisChart />
          <EfficiencyMetrics />
          
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">Tình trạng lưu kho (Aging)</h3>
              </div>
              <button className="text-[10px] font-bold text-accent hover:underline">Chi tiết</button>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Dưới 30 ngày", value: "65%", count: "556 SP", color: "bg-success" },
                { label: "30 - 60 ngày", value: "20%", count: "171 SP", color: "bg-info" },
                { label: "60 - 90 ngày", value: "10%", count: "86 SP", color: "bg-warning" },
                { label: "Trên 90 ngày", value: "5%", count: "43 SP", color: "bg-danger" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="text-text-primary">{item.count} ({item.value})</span>
                  </div>
                  <div className="h-1.5 w-full bg-background-app rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", item.color)} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Side Analytics */}
        <div className="space-y-6">
          <CategoryDistributionChart />
          <TopProductsChart />
        </div>
      </div>
    </div>
  );
}
