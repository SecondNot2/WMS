"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { AlertBanner } from "@/components/AlertBanner";
import { StatsCard } from "@/components/StatsCard";
import {
  Box,
  Database,
  FileCheck,
  FileUp,
  Coins,
} from "lucide-react";
import { InventoryDonutChart } from "@/components/charts/InventoryDonutChart";
import { ShipmentComboChart } from "@/components/charts/ShipmentComboChart";
import { InventoryAlerts } from "@/components/InventoryAlerts";
import { DashboardTable, StatusBadge } from "@/components/DashboardTable";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { useLayoutStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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
    render: (val: unknown) => <StatusBadge status={val as "pending" | "approved" | "rejected"} />,
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
    render: (val: unknown) => <StatusBadge status={val as "pending" | "approved" | "rejected"} />,
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
  const { sidebarCollapsed } = useLayoutStore();

  return (
    <div className="min-h-screen bg-background-app">
      <Sidebar />

      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "pl-18" : "pl-60",
        )}
      >
        <Topbar title="Tổng quan" />

        <div className="pt-20 pb-8 px-5 space-y-4">
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
              iconBg="bg-[#dbeafe] text-[#1e40af]"
              trend={{ value: "12%", isUp: true }}
            />
            <StatsCard
              label="Tổng tồn kho"
              value="42,500"
              icon={Database}
              iconBg="bg-[#dcfce7] text-[#15803d]"
              trend={{ value: "5%", isUp: true }}
            />
            <StatsCard
              label="Phiếu nhập (tháng)"
              value="156"
              icon={FileCheck}
              iconBg="bg-[#bbf7d0] text-[#166534]"
              trend={{ value: "8%", isUp: true }}
            />
            <StatsCard
              label="Phiếu xuất (tháng)"
              value="142"
              icon={FileUp}
              iconBg="bg-[#fed7aa] text-[#9a3412]"
              trend={{ value: "3%", isUp: false }}
            />
            <StatsCard
              label="Giá trị tồn kho"
              value="2.4B"
              icon={Coins}
              iconBg="bg-[#ede9fe] text-[#6b21a8]"
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
      </main>
    </div>
  );
}
