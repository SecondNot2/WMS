"use client";

import React from "react";
import Link from "next/link";
import { Eye, Lock, Pencil, Trash2, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useDeleteUser,
  useToggleUserActive,
  useUsers,
} from "@/lib/hooks/use-users";
import { useAuthStore } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/permissions";
import type { User } from "@wms/types";

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-info/10 text-info",
  WAREHOUSE_STAFF: "bg-accent/10 text-accent",
  ACCOUNTANT: "bg-success/10 text-success",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN");
};

const avatarUrl = (u: User) =>
  u.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;

interface UserTableProps {
  search?: string;
  roleId?: string;
  isActive?: boolean;
}

export function UserTable({ search, roleId, isActive }: UserTableProps) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [toggleTarget, setToggleTarget] = React.useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null);

  const meId = useAuthStore((s) => s.user?.id);

  const params = React.useMemo(
    () => ({ page, limit, search, roleId, isActive }),
    [page, limit, search, roleId, isActive],
  );

  React.useEffect(() => {
    setPage(1);
  }, [search, roleId, isActive, limit]);

  const { data, isLoading, isError, error, refetch } = useUsers(params);
  const toggleMutation = useToggleUserActive();
  const deleteMutation = useDeleteUser();
  const toast = useToast();

  const users = data?.data ?? [];
  const meta = data?.meta;

  const onConfirmToggle = async () => {
    if (!toggleTarget) return;
    const willActivate = !toggleTarget.isActive;
    try {
      await toggleMutation.mutateAsync({
        id: toggleTarget.id,
        isActive: willActivate,
      });
      toast.success(
        willActivate
          ? `Đã mở khóa ${toggleTarget.name}`
          : `Đã khóa ${toggleTarget.name}`,
      );
      setToggleTarget(null);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Không thể cập nhật trạng thái"));
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Đã xóa ${deleteTarget.name}`);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Không thể xóa người dùng"));
    }
  };

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-220">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-text-secondary"
                  >
                    Đang tải...
                  </td>
                </tr>
              )}
              {!isLoading && isError && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm">
                    <p className="text-danger font-medium">
                      {getApiErrorMessage(error, "Không thể tải người dùng")}
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
              {!isLoading && !isError && users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-text-secondary"
                  >
                    Không có người dùng nào
                  </td>
                </tr>
              )}
              {users.map((user) => {
                const isMe = user.id === meId;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarUrl(user)}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border border-border-ui bg-background-app"
                        />
                        <div>
                          <Link
                            href={`/users/${user.id}`}
                            className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors"
                          >
                            {user.name}
                            {isMe && (
                              <span className="ml-2 text-[10px] text-accent font-bold">
                                (Bạn)
                              </span>
                            )}
                          </Link>
                          <p className="text-[11px] text-text-secondary">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                          ROLE_STYLES[user.role.name] ??
                            "bg-background-app text-text-secondary",
                        )}
                      >
                        {ROLE_LABELS[user.role.name] ?? user.role.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                          user.isActive
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/users/${user.id}`}
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/users/${user.id}/edit`}
                          className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          disabled={isMe}
                          onClick={() => setToggleTarget(user)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                            user.isActive
                              ? "hover:bg-danger/10 text-danger"
                              : "hover:bg-success/10 text-success",
                          )}
                          title={
                            isMe
                              ? "Không thể tự khóa tài khoản"
                              : user.isActive
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                          }
                        >
                          {user.isActive ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          disabled={isMe}
                          onClick={() => setDeleteTarget(user)}
                          className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isMe ? "Không thể xóa chính mình" : "Xóa"}
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

        {meta && meta.total > 0 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            pageSize={meta.limit}
            totalItems={meta.total}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
          />
        )}
      </div>

      <ConfirmDialog
        open={toggleTarget !== null}
        onClose={() => !toggleMutation.isPending && setToggleTarget(null)}
        onConfirm={onConfirmToggle}
        title={toggleTarget?.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={
          toggleTarget?.isActive
            ? "Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa."
            : "Người dùng sẽ có thể đăng nhập và thao tác theo quyền được gán."
        }
        confirmLabel={toggleTarget?.isActive ? "Khóa tài khoản" : "Mở khóa"}
        variant={toggleTarget?.isActive ? "danger" : "info"}
        loading={toggleMutation.isPending}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
        title="Xóa người dùng"
        message={
          deleteTarget && (
            <>
              Hành động này không thể hoàn tác. Bạn có chắc muốn xóa{" "}
              <strong className="text-text-primary">{deleteTarget.name}</strong>
              ?
            </>
          )
        }
        confirmLabel="Xóa"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
