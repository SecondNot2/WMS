"use client";

import React from "react";
import { Download, Upload, Activity, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    user: "Trần Văn B",
    action: "đã nhập kho",
    target: "Phiếu #PN1023",
    time: "2 giờ trước",
    icon: Download,
    iconColor: "bg-success/10 text-success"
  },
  {
    id: 2,
    user: "Lê Thị C",
    action: "đã xuất kho",
    target: "Phiếu #PX0988",
    time: "4 giờ trước",
    icon: Upload,
    iconColor: "bg-warning/10 text-warning"
  },
  {
    id: 3,
    user: "Nguyễn Văn A",
    action: "đã cập nhật",
    target: "Sản phẩm SKU-455",
    time: "Hôm qua, 14:30",
    icon: Activity,
    iconColor: "bg-accent/10 text-accent"
  },
  {
    id: 4,
    user: "Hệ thống",
    action: "đã cảnh báo",
    target: "Tồn kho thấp: Laptop Dell",
    time: "Hôm qua, 09:15",
    icon: Box,
    iconColor: "bg-danger/10 text-danger"
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white p-4 rounded-xl border border-border-ui shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-semibold text-text-primary mb-6">Hoạt động gần đây</h3>
      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4.25 before:h-full before:w-0.5 before:bg-background-app flex-1 overflow-y-auto pr-1 scrollbar-hide">
        {activities.map((item) => (
          <div key={item.id} className="relative flex items-start pl-10 group cursor-pointer">
            <div className={cn(
              "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110",
              item.iconColor
            )}>
              <item.icon className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[12px] text-text-primary leading-snug">
                <span className="font-semibold">{item.user}</span> {item.action}{" "}
                <span className="font-medium text-accent hover:underline">{item.target}</span>
              </p>
              <p className="text-[10px] text-text-secondary">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3 border-t border-border-ui flex justify-end">
        <button className="text-[11px] font-bold text-accent hover:underline flex items-center">
          Xem tất cả <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
}
