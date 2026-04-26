"use client";

import React from "react";
import { AlertBanner } from "@/components/AlertBanner";
import { StatsCard } from "@/components/StatsCard";
import { Box, Database, FileCheck, FileUp, Coins } from "lucide-react";
import { InventoryDonutChart } from "@/components/charts/InventoryDonutChart";
import { ShipmentComboChart } from "@/components/charts/ShipmentComboChart";
import { InventoryAlerts } from "@/components/InventoryAlerts";
import { DashboardTable, StatusBadge } from "@/components/DashboardTable";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";

const inboundColumns = [
  {
    header: "Mã phiếu",
    accessor: "id",
    render: (val: unknown) => (
      <span className="text-accent font-medium">{val as string}</span>
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
    accessor: "id",
    render: (val: unknown) => (
      <span className="text-accent font-medium">{val as string}</span>
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

const inboundData = [
  {
    id: "#PN1023",
    supplier: "Samsung Vina",
    date: "25/04/2026",
    status: "approved",
  },
  {
    id: "#PN1022",
    supplier: "Logitech VN",
    date: "24/04/2026",
    status: "pending",
  },
  {
    id: "#PN1021",
    supplier: "Dell Global",
    date: "24/04/2026",
    status: "approved",
  },
  {
    id: "#PN1020",
    supplier: "Apple Store",
    date: "23/04/2026",
    status: "rejected",
  },
  {
    id: "#PN1019",
    supplier: "Xiaomi Official",
    date: "22/04/2026",
    status: "approved",
  },
];

const outboundData = [
  {
    id: "#PX0988",
    receiver: "Kho Quận 1",
    date: "25/04/2026",
    status: "pending",
  },
  {
    id: "#PX0987",
    receiver: "Kho Thủ Đức",
    date: "25/04/2026",
    status: "approved",
  },
  {
    id: "#PX0986",
    receiver: "Đại lý Hà Nội",
    date: "24/04/2026",
    status: "approved",
  },
  {
    id: "#PX0985",
    receiver: "Kho Đà Nẵng",
    date: "23/04/2026",
    status: "approved",
  },
  {
    id: "#PX0984",
    receiver: "Kho Cần Thơ",
    date: "23/04/2026",
    status: "pending",
  },
];

export default function Home() {
  return (
    <div className="p-5 space-y-4">
      {/* Alert Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <AlertBanner type="inventory" count={5} />
        <AlertBanner type="inbound" count={12} />
        <AlertBanner type="outbound" count={8} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatsCard
          label="Tổng số sản phẩm"
          value="1,284"
          icon={Box}
          iconBg="bg-accent/10 text-accent"
          trend={{ value: "12%", isUp: true }}
        />
        <StatsCard
          label="Tổng tồn kho"
          value="42,500"
          icon={Database}
          iconBg="bg-success/10 text-success"
          trend={{ value: "5%", isUp: true }}
        />
        <StatsCard
          label="Phiếu nhập (tháng)"
          value="156"
          icon={FileCheck}
          iconBg="bg-success/15 text-success"
          trend={{ value: "8%", isUp: true }}
        />
        <StatsCard
          label="Phiếu xuất (tháng)"
          value="142"
          icon={FileUp}
          iconBg="bg-warning/10 text-warning"
          trend={{ value: "3%", isUp: false }}
        />
        <StatsCard
          label="Giá trị tồn kho"
          value="2.4B"
          icon={Coins}
          iconBg="bg-info/10 text-info"
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
            data={inboundData}
          />
        </div>
        <div className="xl:col-span-5">
          <DashboardTable
            title="Phiếu xuất mới nhất"
            columns={outboundColumns}
            data={outboundData}
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
