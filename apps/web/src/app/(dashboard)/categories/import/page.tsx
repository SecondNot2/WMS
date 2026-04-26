"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImportWizard } from "@/components/ImportWizard";

export default function CategoryImportPage() {
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
            Nhập danh mục từ Excel
          </h1>
          <p className="text-xs text-text-secondary">
            Thêm hàng loạt danh mục sản phẩm bằng tệp Excel
          </p>
        </div>
      </div>

      <div>
        <ImportWizard 
          moduleName="Danh mục" 
          onComplete={() => window.location.href = "/categories"}
        />
      </div>
    </div>
  );
}
