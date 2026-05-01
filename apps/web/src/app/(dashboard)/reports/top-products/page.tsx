"use client";

import React from "react";
import {
  BarChart3,
  ChevronLeft,
  Download,
  Loader2,
  Package,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import Link from "next/link";
import { ReportFilters } from "../_components/ReportFilters";
import { useTopProductsReport } from "@/lib/hooks/use-reports";
import { cn } from "@/lib/utils";
import { reportsApi } from "@/lib/api/reports";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";

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
  const { data, isLoading, error } = useTopProductsReport({ limit: 10 });
  const [exporting, setExporting] = React.useState(false);
  const toast = useToast();
  const topProducts = data?.items ?? [];
  const summary = data?.summary;

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await reportsApi.exportExcel({
        type: "top-products",
        limit: 100,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reports-top-products-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Đã xuất báo cáo Excel");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xuất báo cáo"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/reports"
            className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Báo cáo hiệu suất sản phẩm
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Xếp hạng sản phẩm theo tốc độ luân chuyển nhập/xuất và tồn kho
              cuối kỳ
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20 disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exporting ? "Đang xuất..." : "Xuất báo cáo"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Sản phẩm phân tích"
          value={summary?.analyzedProducts ?? 0}
          icon={Package}
          iconBg="bg-accent/10 text-accent"
        />
        <StatsCard
          label="Luân chuyển cao"
          value={summary?.highTurnover ?? 0}
          icon={TrendingUp}
          iconBg="bg-success/10 text-success"
        />
        <StatsCard
          label="Luân chuyển thấp"
          value={summary?.lowTurnover ?? 0}
          icon={TrendingDown}
          iconBg="bg-danger/10 text-danger"
        />
        <StatsCard
          label="Tỷ lệ trung bình"
          value={`${summary?.averageTurnoverRate ?? 0}%`}
          icon={BarChart3}
          iconBg="bg-info/10 text-info"
        />
      </div>

      <ReportFilters onExport={handleExport} isExporting={exporting} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1 bg-card-white rounded-xl border border-border-ui shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Top luân chuyển
            </h3>
          </div>
          {isLoading && (
            <div className="h-64 bg-background-app animate-pulse rounded-xl" />
          )}
          {error && (
            <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl p-4">
              Không thể tải top sản phẩm
            </div>
          )}
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
          <div className="p-4 sm:p-5 border-b border-border-ui">
            <h3 className="text-sm font-semibold text-text-primary">
              Bảng xếp hạng chi tiết
            </h3>
          </div>
          <div className="hidden sm:block overflow-x-auto">
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

          <div className="sm:hidden divide-y divide-border-ui">
            {topProducts.map((product) => {
              const TrendIcon = trendConfig[product.trend].icon;
              return (
                <div key={product.sku} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-black flex items-center justify-center shrink-0">
                          {product.rank}
                        </span>
                        <p className="text-sm font-bold text-text-primary truncate">
                          {product.name}
                        </p>
                      </div>
                      <p className="mt-1 text-[11px] text-text-secondary font-mono truncate">
                        {product.sku} · {product.category}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0",
                        trendConfig[product.trend].className,
                      )}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {trendConfig[product.trend].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-success/10 px-2 py-2">
                      <p className="text-[10px] text-text-secondary">Nhập</p>
                      <p className="text-sm font-bold text-success">
                        {product.inboundQty}
                      </p>
                    </div>
                    <div className="rounded-lg bg-danger/10 px-2 py-2">
                      <p className="text-[10px] text-text-secondary">Xuất</p>
                      <p className="text-sm font-bold text-danger">
                        {product.outboundQty}
                      </p>
                    </div>
                    <div className="rounded-lg bg-background-app px-2 py-2">
                      <p className="text-[10px] text-text-secondary">Tồn</p>
                      <p className="text-sm font-bold text-text-primary">
                        {product.stock}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
