"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RoleForm } from "../_components/RoleForm";

export default function NewRolePage() {
  return (
    <div className="p-5 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/roles"
          className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Tạo vai trò mới
          </h1>
          <p className="text-xs text-text-secondary">
            Thiết lập quyền hạn truy cập theo từng module nghiệp vụ
          </p>
        </div>
      </div>

      <div className="pl-9">
        <RoleForm />
      </div>
    </div>
  );
}
