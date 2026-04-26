"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { InboundForm } from "../../_components/InboundForm";

export default function EditInboundPage() {
  const params = useParams();
  const id = params.id as string;

  // TODO: Replace with useQuery -> GET /goods-receipts/:id
  const mockData = {
    supplierId: "1",
    note: "Nhập hàng linh kiện máy tính tháng 5/2024",
    items: [
      {
        productId: "p1",
        sku: "SP001",
        name: "Chuột không dây Logitech M331",
        unit: "Cái",
        quantity: 100,
        unitPrice: 450000,
      },
      {
        productId: "p2",
        sku: "SP002",
        name: "Bàn phím cơ Keychron K2",
        unit: "Cái",
        quantity: 50,
        unitPrice: 1200000,
      },
    ],
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/inbound/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa phiếu nhập kho
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin nhà cung cấp và danh sách hàng hóa
          </p>
        </div>
      </div>

      <div className="pl-9">
        <InboundForm initialData={mockData} isEdit={true} />
      </div>
    </div>
  );
}
