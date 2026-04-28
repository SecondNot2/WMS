"use client";

import React from "react";
import { DashboardTable } from "@/components/DashboardTable";
import {
  useInventoryReport,
  useReceiptIssueReport,
} from "@/lib/hooks/use-reports";

interface ReportTableProps {
  type: "receipt-issue" | "inventory";
}

export function ReportTable({ type }: ReportTableProps) {
  const receiptIssueQuery = useReceiptIssueReport({ page: 1, limit: 20 });
  const inventoryQuery = useInventoryReport({ page: 1, limit: 20 });

  const receiptIssueColumns = [
    { header: "Ngày", accessor: "date" },
    {
      header: "Loại",
      accessor: "type",
      render: (val: unknown) => (
        <span
          className={
            val === "NHẬP" ? "text-success font-bold" : "text-danger font-bold"
          }
        >
          {val as string}
        </span>
      ),
    },
    { header: "Mã phiếu", accessor: "code" },
    { header: "Sản phẩm", accessor: "item" },
    { header: "Số lượng", accessor: "qty" },
    {
      header: "Giá trị",
      accessor: "value",
      render: (val: unknown) => (
        <span className="font-bold text-text-primary">
          {new Intl.NumberFormat("vi-VN").format(val as number)} đ
        </span>
      ),
    },
  ];

  const inventoryColumns = [
    { header: "SKU", accessor: "sku" },
    { header: "Tên sản phẩm", accessor: "name" },
    { header: "Danh mục", accessor: "category" },
    { header: "Tồn cuối", accessor: "stock" },
    {
      header: "Giá nhập TB",
      accessor: "avgPrice",
      render: (val: unknown) => (
        <span>{new Intl.NumberFormat("vi-VN").format(val as number)} đ</span>
      ),
    },
    {
      header: "Tổng giá trị",
      accessor: "totalValue",
      render: (val: unknown) => (
        <span className="font-bold text-accent">
          {new Intl.NumberFormat("vi-VN").format(val as number)} đ
        </span>
      ),
    },
  ];

  const activeQuery =
    type === "receipt-issue" ? receiptIssueQuery : inventoryQuery;

  if (activeQuery.isLoading) {
    return <div className="h-56 bg-background-app animate-pulse rounded-xl" />;
  }

  if (activeQuery.error) {
    return (
      <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl p-4">
        Không thể tải dữ liệu báo cáo
      </div>
    );
  }

  if (type === "receipt-issue") {
    return (
      <DashboardTable
        title=""
        columns={receiptIssueColumns}
        data={(receiptIssueQuery.data?.items ?? []).map((item) => ({
          ...item,
        }))}
      />
    );
  }

  return (
    <DashboardTable
      title=""
      columns={inventoryColumns}
      data={(inventoryQuery.data?.items ?? []).map((item) => ({ ...item }))}
    />
  );
}
