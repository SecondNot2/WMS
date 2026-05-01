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
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/Combobox";
import { usePerformance } from "@/lib/hooks/use-statistics";
import { getApiErrorMessage } from "@/lib/api/client";
import type { StatisticsRange } from "@wms/types";

export function ShipmentComboChart() {
  const [range, setRange] = React.useState<StatisticsRange>("7d");
  const {
    data: performance,
    isLoading,
    isError,
    error,
  } = usePerformance({ range });

  const data = React.useMemo(
    () =>
      performance?.flowSeries.map((p) => ({
        name: p.label,
        inbound: p.inbound,
        outbound: p.outbound,
      })) ?? [],
    [performance],
  );

  const totalInbound = performance?.summary.totalInbound;
  const totalOutbound = performance?.summary.totalOutbound;

  return (
    <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm h-full min-h-92 sm:min-h-80 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-sm font-semibold text-text-primary">
          Biểu đồ nhập / xuất kho
        </h3>
        <div className="w-full sm:w-auto sm:min-w-32">
          <Combobox<StatisticsRange>
            value={range}
            onChange={(next) => setRange((next as StatisticsRange) || "7d")}
            options={[
              { value: "7d", label: "7 ngày qua" },
              { value: "30d", label: "30 ngày qua" },
              { value: "3m", label: "3 tháng qua" },
              { value: "1y", label: "1 năm qua" },
            ]}
            searchable={false}
          />
        </div>
      </div>

      <div className="h-56 sm:h-44 xl:h-36 shrink-0 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-xs">Đang tải...</span>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex items-center justify-center text-danger text-xs px-4 text-center">
            {getApiErrorMessage(error, "Không thể tải biểu đồ")}
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-xs">
            Không có dữ liệu trong khoảng đã chọn
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 1, height: 1 }}
          >
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 8, bottom: 0, left: -24 }}
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
                interval="preserveStartEnd"
                minTickGap={14}
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
                barSize={18}
                fill="#2d7dd2"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                name="Xuất kho"
                dataKey="outbound"
                barSize={18}
                fill="#f59e0b"
                radius={[3, 3, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border-ui grid grid-cols-1 min-[390px]:grid-cols-2 gap-3">
        <div className="flex items-center justify-center min-[390px]:justify-start space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent border border-accent" />
          <span className="text-[11px] text-text-secondary">
            Nhập kho:{" "}
            <span className="font-bold text-text-primary">
              {totalInbound
                ? new Intl.NumberFormat("vi-VN").format(totalInbound.value)
                : "-"}
            </span>
          </span>
          {totalInbound && <TrendBadge value={totalInbound.trend} />}
        </div>
        <div className="flex items-center justify-center min-[390px]:justify-start space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-warning border border-warning" />
          <span className="text-[11px] text-text-secondary">
            Xuất kho:{" "}
            <span className="font-bold text-text-primary">
              {totalOutbound
                ? new Intl.NumberFormat("vi-VN").format(totalOutbound.value)
                : "-"}
            </span>
          </span>
          {totalOutbound && <TrendBadge value={totalOutbound.trend} />}
        </div>
      </div>
    </div>
  );
}

function TrendBadge({ value }: { value: number }) {
  const isUp = value >= 0;
  return (
    <span
      className={cn(
        "text-[10px] font-bold flex items-center gap-0.5",
        isUp ? "text-success" : "text-danger",
      )}
    >
      {isUp ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {isUp ? "+" : ""}
      {value.toFixed(0)}%
    </span>
  );
}
