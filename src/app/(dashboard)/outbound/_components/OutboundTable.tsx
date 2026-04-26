"use client";

import React from "react";
import { DashboardTable } from "@/components/DashboardTable";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function OutboundTable() {
  // TODO: Replace with useQuery -> GET /goods-issues
  const mockIssues = [
    {
      id: "1",
      code: "PXK-2024-0042",
      recipient: "Chi nhánh Lạng Sơn",
      purpose: "Xuất hàng định kỳ tháng 5",
      totalAmount: 45000000,
      itemCount: 5,
      createdBy: "Nguyễn Văn A",
      createdAt: "18/05/2024 10:30",
      status: "PENDING",
    },
    {
      id: "2",
      code: "PXK-2024-0041",
      recipient: "Kho trung chuyển Hà Nội",
      purpose: "Điều chuyển hàng hóa nội bộ",
      totalAmount: 120000000,
      itemCount: 15,
      createdBy: "Trần Thị B",
      createdAt: "17/05/2024 15:45",
      status: "APPROVED",
    },
    {
      id: "3",
      code: "PXK-2024-0040",
      recipient: "Cửa hàng Outlet",
      purpose: "Xuất hàng khuyến mãi",
      totalAmount: 8500000,
      itemCount: 2,
      createdBy: "Lê Văn C",
      createdAt: "16/05/2024 09:15",
      status: "REJECTED",
    },
  ];

  const STATUS_STYLES = {
    PENDING: { label: "Chờ duyệt", cls: "bg-warning/10 text-warning" },
    APPROVED: { label: "Đã duyệt", cls: "bg-success/10 text-success" },
    REJECTED: { label: "Từ chối", cls: "bg-danger/10 text-danger" },
  };

  const columns = [
    {
      header: "Mã phiếu",
      accessor: "code",
      render: (val: unknown, row: any) => (
        <Link 
          href={`/outbound/${row.id}`}
          className="text-accent font-bold hover:underline"
        >
          {val as string}
        </Link>
      ),
    },
    {
      header: "Đơn vị nhận",
      accessor: "recipient",
      render: (val: unknown) => <span className="font-medium text-text-primary">{val as string}</span>
    },
    {
      header: "Lý do xuất",
      accessor: "purpose",
      render: (val: unknown) => <span className="text-text-secondary line-clamp-1 max-w-50">{val as string}</span>
    },
    {
      header: "Tổng tiền",
      accessor: "totalAmount",
      render: (val: unknown) => (
        <span className="font-bold text-text-primary">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val as number)}
        </span>
      ),
    },
    {
      header: "Số lượng SP",
      accessor: "itemCount",
      render: (val: unknown) => <span className="text-text-secondary">{val as number} mặt hàng</span>
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
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
            style.cls
          )}>
            {style.label}
          </span>
        );
      },
    },
    {
      header: "",
      accessor: "id",
      render: (val: unknown, row: any) => (
        <div className="flex justify-end gap-2">
          <Link 
            href={`/outbound/${val as string}`}
            className="p-1.5 hover:bg-background-app rounded text-text-secondary hover:text-accent transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {row.status === "PENDING" && (
            <>
              <Link 
                href={`/outbound/${val as string}/edit`}
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

  return (
    <DashboardTable 
      title=""
      columns={columns}
      data={mockIssues}
    />
  );
}
