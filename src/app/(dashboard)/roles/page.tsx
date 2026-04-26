"use client";

import Link from "next/link";
import { Plus, Shield, UserCheck, Users } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { PermissionMatrix } from "./_components/PermissionMatrix";
import { RoleTable } from "./_components/RoleTable";

export default function RolesPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Vai trò & Phân quyền
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Thiết lập quyền hạn truy cập theo từng module nghiệp vụ
          </p>
        </div>
        <Link
          href="/roles/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> Tạo vai trò
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Tổng vai trò"
          value="3"
          icon={Shield}
          iconBg="bg-info/10 text-info"
        />
        <StatsCard
          label="Người dùng được gán"
          value="42"
          icon={Users}
          iconBg="bg-accent/10 text-accent"
        />
        <StatsCard
          label="Vai trò hệ thống"
          value="3"
          icon={UserCheck}
          iconBg="bg-success/10 text-success"
        />
      </div>

      <RoleTable />
      <PermissionMatrix role="ADMIN" />
    </div>
  );
}
