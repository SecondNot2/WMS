"use client";

import React from "react";
import { DashboardTable } from "@/components/DashboardTable";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

type ReceiptStatus = "PENDING" | "APPROVED" | "REJECTED";

interface InboundReceipt extends Record<string, unknown> {
  id: string;
  code: string;
  supplier: string;
  totalAmount: number;
  itemCount: number;
  createdBy: string;
  createdAt: string;
  status: ReceiptStatus;
}

export function InboundTable() {
  // TODO: Replace with useQuery -> GET /goods-receipts
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

  const columns = [
    {
      header: "Mã phiếu",
      accessor: "code",
      render: (val: unknown, row: InboundReceipt) => (
        <Link
          href={`/inbound/${row.id}`}
          className="text-accent font-bold hover:underline"
        >
          {val as string}
        </Link>
      ),
    },
    {
      header: "Nhà cung cấp",
      accessor: "supplier",
      render: (val: unknown) => (
        <span className="font-medium text-text-primary">{val as string}</span>
      ),
    },
    {
      header: "Tổng tiền",
      accessor: "totalAmount",
      render: (val: unknown) => (
        <span className="font-bold text-text-primary">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(val as number)}
        </span>
      ),
    },
    {
      header: "Số lượng SP",
      accessor: "itemCount",
      render: (val: unknown) => (
        <span className="text-text-secondary">{val as number} hàng hóa</span>
      ),
    },
    {
      header: "Người lập",
      accessor: "createdBy",
    },
    {
      header: "Ngày lập",
      accessor: "createdAt",
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (val: unknown) => {
        const status = val as keyof typeof STATUS_STYLES;
        const style = STATUS_STYLES[status];
        return (
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
              style.cls,
            )}
          >
            {style.label}
          </span>
        );
      },
    },
    {
      header: "",
      accessor: "id",
      render: (val: unknown, row: InboundReceipt) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/inbound/${val as string}`}
            className="p-1.5 hover:bg-background-app rounded text-text-secondary hover:text-accent transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {row.status === "PENDING" && (
            <>
              <Link
                href={`/inbound/${val as string}/edit`}
                className="p-1.5 hover:bg-background-app rounded text-text-secondary hover:text-warning transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button className="p-1.5 hover:bg-background-app rounded text-text-secondary hover:text-danger transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return <DashboardTable title="" columns={columns} data={mockReceipts} />;
}
