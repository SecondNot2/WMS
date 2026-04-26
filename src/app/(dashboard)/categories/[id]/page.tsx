"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryDetailView } from "@/app/(dashboard)/categories/_components/CategoryDetailView";
import { useParams } from "next/navigation";

export default function CategoryIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/categories"
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chi tiết danh mục
          </h1>
          <p className="text-xs text-text-secondary">
            Thông tin và sản phẩm thuộc danh mục
          </p>
        </div>
      </div>

      <div className="pl-9">
        <CategoryDetailView id={id} />
      </div>
    </div>
  );
}
