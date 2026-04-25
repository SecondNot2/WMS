"use client";

import React from "react";
import { Search, Filter, Download, History, Package, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// TODO: swap with useQuery → GET /products/activity-log
const mockLogs = [
  {
    id: "1",
    time: "20/05/2024 14:30:25",
    user: "Nguyễn Văn A",
    role: "Quản trị viên",
    action: "Cập nhật sản phẩm",
    product: "Chuột không dây Logitech M331",
    sku: "SP000456",
    details: "Thay đổi giá bán: 350,000đ → 370,000đ",
    type: "update",
  },
  {
    id: "2",
    time: "20/05/2024 11:15:10",
    user: "Trần Thị B",
    role: "Nhân viên kho",
    action: "Nhập kho",
    product: "Bàn phím cơ AKKO 3068",
    sku: "SP000789",
    details: "Nhập thêm 50 cái (Mã phiếu #PN-20240520-01)",
    type: "inbound",
  },
  {
    id: "3",
    time: "19/05/2024 16:45:00",
    user: "Lê Văn C",
    role: "Nhân viên kho",
    action: "Xuất kho",
    product: "Tai nghe Sony WH-1000XM5",
    sku: "SP000123",
    details: "Xuất 2 cái (Mã phiếu #PX-20240519-05)",
    type: "outbound",
  },
  {
    id: "4",
    time: "19/05/2024 09:30:15",
    user: "Nguyễn Văn A",
    role: "Quản trị viên",
    action: "Tạo sản phẩm",
    product: "Lót chuột Razer Goliathus",
    sku: "SP000999",
    details: "Thêm sản phẩm mới vào hệ thống",
    type: "create",
  },
  {
    id: "5",
    time: "18/05/2024 15:20:45",
    user: "Trần Thị B",
    role: "Nhân viên kho",
    action: "Cập nhật tồn kho",
    product: "Webcam Logitech C922",
    sku: "SP000222",
    details: "Điều chỉnh tồn kho: 15 → 12 (Lý do: Hàng hỏng)",
    type: "adjustment",
  },
];

const typeStyles = {
  create: "bg-success/10 text-success border-success/20",
  update: "bg-accent/10 text-accent border-accent/20",
  delete: "bg-danger/10 text-danger border-danger/20",
  inbound: "bg-info/10 text-info border-info/20",
  outbound: "bg-warning/10 text-warning border-warning/20",
  adjustment: "bg-danger/10 text-danger border-danger/20",
};

export default function ProductActivityLogPage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <History className="w-6 h-6 text-accent" />
            Nhật ký hoạt động sản phẩm
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi mọi thay đổi liên quan đến sản phẩm trong hệ thống
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm self-start md:self-auto">
          <Download className="w-4 h-4" /> Xuất nhật ký
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              placeholder="Tìm theo sản phẩm, SKU, người thực hiện..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background-app border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-secondary" />
            <select className="text-sm bg-background-app border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary font-medium">
              <option value="">Tất cả hành động</option>
              <option value="create">Tạo mới</option>
              <option value="update">Cập nhật</option>
              <option value="inbound">Nhập kho</option>
              <option value="outbound">Xuất kho</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <select className="text-sm bg-background-app border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary font-medium">
              <option value="">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Thời gian</th>
                <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Người thực hiện</th>
                <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Hành động</th>
                <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Sản phẩm</th>
                <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Chi tiết thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-background-app/20 transition-colors group">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-xs font-bold text-text-primary">{log.time.split(" ")[0]}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{log.time.split(" ")[1]}</p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">{log.user}</p>
                        <p className="text-[10px] text-text-secondary">{log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                      typeStyles[log.type as keyof typeof typeStyles]
                    )}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 min-w-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-background-app flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary line-clamp-1">{log.product}</p>
                        <p className="text-[10px] text-text-secondary font-mono">{log.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-text-secondary leading-relaxed max-w-md">
                      {log.details}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="px-5 py-4 border-t border-border-ui flex items-center justify-between bg-background-app/10">
          <p className="text-[11px] text-text-secondary font-medium">
            Hiển thị <span className="text-text-primary font-bold">1 - 5</span> trong <span className="text-text-primary font-bold">1,240</span> nhật ký
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-border-ui rounded text-[11px] font-bold text-text-secondary hover:bg-background-app disabled:opacity-50 transition-colors" disabled>Trước</button>
            <button className="px-3 py-1 bg-white border border-border-ui rounded text-[11px] font-bold text-text-secondary hover:bg-background-app transition-colors">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
