"use client";

import React from "react";
import Link from "next/link";
import { AlertBanner } from "@/components/AlertBanner";
import { StatsCard } from "@/components/StatsCard";
import { Box, Database, FileCheck, FileUp, Coins } from "lucide-react";
import { InventoryDonutChart } from "@/components/charts/InventoryDonutChart";
import { ShipmentComboChart } from "@/components/charts/ShipmentComboChart";
import { InventoryAlerts } from "@/components/InventoryAlerts";
import { DashboardTable, StatusBadge } from "@/components/DashboardTable";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { useAlertStats } from "@/lib/hooks/use-alerts";
import { useInboundStats, useInbounds } from "@/lib/hooks/use-inbound";
import { useOutboundStats, useOutbounds } from "@/lib/hooks/use-outbound";
import { useInventorySummary } from "@/lib/hooks/use-inventory";
import { usePerformance } from "@/lib/hooks/use-statistics";
import type {
  InboundListItem,
  InboundStatus,
  OutboundListItem,
  OutboundStatus,
  StatisticsSummaryCard,
} from "@wms/types";

const dateFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const numFmt = new Intl.NumberFormat("vi-VN");

const compactCurrency = new Intl.NumberFormat("vi-VN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function statusToLower(s: InboundStatus | OutboundStatus) {
  return s.toLowerCase() as "pending" | "approved" | "rejected";
}

function trendOf(card?: StatisticsSummaryCard) {
  if (!card) return undefined;
  return {
    value: `${Math.abs(card.trend).toFixed(0)}%`,
    isUp: card.trend >= 0,
  };
}

const inboundColumns = [
  {
    header: "Mã phiếu",
    accessor: "code",
    render: (val: unknown, row: Record<string, unknown>) => (
      <Link
        href={`/inbound/${row.id as string}`}
        className="text-accent font-medium hover:underline"
      >
        {val as string}
      </Link>
    ),
  },
  { header: "Nhà cung cấp", accessor: "supplier" },
  { header: "Ngày nhập", accessor: "date" },
  {
    header: "Trạng thái",
    accessor: "status",
    render: (val: unknown) => (
      <StatusBadge status={val as "pending" | "approved" | "rejected"} />
    ),
  },
];

const outboundColumns = [
  {
    header: "Mã phiếu",
    accessor: "code",
    render: (val: unknown, row: Record<string, unknown>) => (
      <Link
        href={`/outbound/${row.id as string}`}
        className="text-accent font-medium hover:underline"
      >
        {val as string}
      </Link>
    ),
  },
  { header: "Đơn vị nhận", accessor: "receiver" },
  { header: "Ngày xuất", accessor: "date" },
  {
    header: "Trạng thái",
    accessor: "status",
    render: (val: unknown) => (
      <StatusBadge status={val as "pending" | "approved" | "rejected"} />
    ),
  },
];

export default function Home() {
  const { data: alertStats } = useAlertStats();
  const { data: inboundStats } = useInboundStats();
  const { data: outboundStats } = useOutboundStats();
  const { data: inventorySummary } = useInventorySummary();
  const { data: performance } = usePerformance({ range: "30d" });

  const { data: recentInbound } = useInbounds({ page: 1, limit: 5 });
  const { data: recentOutbound } = useOutbounds({ page: 1, limit: 5 });

  const summary = performance?.summary;

  const inboundRows = (recentInbound?.data ?? []).map(
    (it: InboundListItem) => ({
      id: it.id,
      code: it.code,
      supplier: it.supplier.name,
      date: dateFmt.format(new Date(it.createdAt)),
      status: statusToLower(it.status),
    }),
  );

  const outboundRows = (recentOutbound?.data ?? []).map(
    (it: OutboundListItem) => ({
      id: it.id,
      code: it.code,
      receiver: it.recipient.name,
      date: dateFmt.format(new Date(it.createdAt)),
      status: statusToLower(it.status),
    }),
  );

  return (
    <div className="p-5 space-y-4">
      {/* Alert Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <AlertBanner type="inventory" count={alertStats?.totalAlerts ?? 0} />
        <AlertBanner type="inbound" count={inboundStats?.pending ?? 0} />
        <AlertBanner type="outbound" count={outboundStats?.pending ?? 0} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatsCard
          label="Tổng số sản phẩm"
          value={
            summary
              ? numFmt.format(summary.activeProducts.value)
              : inventorySummary
                ? numFmt.format(inventorySummary.totalProducts)
                : "—"
          }
          icon={Box}
          iconBg="bg-accent/10 text-accent"
          trend={trendOf(summary?.activeProducts)}
          href="/products"
        />
        <StatsCard
          label="Tổng tồn kho"
          value={
            inventorySummary ? numFmt.format(inventorySummary.totalStock) : "—"
          }
          icon={Database}
          iconBg="bg-success/10 text-success"
          href="/inventory"
        />
        <StatsCard
          label="Phiếu nhập (30 ngày)"
          value={summary ? numFmt.format(summary.totalInbound.value) : "—"}
          icon={FileCheck}
          iconBg="bg-success/15 text-success"
          trend={trendOf(summary?.totalInbound)}
          href="/inbound"
        />
        <StatsCard
          label="Phiếu xuất (30 ngày)"
          value={summary ? numFmt.format(summary.totalOutbound.value) : "—"}
          icon={FileUp}
          iconBg="bg-warning/10 text-warning"
          trend={trendOf(summary?.totalOutbound)}
          href="/outbound"
        />
        <StatsCard
          label="Giá trị tồn kho"
          value={
            summary
              ? compactCurrency.format(summary.inventoryValue.value)
              : inventorySummary
                ? compactCurrency.format(inventorySummary.totalValue)
                : "—"
          }
          icon={Coins}
          iconBg="bg-info/10 text-info"
          trend={trendOf(summary?.inventoryValue)}
          href="/reports"
        />
      </div>

      {/* Main Charts & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-13 gap-4">
        <div className="xl:col-span-5">
          <InventoryDonutChart />
        </div>
        <div className="xl:col-span-5">
          <ShipmentComboChart />
        </div>
        <div className="xl:col-span-3">
          <InventoryAlerts />
        </div>
      </div>

      {/* Compact Tables & Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-13 gap-4">
        <div className="xl:col-span-5">
          <DashboardTable
            title="Phiếu nhập mới nhất"
            columns={inboundColumns}
            data={inboundRows}
            footerHref="/inbound"
          />
        </div>
        <div className="xl:col-span-5">
          <DashboardTable
            title="Phiếu xuất mới nhất"
            columns={outboundColumns}
            data={outboundRows}
            footerHref="/outbound"
          />
        </div>
        <div className="xl:col-span-3">
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions Horizontal */}
      <div className="grid grid-cols-1">
        <QuickActions />
      </div>
    </div>
  );
}
