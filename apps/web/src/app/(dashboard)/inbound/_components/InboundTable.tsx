"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
import { Pagination } from "@/components/Pagination";

type ReceiptStatus = "PENDING" | "APPROVED" | "REJECTED";

interface InboundReceipt {
  id: string;
  code: string;
  supplier: string;
  totalAmount: number;
  itemCount: number;
  createdBy: string;
  createdAt: string;
  status: ReceiptStatus;
}

const mockReceipts: InboundReceipt[] = [
  {
    id: "1",
    code: "PNK-2024-0056",
    supplier: "Công ty TNHH An Phát",
    totalAmount: 85600000,
    itemCount: 12,
    createdBy: "Trần Thị B",
    createdAt: "17/05/2024 09:00",
    status: "PENDING",
  },
  {
    id: "2",
    code: "PNK-2024-0055",
    supplier: "Hợp tác xã Công nghệ",
    totalAmount: 42300000,
    itemCount: 8,
    createdBy: "Nguyễn Văn A",
    createdAt: "16/05/2024 14:30",
    status: "APPROVED",
  },
  {
    id: "3",
    code: "PNK-2024-0054",
    supplier: "Tổng kho Logistics",
    totalAmount: 12500000,
    itemCount: 3,
    createdBy: "Lê Văn C",
    createdAt: "15/05/2024 10:15",
    status: "REJECTED",
  },
  {
    id: "4",
    code: "PNK-2024-0053",
    supplier: "Công ty TNHH An Phát",
    totalAmount: 258000000,
    itemCount: 45,
    createdBy: "Trần Thị B",
    createdAt: "14/05/2024 08:45",
    status: "APPROVED",
  },
  {
    id: "5",
    code: "PNK-2024-0052",
    supplier: "Nhà máy ABC",
    totalAmount: 12000000,
    itemCount: 2,
    createdBy: "Nguyễn Văn A",
    createdAt: "13/05/2024 16:20",
    status: "PENDING",
  },
];

const STATUS_STYLES: Record<ReceiptStatus, { label: string; cls: string }> = {
  PENDING: { label: "Chờ duyệt", cls: "bg-warning/10 text-warning" },
  APPROVED: { label: "Đã duyệt", cls: "bg-success/10 text-success" },
  REJECTED: { label: "Từ chối", cls: "bg-danger/10 text-danger" },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

export function InboundTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const receipts = mockReceipts;

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-background-app/50 border-b border-border-ui">
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Mã phiếu
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Nhà cung cấp
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                Số SP
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Người lập
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Ngày lập
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {receipts.length > 0 ? (
              receipts.map((receipt) => {
                const status = STATUS_STYLES[receipt.status];
                return (
                  <tr
                    key={receipt.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/inbound/${receipt.id}`}
                        className="text-[13px] font-semibold text-accent hover:underline"
                      >
                        {receipt.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-primary">
                      {receipt.supplier}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-text-primary text-right">
                      {formatCurrency(receipt.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary text-center">
                      {receipt.itemCount}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">
                      {receipt.createdBy}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-secondary">
                      {receipt.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                          status.cls,
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/inbound/${receipt.id}`}
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {receipt.status === "PENDING" && (
                          <>
                            <Link
                              href={`/inbound/${receipt.id}/edit`}
                              className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-text-secondary" />
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      Chưa có phiếu nhập kho nào
                    </p>
                    <p className="text-xs text-text-secondary mb-6">
                      Thử thay đổi bộ lọc hoặc lập phiếu mới
                    </p>
                    <Link
                      href="/inbound/new"
                      className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Lập phiếu nhập kho
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        pageSize={pageSize}
        totalItems={42}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
