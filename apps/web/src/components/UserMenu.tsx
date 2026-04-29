"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
import { useLogout } from "@/lib/hooks/use-auth";
import type { AuthUser } from "@wms/types";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/permissions";

interface UserMenuProps {
  user: AuthUser | null;
  /** Vị trí mở dropdown — bottom-right (Topbar) hoặc top-right (Sidebar) */
  placement?: "bottom-right" | "top-right";
  /** Variant hiển thị trigger:
   *  - 'topbar': hiển thị name+role+avatar bên cạnh chevron
   *  - 'sidebar-expanded': hiển thị avatar+name+role full
   *  - 'sidebar-collapsed': chỉ hiển thị avatar tròn */
  variant?: "topbar" | "sidebar-expanded" | "sidebar-collapsed";
}

function avatarUrl(user: AuthUser | null) {
  if (!user) return "https://api.dicebear.com/7.x/avataaars/svg?seed=guest";
  return (
    user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
  );
}

export function UserMenu({
  user,
  placement = "bottom-right",
  variant = "topbar",
}: UserMenuProps) {
  const logoutMutation = useLogout();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const displayName = user?.name ?? "Đang tải...";
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : "—";
  const email = user?.email ?? "—";
  const avatar = avatarUrl(user);

  const dropdownPositionCls =
    placement === "top-right"
      ? "bottom-full mb-2 right-0"
      : "top-full mt-2 right-0";

  return (
    <div className="relative" ref={ref}>
      {variant === "topbar" && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center space-x-3 pl-3 border-l border-border-ui cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
              {displayName}
            </p>
            <p className="text-[10px] text-text-secondary">{roleLabel}</p>
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
              open && "rotate-180",
            )}
          />
        </button>
      )}

      {variant === "sidebar-expanded" && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center px-1 gap-3 hover:bg-white/5 rounded-md p-1 transition-colors group"
          title="Tài khoản"
        >
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 overflow-hidden shrink-0">
            <img
              src={avatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-1 overflow-hidden flex-1 text-left">
            <p className="text-sm font-semibold text-white truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-white/60 truncate">{roleLabel}</p>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-white/60 group-hover:text-white transition-all shrink-0",
              open && "rotate-180",
            )}
          />
        </button>
      )}

      {variant === "sidebar-collapsed" && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 overflow-hidden mx-auto flex items-center justify-center hover:ring-2 hover:ring-accent/40 transition-all"
          title={displayName}
        >
          <img
            src={avatar}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {open && (
        <div
          className={cn(
            "absolute w-56 bg-card-white border border-border-ui rounded-xl shadow-2xl overflow-hidden z-50",
            dropdownPositionCls,
          )}
        >
          <div className="px-4 py-3 border-b border-border-ui">
            <p className="text-sm font-bold text-text-primary truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-text-secondary truncate">{email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-background-app transition-colors"
          >
            <UserRound className="w-4 h-4 text-accent" />
            Hồ sơ cá nhân
          </Link>
          <Link
            href="/profile?tab=password"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-background-app transition-colors"
          >
            <KeyRound className="w-4 h-4 text-warning" />
            Đổi mật khẩu
          </Link>
          <div className="border-t border-border-ui">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
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
  );
}
