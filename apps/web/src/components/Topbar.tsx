"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import { useLayoutStore, useAuthStore } from "@/lib/store";
import { useLogout, useMe } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "./Breadcrumb";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
};

export function Topbar() {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const storedUser = useAuthStore((s) => s.user);

  // Đồng bộ user mới nhất từ server (cập nhật khi đổi profile)
  useMe();

  const logoutMutation = useLogout();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const user = storedUser;
  const displayName = user?.name ?? "Đang tải...";
  const displayRole = user ? (ROLE_LABELS[user.role] ?? user.role) : "—";
  const avatar =
    user?.avatar ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id ?? "guest"}`;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-card-white border-b border-border-ui shadow-sm z-40 flex items-center justify-between px-6 transition-all duration-300",
        sidebarCollapsed ? "left-18" : "left-60",
      )}
    >
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 bg-background-app border-transparent rounded-full text-xs focus:bg-card-white focus:border-accent outline-none transition-all w-64"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-danger text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center space-x-3 pl-3 border-l border-border-ui cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] text-text-secondary">{displayRole}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-text-secondary group-hover:text-text-primary transition-all",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card-white border border-border-ui rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-ui">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-text-secondary truncate">
                    {user?.email ?? "—"}
                  </p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-background-app transition-colors"
                >
                  <UserRound className="w-4 h-4 text-accent" />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="/profile?tab=password"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-background-app transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-warning" />
                  Đổi mật khẩu
                </Link>
                <div className="border-t border-border-ui">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logoutMutation.mutate();
                    }}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors disabled:opacity-60"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
