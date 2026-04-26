"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { useLayoutStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useLayoutStore();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background-app">
      <Sidebar />

      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarCollapsed ? "pl-18" : "pl-60"
        )}
      >
        <Topbar />

        <div className="pt-16 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
