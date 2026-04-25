"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-text-primary">Thêm sản phẩm mới</h1>
        <p className="text-xs text-text-secondary">Tạo mới sản phẩm vào hệ thống kho</p>
      </div>

      <ProductForm />
    </div>
  );
}
