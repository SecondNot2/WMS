"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { InboundForm } from "../../_components/InboundForm";
import { useInbound } from "@/lib/hooks/use-inbound";
import { getApiErrorMessage } from "@/lib/api/client";

export default function EditInboundPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: receipt, isLoading, isError, error } = useInbound(id);

  return (
    <div className="p-3 sm:p-5 w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/inbound/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa phiếu nhập kho
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin nhà cung cấp và danh sách hàng hóa
          </p>
        </div>
      </div>

      <div className="sm:pl-9">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span className="text-sm">Đang tải phiếu nhập...</span>
          </div>
        ) : isError || !receipt ? (
          <div className="flex flex-col items-center justify-center py-20 text-danger">
            <p className="text-sm font-bold mb-1">Không thể tải phiếu nhập</p>
            <p className="text-xs text-text-secondary">
              {getApiErrorMessage(error)}
            </p>
          </div>
        ) : receipt.status !== "PENDING" ? (
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-6 text-center">
            <p className="text-sm font-bold text-warning mb-1">
              Không thể chỉnh sửa
            </p>
            <p className="text-xs text-text-secondary">
              Chỉ có thể sửa phiếu ở trạng thái Chờ duyệt.
            </p>
          </div>
        ) : (
          <InboundForm
            initialData={{
              supplierId: receipt.supplier.id,
              note: receipt.note ?? "",
              items: receipt.items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
              })),
            }}
            isEdit
            inboundId={id}
          />
        )}
      </div>
    </div>
  );
}
