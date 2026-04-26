"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { UserForm } from "../../_components/UserForm";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "Nguyễn Văn A",
    email: "admin@wms.com",
    role: "ADMIN" as const,
    password: "",
    isActive: true,
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/users/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa người dùng
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật thông tin tài khoản và phân quyền
          </p>
        </div>
      </div>

      <div className="pl-9">
        <UserForm
          initialData={{ ...mockData, name: `${mockData.name} #${id}` }}
          isEdit
        />
      </div>
    </div>
  );
}
