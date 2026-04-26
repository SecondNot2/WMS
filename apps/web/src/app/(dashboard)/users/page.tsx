"use client";

import Link from "next/link";
import { Plus, Shield, UserCheck, UserX, Users } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { UserFilters } from "./_components/UserFilters";
import { UserTable } from "./_components/UserTable";

export default function UsersPage() {
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
          value="42"
          icon={Users}
          iconBg="bg-accent/10 text-accent"
        />
        <StatsCard
          label="Đang hoạt động"
          value="38"
          icon={UserCheck}
          iconBg="bg-success/10 text-success"
        />
        <StatsCard
          label="Đã khóa"
          value="4"
          icon={UserX}
          iconBg="bg-danger/10 text-danger"
        />
        <StatsCard
          label="Vai trò"
          value="3"
          icon={Shield}
          iconBg="bg-info/10 text-info"
        />
      </div>

      <div className="space-y-5">
        <UserFilters />
        <UserTable />
      </div>
    </div>
  );
}
