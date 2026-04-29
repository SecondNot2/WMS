"use client";

import React from "react";
import Link from "next/link";
import { Eye, Pencil, Shield, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { useDeleteRole, useRoles } from "@/lib/hooks/use-roles";
import { getApiErrorMessage } from "@/lib/api/client";
import { countPermissions } from "./PermissionMatrix";
import { ROLE_LABELS } from "@/lib/permissions";
import type { RoleEntity } from "@wms/types";

const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: "Toàn quyền hệ thống, duyệt phiếu và quản lý người dùng",
  WAREHOUSE_STAFF: "Quản lý sản phẩm, lập phiếu nhập/xuất và xem tồn kho",
  ACCOUNTANT: "Xem báo cáo, xuất dữ liệu và tra cứu sản phẩm",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN");
};

export function RoleTable() {
  const { data: roles, isLoading, isError, error, refetch } = useRoles();
  const deleteMutation = useDeleteRole();
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = React.useState<RoleEntity | null>(
    null,
  );

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Đã xóa vai trò ${deleteTarget.name}`);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Không thể xóa vai trò"));
    }
  };

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-200">
          <thead className="bg-background-app/50 border-b border-border-ui">
            <tr>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                Người dùng
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                Quyền
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-text-secondary"
                >
                  Đang tải...
                </td>
              </tr>
            )}
            {!isLoading && isError && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm">
                  <p className="text-danger font-medium">
                    {getApiErrorMessage(error, "Không thể tải vai trò")}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 text-accent hover:underline text-xs"
                  >
                    Thử lại
                  </button>
                </td>
              </tr>
            )}
            {!isLoading && !isError && (roles?.length ?? 0) === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-text-secondary"
                >
                  Chưa có vai trò nào
                </td>
              </tr>
            )}
            {roles?.map((role) => {
              const hasUsers = role.userCount > 0;
              const label = ROLE_LABELS[role.name] ?? role.name;
              const description =
                ROLE_DESCRIPTIONS[role.name] ?? "Vai trò tùy chỉnh";
              return (
                <tr
                  key={role.id}
                  className="hover:bg-background-app/30 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <Link
                          href={`/roles/${role.id}`}
                          className="text-sm font-bold text-text-primary hover:text-accent transition-colors"
                        >
                          {label}
                        </Link>
                        <p className="text-[11px] text-text-secondary font-mono">
                          {role.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary max-w-100">
                    <span className="line-clamp-2">{description}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">
                      {role.userCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                      {countPermissions(role.permissions)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {formatDate(role.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/roles/${role.id}`}
                        className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/roles/${role.id}/edit`}
                        className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={hasUsers}
                        onClick={() => setDeleteTarget(role)}
                        className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={
                          hasUsers
                            ? `Đang có ${role.userCount} người dùng — không thể xóa`
                            : "Xóa vai trò"
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        title="Xóa vai trò"
        message={
          deleteTarget && (
            <>
              Hành động này không thể hoàn tác. Bạn có chắc muốn xóa vai trò{" "}
              <strong className="text-text-primary">{deleteTarget.name}</strong>
              ?
            </>
          )
        }
        confirmLabel="Xóa vai trò"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
