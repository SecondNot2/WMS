"use client";

import React from "react";
import Link from "next/link";
import { Pencil, Shield, Users } from "lucide-react";
import { PermissionMatrix } from "./PermissionMatrix";

interface RoleDetailViewProps {
  id: string;
}

export function RoleDetailView({ id }: RoleDetailViewProps) {
  const role = {
    id,
    name: "ADMIN" as const,
    label: "Quản trị viên",
    description: "Toàn quyền hệ thống, duyệt phiếu và quản lý người dùng",
    userCount: 3,
    permissionCount: 18,
    createdAt: "10/01/2024",
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
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
          <h2 className="text-xl font-bold text-text-primary">{role.label}</h2>
          <p className="text-xs text-text-secondary font-mono mt-1">
            {role.name}
          </p>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            {role.description}
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
            {role.permissionCount}
          </p>
        </div>
      </div>

      <PermissionMatrix role={role.name} />
    </div>
  );
}
