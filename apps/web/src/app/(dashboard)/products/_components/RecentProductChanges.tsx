"use client";

import React from "react";
import { ArrowRight, History } from "lucide-react";
import Link from "next/link";

const recentChanges = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    role: "Admin",
    action: "Cập nhật tồn kho",
    product: "Chuột không dây Logitech M331",
    time: "17/05/2024 14:32",
    details: "Thay đổi tồn kho: 100 → 120",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    dotColor: "bg-success",
  },
  {
    id: 2,
    user: "Trần Thị B",
    role: "Thủ kho",
    action: "Cập nhật giá",
    product: "Màn hình Dell 24 inch P2419H",
    time: "17/05/2024 11:15",
    details: "Cập nhật giá bán: 3.500.000 → 3.650.000",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    dotColor: "bg-warning",
  },
  {
    id: 3,
    user: "Lê Văn C",
    role: "Thủ kho",
    action: "Hết hàng",
    product: "Laptop Dell Inspiron 15 3520",
    time: "16/05/2024 09:45",
    details: "Thay đổi tồn kho: 2 → 0",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    dotColor: "bg-danger",
  },
];

export function RecentProductChanges() {
  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border-ui flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">
            Lịch sử thay đổi gần đây
          </h3>
        </div>
        <Link
          href="/products/activity-log"
          className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
        >
          Xem tất cả lịch sử <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentChanges.map((change) => (
          <div
            key={change.id}
            className="relative pl-6 border-l border-border-ui last:border-l-0 md:last:border-l"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-1.25 top-0 w-2.5 h-2.5 rounded-full ${change.dotColor} border-2 border-white shadow-sm`}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-text-secondary">
                  {change.time}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={change.avatar}
                  alt={change.user}
                  className="w-8 h-8 rounded-full border border-border-ui"
                />
                <div>
                  <p className="text-[13px] font-bold text-text-primary">
                    {change.user}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {change.role}
                  </p>
                </div>
              </div>

              <div className="bg-background-app/50 p-2.5 rounded-lg border border-border-ui">
                <p className="text-[12px] font-semibold text-accent mb-1">
                  {change.action}
                </p>
                <p className="text-[12px] text-text-primary font-medium line-clamp-1">
                  {change.product}
                </p>
                <p className="text-[11px] text-text-secondary mt-1">
                  {change.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
