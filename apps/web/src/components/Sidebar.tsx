"use client";

import React from "react";
import {
  LayoutGrid,
  Box,
  Tag,
  Download,
  Upload,
  Activity,
  Bell,
  BarChart,
  FileText,
  Truck,
  Building,
  Users,
  Shield,
  Clock,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useLayoutStore } from "@/lib/store";
import { can, type PermissionAction } from "@/lib/permissions";
import { useSettings } from "@/lib/hooks/use-settings";
import { UserMenu } from "./UserMenu";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  /** Action key để check quyền — không có nghĩa là tất cả role đều thấy */
  permission?: PermissionAction;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "TỔNG QUAN",
    items: [{ name: "Tổng quan", icon: LayoutGrid, href: "/" }],
  },
  {
    label: "QUẢN LÝ KHO",
    items: [
      {
        name: "Sản phẩm",
        icon: Box,
        href: "/products",
        permission: "product.view",
      },
      {
        name: "Danh mục",
        icon: Tag,
        href: "/categories",
        permission: "category.view",
      },
      {
        name: "Nhập kho",
        icon: Download,
        href: "/inbound",
        permission: "receipt.view",
      },
      {
        name: "Xuất kho",
        icon: Upload,
        href: "/outbound",
        permission: "issue.view",
      },
      {
        name: "Tồn kho realtime",
        icon: Activity,
        href: "/inventory",
        permission: "stock.view",
      },
      {
        name: "Cảnh báo",
        icon: Bell,
        href: "/alerts",
        permission: "stock.view",
      },
    ],
  },
  {
    label: "BÁO CÁO",
    items: [
      {
        name: "Thống kê",
        icon: BarChart,
        href: "/statistics",
        permission: "report.view",
      },
      {
        name: "Báo cáo",
        icon: FileText,
        href: "/reports",
        permission: "report.view",
      },
    ],
  },
  {
    label: "QUẢN LÝ",
    items: [
      {
        name: "Nhà cung cấp",
        icon: Truck,
        href: "/suppliers",
        permission: "supplier.view",
      },
      {
        name: "Đơn vị nhận hàng",
        icon: Building,
        href: "/receivers",
        permission: "recipient.view",
      },
    ],
  },
  {
    label: "HỆ THỐNG",
    items: [
      {
        name: "Người dùng",
        icon: Users,
        href: "/users",
        permission: "user.view",
      },
      {
        name: "Vai trò & phân quyền",
        icon: Shield,
        href: "/roles",
        permission: "role.view",
      },
      {
        name: "Nhật ký hoạt động",
        icon: Clock,
        href: "/activity-log",
        permission: "activityLog.view",
      },
      { name: "Cài đặt", icon: Settings, href: "/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;
  const { data: settings } = useSettings();
  const brandName = settings?.values.general.systemName ?? "WMS System";

  // Lọc theo quyền — item không có `permission` thì luôn hiển thị
  const visibleGroups = React.useMemo(
    () =>
      menuGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => !item.permission || can(role, item.permission),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [role],
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-primary text-white/70 flex flex-col z-50 transition-all duration-300",
        sidebarCollapsed ? "w-18" : "w-60",
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-white/10 justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3">
              <Box className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-sm tracking-wider uppercase truncate">
              WMS System
            </span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-full flex justify-center">
            <Box className="text-accent w-6 h-6" />
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <h3 className="px-3 text-[10px] font-semibold text-white/50 tracking-[1.5px] mb-2 uppercase">
                {group.label}
              </h3>
            )}
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium transition-all group cursor-pointer",
                      sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2",
                      isActive
                        ? "bg-accent text-white"
                        : "hover:bg-white/5 hover:text-white",
                    )}
                    title={sidebarCollapsed ? item.name : ""}
                  >
                    <item.icon
                      className={cn(
                        "w-4.5 h-4.5 transition-colors",
                        !sidebarCollapsed && "mr-3",
                        isActive
                          ? "text-white"
                          : "text-white/60 group-hover:text-white",
                      )}
                    />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/10 bg-primary/50">
        <UserMenu
          user={user}
          variant={sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}
          placement="top-right"
        />
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full mt-3 flex justify-center p-2 hover:bg-white/10 rounded-md transition-colors text-white/60"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
