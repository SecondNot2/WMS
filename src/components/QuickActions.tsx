"use client";

import {
  Box,
  Download,
  Upload,
  Activity,
  BarChart,
  Grid,
  Truck,
  Building,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Thêm sản phẩm", icon: Box, color: "bg-accent/10 text-accent" },
  { label: "Nhập kho", icon: Download, color: "bg-success/10 text-success" },
  { label: "Xuất kho", icon: Upload, color: "bg-warning/10 text-warning" },
  {
    label: "Kiểm tra tồn kho",
    icon: Activity,
    color: "bg-accent/10 text-accent",
  },
  { label: "Báo cáo", icon: BarChart, color: "bg-success/10 text-success" },
  { label: "Danh mục", icon: Grid, color: "bg-info/10 text-info" },
  { label: "Nhà cung cấp", icon: Truck, color: "bg-warning/10 text-warning" },
  { label: "Người nhận", icon: Building, color: "bg-accent/10 text-accent" },
  { label: "Người dùng", icon: Users, color: "bg-accent/10 text-accent" },
];

export function QuickActions() {
  return (
    <div className="bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-text-primary">
          Thao tác nhanh
        </h3>
        <button className="text-[10px] font-bold text-accent hover:underline uppercase tracking-wider">
          Tất cả
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-transparent hover:border-border-ui hover:bg-background-app hover:shadow-sm transition-all group"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all group-hover:scale-110 group-hover:shadow-inner",
                action.color,
              )}
            >
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-text-primary group-hover:text-accent transition-colors text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
