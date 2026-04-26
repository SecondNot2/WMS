"use client";

import React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerProps {
  type: "inventory" | "inbound" | "outbound";
  count: number;
  message?: string;
  linkText?: string;
}

export function AlertBanner({ type, count, message, linkText }: BannerProps) {
  const configs = {
    inventory: {
      bg: "bg-danger/5",
      border: "border-danger/20",
      icon: <AlertTriangle className="w-4 h-4 text-danger" />,
      defaultText: `Hàng sắp hết: ${count}`,
      defaultLink: "Xem ngay",
      linkColor: "text-danger",
    },
    inbound: {
      bg: "bg-warning/5",
      border: "border-warning/20",
      icon: <Clock className="w-4 h-4 text-warning" />,
      defaultText: `Nhập kho chờ: ${count}`,
      defaultLink: "Duyệt",
      linkColor: "text-warning",
    },
    outbound: {
      bg: "bg-accent/5",
      border: "border-accent/20",
      icon: <Clock className="w-4 h-4 text-accent" />,
      defaultText: `Xuất kho chờ: ${count}`,
      defaultLink: "Duyệt",
      linkColor: "text-accent",
    },
  };

  const config = configs[type];
  const text = message ?? config.defaultText;
  const link = linkText ?? config.defaultLink;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-lg border shadow-sm transition-all hover:shadow-md cursor-pointer group",
        config.bg,
        config.border,
      )}
    >
      <div className="flex items-center space-x-2.5">
        <div className="shrink-0">{config.icon}</div>
        <span className="text-[12px] font-semibold text-text-primary">
          {text}
        </span>
      </div>
      <button
        className={cn(
          "text-[11px] font-bold flex items-center hover:underline opacity-80 group-hover:opacity-100",
          config.linkColor,
        )}
      >
        {link}
      </button>
    </div>
  );
}
