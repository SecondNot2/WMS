"use client";

import React from "react";
import { Search, Clock, Box, Tag, Download, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

// Global activity log mock data
const mockGlobalLogs = [
  {
    id: "1",
    time: "20/05/2024 14:30:25",
    user: "Nguyễn Văn A",
    module: "Sản phẩm",
    moduleIcon: Box,
    action: "Cập nhật",
    details: "Thay đổi giá bán SP000456: 350,000đ → 370,000đ",
    type: "update",
  },
  {
    id: "2",
    time: "20/05/2024 11:15:10",
    user: "Trần Thị B",
    module: "Nhập kho",
    moduleIcon: Download,
    action: "Phê duyệt",
    details: "Phê duyệt phiếu nhập kho #PN-20240520-01",
    type: "approve",
  },
  {
    id: "3",
    time: "20/05/2024 10:05:00",
    user: "Lê Văn C",
    module: "Nhà cung cấp",
    moduleIcon: Truck,
    action: "Thêm mới",
    details: "Thêm nhà cung cấp mới: Công ty TNHH ABC",
    type: "create",
  },
  {
    id: "4",
    time: "19/05/2024 16:45:00",
    user: "Admin",
    module: "Hệ thống",
    moduleIcon: Tag,
    action: "Cấu hình",
    details: "Thay đổi cấu hình gửi thông báo qua Email",
    type: "config",
  },
  {
    id: "5",
    time: "19/05/2024 09:30:15",
    user: "Nguyễn Văn A",
    module: "Sản phẩm",
    moduleIcon: Box,
    action: "Tạo mới",
    details: "Thêm sản phẩm mới SP000999",
    type: "create",
  },
];

const actionStyles = {
  create: "bg-success/10 text-success border-success/20",
  update: "bg-accent/10 text-accent border-accent/20",
  approve: "bg-info/10 text-info border-info/20",
  config: "bg-warning/10 text-warning border-warning/20",
  delete: "bg-danger/10 text-danger border-danger/20",
};

export default function GlobalActivityLogPage() {
  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Nhật ký hoạt động hệ thống
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Lưu trữ toàn bộ lịch sử thao tác của người dùng trên toàn hệ thống WMS
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              placeholder="Tìm theo người dùng, nội dung, module..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background-app border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>

          <select className="text-sm bg-background-app border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary font-medium">
            <option value="">Tất cả module</option>
            <option value="products">Sản phẩm</option>
            <option value="inbound">Nhập kho</option>
            <option value="outbound">Xuất kho</option>
            <option value="suppliers">Nhà cung cấp</option>
          </select>

          <select className="text-sm bg-background-app border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary font-medium">
            <option value="">Tất cả hành động</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
            <option value="approve">Phê duyệt</option>
          </select>

          <div className="flex items-center gap-2 px-3 py-2 bg-background-app border border-border-ui rounded-lg">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-primary font-medium">
              7 ngày qua
            </span>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="divide-y divide-border-ui">
          {mockGlobalLogs.map((log) => (
            <div
              key={log.id}
              className="p-5 hover:bg-background-app/20 transition-colors flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <log.moduleIcon className="w-5 h-5 text-accent" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      {log.user}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background-app text-text-secondary border border-border-ui uppercase tracking-wider font-bold">
                      {log.module}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {log.time}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tight",
                      actionStyles[log.type as keyof typeof actionStyles],
                    )}
                  >
                    {log.action}
                  </span>
                  <p className="text-sm text-text-primary font-medium truncate">
                    {log.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="p-4 bg-background-app/30 border-t border-border-ui text-center">
          <button className="text-xs font-bold text-accent hover:underline">
            Tải thêm nhật ký
          </button>
        </div>
      </div>
    </div>
  );
}
