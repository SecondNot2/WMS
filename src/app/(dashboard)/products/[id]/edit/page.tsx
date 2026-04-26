"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
      <div className="flex items-center gap-3">
        <Link 
          href={`/products/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin cho sản phẩm #{id}
          </p>
        </div>
      </div>

      <div className="pl-9">
        <ProductForm initialData={mockInitialData} isEdit={true} />
      </div>
    </div>
  );
}
