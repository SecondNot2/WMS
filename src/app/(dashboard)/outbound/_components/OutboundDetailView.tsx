"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Building,
  Calendar,
  FileText,
  Package,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface OutboundDetailViewProps {
  id: string;
}

export function OutboundDetailView({ id }: OutboundDetailViewProps) {
  const router = useRouter();

  // TODO: Replace with useQuery -> GET /goods-issues/:id
  const mockIssue = {
    id: id,
    code: "PXK-2024-0042",
    status: "PENDING",
    recipient: {
      name: "Chi nhánh Lạng Sơn",
      address: "Cửa khẩu Tân Thanh, Lạng Sơn",
      phone: "0205 3888 999",
    },
    purpose: "Xuất hàng định kỳ tháng 5 cho hệ thống cửa hàng biên giới",
    items: [
      {
        id: "1",
        sku: "SP001",
        name: "Chuột không dây Logitech M331",
        unit: "Cái",
        quantity: 20,
        price: 550000,
        total: 11000000,
      },
      {
        id: "2",
        sku: "SP002",
        name: "Bàn phím cơ Keychron K2",
        unit: "Cái",
        quantity: 10,
        price: 1500000,
        total: 15000000,
      },
      {
        id: "3",
        sku: "SP004",
        name: "Tai nghe Sony WH-1000XM4",
        unit: "Cái",
        quantity: 3,
        price: 5200000,
        total: 15600000,
      },
    ],
    totalAmount: 41600000,
    note: "Hàng dễ vỡ, yêu cầu đóng gói kỹ bằng xốp hơi.",
    createdBy: {
      name: "Nguyễn Văn A",
      role: "Nhân viên kho",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
    },
    createdAt: "18/05/2024 10:30",
    approvedBy: null,
    approvedAt: null,
  };

  const STATUS_CONFIG = {
    PENDING: { label: "Chờ duyệt xuất", cls: "bg-warning/10 text-warning" },
    APPROVED: { label: "Đã xuất kho", cls: "bg-success/10 text-success" },
    REJECTED: { label: "Đã từ chối", cls: "bg-danger/10 text-danger" },
  };

  const currentStatus =
    STATUS_CONFIG[mockIssue.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="space-y-6">
      {/* Status Hero Card */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5",
              currentStatus.cls,
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {currentStatus.label}
          </span>
          <div>
            <p className="text-sm font-bold text-text-primary">
              Mã phiếu: {mockIssue.code}
            </p>
            <p className="text-[11px] text-text-secondary">
              Ngày tạo: {mockIssue.createdAt}
            </p>
          </div>
        </div>

        {mockIssue.status === "PENDING" && (
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 bg-success hover:bg-success/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> Duyệt xuất
            </button>
            <button className="flex items-center gap-2 bg-danger hover:bg-danger/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
              <XCircle className="w-4 h-4" /> Từ chối
            </button>
            <div className="w-px h-8 bg-border-ui mx-1" />
            <button
              onClick={() => router.push(`/outbound/${id}/edit`)}
              className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Pencil className="w-4 h-4" /> Sửa
            </button>
            <button className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
              <Trash2 className="w-4 h-4" /> Xóa
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              <h3 className="text-base font-bold text-text-primary">
                Thông tin vận chuyển
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <Building className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                      Đơn vị nhận
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {mockIssue.recipient.name}
                    </p>
                    <p className="text-[12px] text-text-secondary mt-1">
                      {mockIssue.recipient.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                      Lý do xuất
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      {mockIssue.purpose}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                      Ghi chú
                    </p>
                    <p className="text-sm text-text-primary leading-relaxed italic">
                      "{mockIssue.note}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">
                  Danh mục hàng hóa xuất
                </h3>
              </div>
              <span className="text-xs font-bold text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                {mockIssue.items.length} MẶT HÀNG
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-app/50 border-b border-border-ui">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Đơn giá
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {mockIssue.items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-background-app/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary text-right font-medium">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary text-right">
                        {new Intl.NumberFormat("vi-VN").format(item.price)} đ
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                        {new Intl.NumberFormat("vi-VN").format(item.total)} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-background-app/30 font-bold">
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-5 text-sm text-text-primary text-right border-t border-border-ui"
                    >
                      Tổng giá trị phiếu xuất:
                    </td>
                    <td className="px-6 py-5 text-lg text-accent text-right border-t border-border-ui tracking-tight">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(mockIssue.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1 h-3 bg-accent rounded-full" />
              Thông tin hệ thống
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={mockIssue.createdBy.avatar}
                  className="w-12 h-12 rounded-xl border-2 border-border-ui"
                  alt=""
                />
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                    Người lập phiếu
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {mockIssue.createdBy.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {mockIssue.createdBy.role}
                  </p>
                </div>
              </div>

              <hr className="border-border-ui/50" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold">
                      Ngày khởi tạo
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      {mockIssue.createdAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warning/5 rounded-xl border border-warning/10 p-6">
            <h4 className="text-xs font-bold text-warning uppercase tracking-widest mb-3 text-center">
              QUY TRÌNH PHÊ DUYỆT
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[11px] text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" />
                Phiếu sau khi lập sẽ ở trạng thái chờ duyệt.
              </li>
              <li className="flex items-start gap-2 text-[11px] text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" />
                Hệ thống kiểm tra tồn kho tại thời điểm Duyệt.
              </li>
              <li className="flex items-start gap-2 text-[11px] text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" />
                Sau khi duyệt, tồn kho sẽ tự động bị trừ.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
