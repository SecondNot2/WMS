"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { RoleForm } from "../../_components/RoleForm";

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "ADMIN",
    label: "Quản trị viên",
    description: `Toàn quyền hệ thống, duyệt phiếu và quản lý người dùng. Role ID: ${id}`,
  };

  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/roles/${id}`}
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Chỉnh sửa vai trò
          </h1>
          <p className="text-xs text-text-secondary">
            Cập nhật quyền hạn theo module nghiệp vụ
          </p>
        </div>
      </div>

      <div className="pl-9">
        <RoleForm initialData={mockData} isEdit />
      </div>
    </div>
  );
}
