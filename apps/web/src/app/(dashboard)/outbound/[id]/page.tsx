"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { OutboundDetailView } from "../_components/OutboundDetailView";

export default function OutboundDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-3 sm:p-5 w-full space-y-4 sm:space-y-6">
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
            Chi tiết phiếu xuất kho
          </h1>
          <p className="text-xs text-text-secondary">
            Theo dõi trạng thái và quản lý phiếu xuất
          </p>
        </div>
      </div>

      <div className="sm:pl-9">
        <OutboundDetailView id={id} />
      </div>
    </div>
  );
}
