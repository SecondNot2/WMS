"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductFormConnected } from "../../_components/ProductFormConnected";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

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
        <ProductFormConnected productId={id} />
      </div>
    </div>
  );
}
