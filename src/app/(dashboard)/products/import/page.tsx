"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImportWizard } from "@/components/ImportWizard";

export default function ProductImportPage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-text-primary">
          Nhập sản phẩm từ Excel
        </h1>
        <p className="text-xs text-text-secondary">
          Thêm hàng loạt sản phẩm vào kho bằng tệp Excel
        </p>
      </div>

      <div>
        <ImportWizard moduleName="Sản phẩm" />
      </div>
    </div>
  );
}
