"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { OutboundForm } from "../../_components/OutboundForm";

export default function EditOutboundPage() {
  const params = useParams();
  const id = params.id as string;

  // TODO: Replace with useQuery -> GET /goods-issues/:id
  const mockData = {
    recipientId: "1",
    purpose: "Xuất hàng định kỳ tháng 5",
    note: "Hàng dễ vỡ, yêu cầu đóng gói kỹ bằng xốp hơi.",
    items: [
      {
        productId: "p1",
        sku: "SP001",
        name: "Chuột không dây Logitech M331",
        unit: "Cái",
        quantity: 20,
        unitPrice: 550000,
      },
      {
        productId: "p2",
        sku: "SP002",
        name: "Bàn phím cơ Keychron K2",
        unit: "Cái",
        quantity: 10,
        unitPrice: 1500000,
      },
    ],
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/outbound/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa phiếu xuất kho
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin đơn vị nhận và danh sách hàng hóa
          </p>
        </div>
      </div>

      <div className="pl-9">
        <OutboundForm initialData={mockData} isEdit={true} />
      </div>
    </div>
  );
}
