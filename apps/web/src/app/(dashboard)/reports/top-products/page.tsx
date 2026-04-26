"use client";

import React from "react";
import {
  BarChart3,
  Download,
  Package,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ReportFilters } from "../_components/ReportFilters";
import { cn } from "@/lib/utils";

interface ProductPerformance {
  rank: number;
  sku: string;
  name: string;
  category: string;
  inboundQty: number;
  outboundQty: number;
  turnoverRate: number;
  stock: number;
  trend: "UP" | "DOWN" | "STABLE";
}

const topProducts: ProductPerformance[] = [
  {
    rank: 1,
    sku: "SP000123",
    name: "Tai nghe Bluetooth Sony WH-1000XM4",
    category: "Điện tử",
    inboundQty: 120,
    outboundQty: 96,
    turnoverRate: 92,
    stock: 24,
    trend: "UP",
  },
  {
    rank: 2,
    sku: "SP000124",
    name: "Chuột không dây Logitech M331",
    category: "Phụ kiện",
    inboundQty: 220,
    outboundQty: 178,
    turnoverRate: 88,
    stock: 42,
    trend: "UP",
  },
  {
    rank: 3,
    sku: "SP000125",
    name: "Bàn phím cơ Keychron K2",
    category: "Phụ kiện",
    inboundQty: 90,
    outboundQty: 63,
    turnoverRate: 76,
    stock: 27,
    trend: "STABLE",
  },
  {
    rank: 4,
    sku: "SP000126",
    name: "Màn hình Dell UltraSharp U2419H",
    category: "Màn hình",
    inboundQty: 48,
    outboundQty: 29,
    turnoverRate: 61,
    stock: 19,
    trend: "DOWN",
  },
  {
    rank: 5,
    sku: "SP000127",
    name: "Loa Bluetooth JBL Flip 5",
    category: "Điện tử",
    inboundQty: 64,
    outboundQty: 42,
    turnoverRate: 58,
    stock: 22,
    trend: "DOWN",
  },
];

const trendConfig = {
  UP: {
    label: "Tăng",
    className: "bg-success/10 text-success",
    icon: TrendingUp,
  },
  DOWN: {
    label: "Giảm",
    className: "bg-danger/10 text-danger",
    icon: TrendingDown,
  },
  STABLE: { label: "Ổn định", className: "bg-info/10 text-info", icon: Zap },
};

export default function TopProductsReportPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Báo cáo hiệu suất sản phẩm
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Xếp hạng sản phẩm theo tốc độ luân chuyển nhập/xuất và tồn kho cuối
            kỳ
          </p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20">
          <Download className="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Sản phẩm phân tích"
          value="1.254"
          icon={Package}
          iconBg="bg-accent/10 text-accent"
        />
        <StatsCard
          label="Luân chuyển cao"
          value="186"
          icon={TrendingUp}
          iconBg="bg-success/10 text-success"
          trend={{ value: "12%", isUp: true }}
        />
        <StatsCard
          label="Luân chuyển thấp"
          value="42"
          icon={TrendingDown}
          iconBg="bg-danger/10 text-danger"
        />
        <StatsCard
          label="Tỷ lệ trung bình"
          value="74%"
          icon={BarChart3}
          iconBg="bg-info/10 text-info"
        />
      </div>

      <ReportFilters />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1 bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Top luân chuyển
            </h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.sku} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-text-secondary font-mono">
                      {product.sku}
                    </p>
                  </div>
                  <span className="text-sm font-black text-accent">
                    {product.turnoverRate}%
                  </span>
                </div>
                <div className="h-2 bg-background-app rounded-full overflow-hidden border border-border-ui/50">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${product.turnoverRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border-ui">
            <h3 className="text-sm font-semibold text-text-primary">
              Bảng xếp hạng chi tiết
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Dữ liệu mẫu sẽ được thay bằng GET /reports/top-products
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-220">
              <thead className="bg-background-app/50 border-b border-border-ui">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Hạng
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Nhập
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Xuất
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                    Tồn
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Xu hướng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-ui">
                {topProducts.map((product) => {
                  const TrendIcon = trendConfig[product.trend].icon;
                  return (
                    <tr
                      key={product.sku}
                      className="hover:bg-background-app/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-black flex items-center justify-center">
                          {product.rank}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-text-primary">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-text-secondary font-mono">
                          {product.sku} · {product.category}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-success">
                        {product.inboundQty}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-danger">
                        {product.outboundQty}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-text-primary">
                        {product.stock}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                            trendConfig[product.trend].className,
                          )}
                        >
                          <TrendIcon className="w-3 h-3" />{" "}
                          {trendConfig[product.trend].label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
