"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { UserForm } from "../../_components/UserForm";
import { useUser } from "@/lib/hooks/use-users";
import { getApiErrorMessage } from "@/lib/api/client";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: user, isLoading, isError, error } = useUser(id);

  return (
    <div className="p-5 w-full space-y-6">
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
        {isLoading && (
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-text-secondary">
            Đang tải...
          </div>
        )}
        {isError && (
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-danger">
            {getApiErrorMessage(error, "Không thể tải người dùng")}
          </div>
        )}
        {user && <UserForm initialData={user} />}
      </div>
    </div>
  );
}
