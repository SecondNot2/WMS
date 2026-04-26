"use client";

import React from "react";
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
      { productId: "p1", sku: "SP001", name: "Chuột không dây Logitech M331", unit: "Cái", quantity: 20, unitPrice: 550000 },
      { productId: "p2", sku: "SP002", name: "Bàn phím cơ Keychron K2", unit: "Cái", quantity: 10, unitPrice: 1500000 },
    ],
  };

  return (
    <div className="p-6 w-full">
      <OutboundForm initialData={mockData} isEdit={true} />
    </div>
  );
}
