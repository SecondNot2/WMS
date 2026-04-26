"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { OutboundForm } from "../_components/OutboundForm";

export default function NewOutboundPage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/outbound"
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Lập phiếu xuất kho
          </h1>
          <p className="text-xs text-text-secondary">
            Điền thông tin đơn vị nhận và danh sách hàng hóa xuất kho
          </p>
        </div>
      </div>

      <div className="pl-9">
        <OutboundForm />
      </div>
    </div>
  );
}
