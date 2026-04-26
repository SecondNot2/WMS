"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  FileUp,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
  UserRound,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface ReceiverDetailViewProps {
  id: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

export function ReceiverDetailView({ id }: ReceiverDetailViewProps) {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const receiver = {
    id,
    code: "DVN001",
    name: "Chi nhánh Lạng Sơn",
    type: "Chi nhánh",
    contactPerson: "Hoàng Văn Bình",
    phone: "0902 345 678",
    email: "langson@wms.vn",
    address: "Số 12 đường Trần Đăng Ninh, TP. Lạng Sơn",
    issueCount: 35,
    pendingIssues: 2,
    totalValue: 452000000,
  };

  const recentIssues = [
    {
      id: "1",
      code: "PXK-2024-0042",
      createdAt: "18/05/2024 10:30",
      itemCount: 5,
      totalAmount: 45000000,
      status: "PENDING",
    },
    {
      id: "2",
      code: "PXK-2024-0041",
      createdAt: "17/05/2024 15:45",
      itemCount: 15,
      totalAmount: 120000000,
      status: "APPROVED",
    },
    {
      id: "3",
      code: "PXK-2024-0038",
      createdAt: "13/05/2024 11:20",
      itemCount: 6,
      totalAmount: 35000000,
      status: "APPROVED",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <Link
          href={`/receivers/${id}/edit`}
          className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Pencil className="w-4 h-4" /> Chỉnh sửa
        </Link>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning uppercase tracking-wider">
                    {receiver.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-info/10 text-info uppercase tracking-wider">
                    {receiver.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider">
                    Hoạt động
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary">
                  {receiver.name}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 pt-6 border-t border-border-ui">
              <div className="flex items-start gap-3">
                <UserRound className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Người liên hệ
                  </p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {receiver.contactPerson}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Điện thoại
                  </p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {receiver.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-accent mt-1">
                    {receiver.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Địa chỉ
                  </p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {receiver.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border-ui flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">
                  Phiếu xuất gần đây
                </h3>
              </div>
              <Link
                href="/outbound"
                className="text-xs font-bold text-accent hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-app/50 border-b border-border-ui">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Mã phiếu
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Ngày lập
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                      Mặt hàng
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {recentIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="hover:bg-background-app/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/outbound/${issue.id}`}
                          className="text-sm font-bold text-accent hover:underline"
                        >
                          {issue.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {issue.createdAt}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary text-center">
                        {issue.itemCount}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                        {formatCurrency(issue.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            issue.status === "PENDING"
                              ? "px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning"
                              : "px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success"
                          }
                        >
                          {issue.status === "PENDING"
                            ? "Chờ duyệt"
                            : "Đã duyệt"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
              <p className="text-xs text-text-secondary uppercase font-bold">
                Tổng phiếu xuất
              </p>
              <p className="text-2xl font-bold text-text-primary mt-2">
                {receiver.issueCount}
              </p>
            </div>
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
              <p className="text-xs text-text-secondary uppercase font-bold">
                Chờ duyệt
              </p>
              <p className="text-2xl font-bold text-warning mt-2">
                {receiver.pendingIssues}
              </p>
            </div>
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
              <p className="text-xs text-text-secondary uppercase font-bold">
                Tổng giá trị xuất
              </p>
              <p className="text-2xl font-bold text-accent mt-2">
                {formatCurrency(receiver.totalValue)}
              </p>
            </div>
          </div>

          <Link
            href="/outbound/new"
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-lg shadow-accent/20 transition-colors"
          >
            <FileUp className="w-4 h-4" /> Lập phiếu xuất cho đơn vị này
          </Link>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => console.log("Delete receiver", id)}
        title="Xóa đơn vị nhận"
        message="Bạn có chắc chắn muốn xóa đơn vị nhận hàng này? Nếu đã phát sinh phiếu xuất, hệ thống nên chuyển sang trạng thái tạm dừng thay vì xóa hẳn."
        confirmLabel="Xóa đơn vị"
        variant="danger"
      />
    </div>
  );
}
