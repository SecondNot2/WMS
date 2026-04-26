"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InboundForm } from "../_components/InboundForm";

export default function NewInboundPage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/inbound"
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Lập phiếu nhập kho
          </h1>
          <p className="text-xs text-text-secondary">
            Điền thông tin nhà cung cấp và danh sách hàng hóa nhập kho
          </p>
        </div>
      </div>

      <div className="pl-9">
        <InboundForm />
      </div>
    </div>
  );
}
