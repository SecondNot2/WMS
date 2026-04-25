"use client";

import React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerProps {
  type: "inventory" | "inbound" | "outbound";
  count: number;
}

export function AlertBanner({ type, count }: BannerProps) {
  const configs = {
    inventory: {
      bg: "bg-[#fef2f2]",
      border: "border-red-100",
      icon: <AlertTriangle className="w-4 h-4 text-danger" />,
      text: `Hàng sắp hết: ${count}`,
      linkText: "Xem ngay",
      linkColor: "text-danger"
    },
    inbound: {
      bg: "bg-[#fffbeb]",
      border: "border-orange-100",
      icon: <Clock className="w-4 h-4 text-warning" />,
      text: `Nhập kho chờ: ${count}`,
      linkText: "Duyệt",
      linkColor: "text-warning"
    },
    outbound: {
      bg: "bg-[#eff6ff]",
      border: "border-blue-100",
      icon: <Clock className="w-4 h-4 text-accent" />,
      text: `Xuất kho chờ: ${count}`,
      linkText: "Duyệt",
      linkColor: "text-accent"
    }
  };

  const config = configs[type];

  return (
    <div className={cn(
      "flex items-center justify-between px-3 py-2.5 rounded-lg border shadow-sm transition-all hover:shadow-md cursor-pointer group",
      config.bg,
      config.border
    )}>
      <div className="flex items-center space-x-2.5">
        <div className="shrink-0">{config.icon}</div>
        <span className="text-[12px] font-semibold text-text-primary">{config.text}</span>
      </div>
      <button className={cn(
        "text-[11px] font-bold flex items-center hover:underline opacity-80 group-hover:opacity-100",
        config.linkColor
      )}>
        {config.linkText}
      </button>
    </div>
  );
}
