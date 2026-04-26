"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "@/app/(dashboard)/categories/_components/CategoryForm";
import { useParams } from "next/navigation";

export default function EditCategoryPage() {
  const params = useParams();
  const id = params.id as string;

  // TODO: Replace with useQuery
  const mockData = {
    name: "Thiết bị ngoại vi",
    code: "CAT001",
    description: "Chuột, bàn phím, tai nghe, webcam...",
    status: "ACTIVE" as const,
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/categories/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa danh mục
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin danh mục hàng hóa
          </p>
        </div>
      </div>

      <div className="pl-9">
        <CategoryForm initialData={mockData} isEdit={true} />
      </div>
    </div>
  );
}
