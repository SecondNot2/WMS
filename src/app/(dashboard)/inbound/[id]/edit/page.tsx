"use client";

import React from "react";
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
      { productId: "p1", sku: "SP001", name: "Chuột không dây Logitech M331", unit: "Cái", quantity: 100, unitPrice: 450000 },
      { productId: "p2", sku: "SP002", name: "Bàn phím cơ Keychron K2", unit: "Cái", quantity: 50, unitPrice: 1200000 },
    ],
  };

  return (
    <div className="p-6 w-full">
      <InboundForm initialData={mockData} isEdit={true} />
    </div>
  );
}
