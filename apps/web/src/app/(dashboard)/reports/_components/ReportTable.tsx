"use client";

import React from "react";
import { DashboardTable } from "@/components/DashboardTable";

interface ReportTableProps {
  type: "receipt-issue" | "inventory";
}

export function ReportTable({ type }: ReportTableProps) {
  // TODO: Replace with useQuery -> GET /reports/...
  const receiptIssueData = [
    {
      id: "1",
      date: "18/05/2024",
      type: "NHẬP",
      code: "PNK-2024-0056",
      item: "Tai nghe Sony WH-1000XM4",
      qty: 20,
      value: 90000000,
    },
    {
      id: "2",
      date: "17/05/2024",
      type: "XUẤT",
      code: "PXK-2024-0042",
      item: "Chuột Logitech M331",
      qty: 50,
      value: 27500000,
    },
  ];

  const inventoryData = [
    {
      id: "1",
      sku: "SP001",
      name: "Tai nghe Sony WH-1000XM4",
      category: "Điện tử",
      stock: 3,
      unit: "Cái",
      avgPrice: 4500000,
      totalValue: 13500000,
    },
    {
      id: "2",
      sku: "SP002",
      name: "Chuột Logitech M331",
      category: "Phụ kiện",
      stock: 156,
      unit: "Cái",
      avgPrice: 350000,
      totalValue: 54600000,
    },
  ];

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

  if (type === "receipt-issue") {
    return (
      <DashboardTable
        title=""
        columns={receiptIssueColumns}
        data={receiptIssueData}
      />
    );
  }

  return (
    <DashboardTable title="" columns={inventoryColumns} data={inventoryData} />
  );
}
