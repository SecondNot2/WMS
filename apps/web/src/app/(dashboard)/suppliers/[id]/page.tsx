"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { SupplierDetailViewConnected } from "../_components/SupplierDetailViewConnected";

export default function SupplierIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/suppliers"
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chi tiết nhà cung cấp
          </h1>
          <p className="text-xs text-text-secondary">
            Thông tin liên hệ và lịch sử nhập kho
          </p>
        </div>
      </div>

      <div className="pl-9">
        <SupplierDetailViewConnected id={id} />
      </div>
    </div>
  );
}
