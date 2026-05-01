"use client";

import Link from "next/link";
import { Plus, Shield, UserCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatsCard } from "@/components/StatsCard";
import { RoleTable } from "./_components/RoleTable";
import { useRoles } from "@/lib/hooks/use-roles";

const SYSTEM_ROLES = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];

export default function RolesPage() {
  const { data: roles } = useRoles();

  const totalRoles = roles?.length ?? 0;
  const totalAssigned = roles?.reduce((sum, r) => sum + r.userCount, 0) ?? 0;
  const systemRoles =
    roles?.filter((r) => SYSTEM_ROLES.includes(r.name)).length ?? 0;

  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Vai trò & Phân quyền"
        description="Thiết lập quyền hạn truy cập theo từng module nghiệp vụ"
        actions={
          <Link
            href="/roles/new"
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" /> Tạo vai trò
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Tổng vai trò"
          value={String(totalRoles)}
          icon={Shield}
          iconBg="bg-info/10 text-info"
        />
        <StatsCard
          label="Người dùng được gán"
          value={String(totalAssigned)}
          icon={Users}
          iconBg="bg-accent/10 text-accent"
        />
        <StatsCard
          label="Vai trò hệ thống"
          value={String(systemRoles)}
          icon={UserCheck}
          iconBg="bg-success/10 text-success"
        />
      </div>

      <RoleTable />
    </div>
  );
}
