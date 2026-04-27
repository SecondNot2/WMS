"use client";

import React from "react";
import { ArrowRight, History } from "lucide-react";
import Link from "next/link";

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

      <div className="p-8 text-center">
        <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
          Hiện chưa có endpoint tổng hợp lịch sử thay đổi sản phẩm. Lịch sử tồn
          kho theo từng sản phẩm có thể xem trong trang chi tiết sản phẩm qua
          endpoint{" "}
          <code className="font-mono">/products/:id/stock-history</code>.
        </p>
      </div>
    </div>
  );
}
