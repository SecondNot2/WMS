"use client";

import React from "react";
import Link from "next/link";
import { Pencil, Shield, Users } from "lucide-react";
import { PermissionMatrix, countPermissions } from "./PermissionMatrix";
import { useRole } from "@/lib/hooks/use-roles";
import { getApiErrorMessage } from "@/lib/api/client";
import { ROLE_LABELS } from "@/lib/permissions";

interface RoleDetailViewProps {
  id: string;
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: "Toàn quyền hệ thống, duyệt phiếu và quản lý người dùng",
  WAREHOUSE_STAFF: "Quản lý sản phẩm, lập phiếu nhập/xuất và xem tồn kho",
  ACCOUNTANT: "Xem báo cáo, xuất dữ liệu và tra cứu sản phẩm",
};

export function RoleDetailView({ id }: RoleDetailViewProps) {
  const { data: role, isLoading, isError, error } = useRole(id);

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-text-secondary">
        Đang tải...
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-danger">
        {getApiErrorMessage(error, "Không thể tải vai trò")}
      </div>
    );
  }

  const label = ROLE_LABELS[role.name] ?? role.name;
  const description = ROLE_DESCRIPTIONS[role.name] ?? "Vai trò tùy chỉnh";

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <Link
          href={`/roles/${id}/edit`}
          className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Pencil className="w-4 h-4" /> Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
          <div className="w-14 h-14 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">{label}</h2>
          <p className="text-xs text-text-secondary font-mono mt-1">
            {role.name}
          </p>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
          <Users className="w-7 h-7 text-accent mb-4" />
          <p className="text-xs text-text-secondary uppercase font-bold">
            Người dùng đang gán
          </p>
          <p className="text-3xl font-bold text-text-primary mt-2">
            {role.userCount}
          </p>
        </div>
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
          <Shield className="w-7 h-7 text-success mb-4" />
          <p className="text-xs text-text-secondary uppercase font-bold">
            Tổng quyền bật
          </p>
          <p className="text-3xl font-bold text-text-primary mt-2">
            {countPermissions(role.permissions)}
          </p>
        </div>
      </div>

      <PermissionMatrix permissions={role.permissions} />

      {role.users.length > 0 && (
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-ui">
            <h3 className="text-sm font-semibold text-text-primary">
              Người dùng đang gán ({role.users.length})
            </h3>
          </div>
          <ul className="divide-y divide-border-ui">
            {role.users.map((u) => (
              <li
                key={u.id}
                className="px-5 py-3 flex items-center gap-3 hover:bg-background-app/30 transition-colors"
              >
                <img
                  src={
                    u.avatar ??
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`
                  }
                  alt={u.name}
                  className="w-9 h-9 rounded-full border border-border-ui bg-background-app"
                />
                <div className="flex-1">
                  <Link
                    href={`/users/${u.id}`}
                    className="text-sm font-semibold text-text-primary hover:text-accent transition-colors"
                  >
                    {u.name}
                  </Link>
                  <p className="text-[11px] text-text-secondary">{u.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
