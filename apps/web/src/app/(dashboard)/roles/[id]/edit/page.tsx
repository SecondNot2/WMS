"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { RoleForm } from "../../_components/RoleForm";
import { useRole } from "@/lib/hooks/use-roles";
import { getApiErrorMessage } from "@/lib/api/client";

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: role, isLoading, isError, error } = useRole(id);

  return (
    <div className="p-5 w-full space-y-6">
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
        {isLoading && (
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-text-secondary">
            Đang tải...
          </div>
        )}
        {isError && (
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-danger">
            {getApiErrorMessage(error, "Không thể tải vai trò")}
          </div>
        )}
        {role && <RoleForm initialData={role} />}
      </div>
    </div>
  );
}
