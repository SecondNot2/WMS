"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ReceiverForm } from "../_components/ReceiverForm";

export default function NewReceiverPage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/receivers"
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Thêm đơn vị nhận hàng
          </h1>
          <p className="text-xs text-text-secondary">
            Tạo mới điểm nhận cho quy trình xuất kho
          </p>
        </div>
      </div>

      <div className="pl-9">
        <ReceiverForm />
      </div>
    </div>
  );
}
