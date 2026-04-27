"use client";

import React from "react";
import Link from "next/link";
import { Plus, Shield, UserCheck, UserX, Users } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { UserFilters, type UserFilterValues } from "./_components/UserFilters";
import { UserTable } from "./_components/UserTable";
import { useUsers } from "@/lib/hooks/use-users";
import { useRoles } from "@/lib/hooks/use-roles";

export default function UsersPage() {
  const [filters, setFilters] = React.useState<UserFilterValues>({
    search: "",
    roleId: "",
    isActive: "",
  });

  const { data: roles } = useRoles();

  // Stats: tải tổng + active count độc lập (limit nhỏ để chỉ lấy meta)
  const { data: totalData } = useUsers({ limit: 1 });
  const { data: activeData } = useUsers({ limit: 1, isActive: true });
  const { data: lockedData } = useUsers({ limit: 1, isActive: false });

  const totalUsers = totalData?.meta.total ?? 0;
  const activeUsers = activeData?.meta.total ?? 0;
  const lockedUsers = lockedData?.meta.total ?? 0;
  const totalRoles = roles?.length ?? 0;

  const isActiveFilter =
    filters.isActive === "" ? undefined : filters.isActive === "true";

  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Người dùng</h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý tài khoản, vai trò và trạng thái nhân viên
          </p>
        </div>
        <Link
          href="/users/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> Thêm người dùng
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Tổng người dùng"
          value={String(totalUsers)}
          icon={Users}
          iconBg="bg-accent/10 text-accent"
        />
        <StatsCard
          label="Đang hoạt động"
          value={String(activeUsers)}
          icon={UserCheck}
          iconBg="bg-success/10 text-success"
        />
        <StatsCard
          label="Đã khóa"
          value={String(lockedUsers)}
          icon={UserX}
          iconBg="bg-danger/10 text-danger"
        />
        <StatsCard
          label="Vai trò"
          value={String(totalRoles)}
          icon={Shield}
          iconBg="bg-info/10 text-info"
        />
      </div>

      <div className="space-y-5">
        <UserFilters
          value={filters}
          onChange={setFilters}
          roles={roles ?? []}
        />
        <UserTable
          search={filters.search || undefined}
          roleId={filters.roleId || undefined}
          isActive={isActiveFilter}
        />
      </div>
    </div>
  );
}
