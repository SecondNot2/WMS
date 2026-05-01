"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useLayoutStore, useAuthStore } from "@/lib/store";
import { useMe } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "./Breadcrumb";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const { sidebarCollapsed, toggleSidebar, toggleMobileSidebar } =
    useLayoutStore();
  const storedUser = useAuthStore((s) => s.user);

  // Đồng bộ user mới nhất từ server (cập nhật khi đổi profile)
  useMe();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 h-16 bg-card-white border-b border-border-ui shadow-sm z-40 flex items-center justify-between px-3 sm:px-4 md:px-6 transition-all duration-300",
        sidebarCollapsed ? "md:left-18" : "md:left-60",
      )}
    >
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary md:hidden"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:inline-flex p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary"
          aria-label="Thu gọn menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block min-w-0">
          <Breadcrumb />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        <GlobalSearch />

        <div className="flex items-center space-x-2 sm:space-x-3">
          <NotificationBell />
          <UserMenu
            user={storedUser}
            variant="topbar"
            placement="bottom-right"
          />
        </div>
      </div>
    </header>
  );
}
