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
  PanelLeftOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/lib/store";

const menuGroups = [
  {
    label: "TỔNG QUAN",
    items: [
      { name: "Tổng quan", icon: LayoutGrid, href: "/" },
    ],
  },
  {
    label: "QUẢN LÝ KHO",
    items: [
      { name: "Sản phẩm", icon: Box, href: "/products" },
      { name: "Danh mục", icon: Tag, href: "/categories" },
      { name: "Nhập kho", icon: Download, href: "/inbound" },
      { name: "Xuất kho", icon: Upload, href: "/outbound" },
      { name: "Tồn kho realtime", icon: Activity, href: "/inventory" },
      { name: "Cảnh báo", icon: Bell, href: "/alerts" },
    ],
  },
  {
    label: "BÁO CÁO",
    items: [
      { name: "Thống kê", icon: BarChart, href: "/statistics" },
      { name: "Báo cáo", icon: FileText, href: "/reports" },
    ],
  },
  {
    label: "QUẢN LÝ",
    items: [
      { name: "Nhà cung cấp", icon: Truck, href: "/suppliers" },
      { name: "Đơn vị nhận hàng", icon: Building, href: "/receivers" },
    ],
  },
  {
    label: "HỆ THỐNG",
    items: [
      { name: "Người dùng", icon: Users, href: "/users" },
      { name: "Vai trò & phân quyền", icon: Shield, href: "/roles" },
      { name: "Nhật ký hoạt động", icon: Clock, href: "/activity-log" },
      { name: "Cài đặt", icon: Settings, href: "/settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-primary text-[#a8c4db] flex flex-col z-50 transition-all duration-300",
      sidebarCollapsed ? "w-18" : "w-60"
    )}>
      <div className="h-16 flex items-center px-4 border-b border-white/10 justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3">
              <Box className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-sm tracking-wider uppercase truncate">WMS System</span>
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
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-[#7fa8c9] hover:text-white"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {menuGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <h3 className="px-3 text-[10px] font-semibold text-[#7fa8c9] tracking-[1.5px] mb-2 uppercase">
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
                        : "hover:bg-white/5 hover:text-white"
                    )}
                    title={sidebarCollapsed ? item.name : ""}
                  >
                    <item.icon className={cn(
                      "w-4.5 h-4.5 transition-colors",
                      !sidebarCollapsed && "mr-3",
                      isActive ? "text-white" : "text-[#7fa8c9] group-hover:text-white"
                    )} />
                    {!sidebarCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                    {isActive && !sidebarCollapsed && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/10 bg-primary/50">
        <div className={cn("flex items-center", sidebarCollapsed ? "justify-center" : "px-1")}>
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 overflow-hidden cursor-pointer">
             <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Nguyễn Văn A</p>
              <p className="text-[11px] text-[#7fa8c9] truncate">Quản trị viên</p>
            </div>
          )}
        </div>
        {sidebarCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="w-full mt-4 flex justify-center p-2 hover:bg-white/10 rounded-md transition-colors text-[#7fa8c9]"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
