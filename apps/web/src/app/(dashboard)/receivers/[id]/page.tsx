"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ReceiverDetailViewConnected } from "../_components/ReceiverDetailViewConnected";

export default function ReceiverIdPage() {
  const params = useParams();
  const id = params.id as string;

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
            Chi tiết đơn vị nhận hàng
          </h1>
          <p className="text-xs text-text-secondary">
            Thông tin liên hệ và lịch sử nhận hàng
          </p>
        </div>
      </div>

      <div className="pl-9">
        <ReceiverDetailViewConnected id={id} />
      </div>
    </div>
  );
}
