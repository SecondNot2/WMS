"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { SupplierForm } from "../../_components/SupplierForm";

export default function EditSupplierPage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "Công ty TNHH An Phát",
    contactPerson: "Nguyễn Hoàng Nam",
    phone: "0901 234 567",
    email: "contact@anphat.vn",
    taxCode: "0101234567",
    address: "Số 25, đường Logistics, Long Biên, Hà Nội",
    note: `Đang chỉnh sửa nhà cung cấp ${id}`,
    isActive: true,
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/suppliers/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa nhà cung cấp
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin đối tác cung ứng
          </p>
        </div>
      </div>

      <div className="pl-9">
        <SupplierForm initialData={mockData} isEdit />
      </div>
    </div>
  );
}
