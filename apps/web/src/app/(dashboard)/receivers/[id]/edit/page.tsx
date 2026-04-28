"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ReceiverFormConnected } from "../../_components/ReceiverFormConnected";

export default function EditReceiverPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/receivers/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa đơn vị nhận hàng
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin điểm nhận hàng
          </p>
        </div>
      </div>

      <div className="pl-9">
        <ReceiverFormConnected receiverId={id} />
      </div>
    </div>
  );
}
