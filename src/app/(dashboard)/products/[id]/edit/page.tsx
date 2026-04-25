"use client";

import React from "react";
import { ProductForm } from "../../_components/ProductForm";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  // TODO: swap with useQuery → GET /products/[id]
  const mockInitialData = {
    name: "Chuột không dây Logitech M331",
    sku: "SP000456",
    barcode: "6954176845123",
    category: "peripheral",
    brand: "Logitech",
    model: "M331",
    unit: "unit",
    costPrice: 250000,
    salePrice: 350000,
    minStock: 20,
    status: "in_stock" as const,
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-text-primary">Chỉnh sửa sản phẩm</h1>
        <p className="text-xs text-text-secondary">Cập nhật thông tin cho sản phẩm #{id}</p>
      </div>

      <ProductForm initialData={mockInitialData} isEdit={true} />
    </div>
  );
}
