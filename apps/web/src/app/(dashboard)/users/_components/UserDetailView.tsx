"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Lock,
  Mail,
  Pencil,
  Shield,
  Trash2,
  Unlock,
  UserRound,
} from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useDeleteUser,
  useToggleUserActive,
  useUser,
} from "@/lib/hooks/use-users";
import { useAuthStore } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/permissions";

interface UserDetailViewProps {
  id: string;
}

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN");
};

export function UserDetailView({ id }: UserDetailViewProps) {
  const router = useRouter();
  const meId = useAuthStore((s) => s.user?.id);
  const { data: user, isLoading, isError, error } = useUser(id);
  const toggleMutation = useToggleUserActive();
  const deleteMutation = useDeleteUser();
  const toast = useToast();

  const [isToggleOpen, setIsToggleOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-text-secondary">
        Đang tải...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center">
        <p className="text-danger font-medium text-sm">
          {getApiErrorMessage(error, "Không thể tải người dùng")}
        </p>
      </div>
    );
  }

  const isMe = user.id === meId;
  const avatar =
    user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  const roleLabel = ROLE_LABELS[user.role.name] ?? user.role.name;

  const onConfirmToggle = async () => {
    const willActivate = !user.isActive;
    try {
      await toggleMutation.mutateAsync({ id, isActive: willActivate });
      toast.success(
        willActivate ? `Đã mở khóa ${user.name}` : `Đã khóa ${user.name}`,
      );
      setIsToggleOpen(false);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Không thể cập nhật trạng thái"));
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Đã xóa ${user.name}`);
      router.push("/users");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Không thể xóa người dùng"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <Link
          href={`/users/${id}/edit`}
          className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Pencil className="w-4 h-4" /> Chỉnh sửa
        </Link>
        <button
          type="button"
          disabled={isMe}
          onClick={() => setIsToggleOpen(true)}
          className="flex items-center gap-2 bg-card-white border border-warning/20 text-warning hover:bg-warning/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {user.isActive ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
          {user.isActive ? "Khóa tài khoản" : "Mở khóa"}
        </button>
        <button
          type="button"
          disabled={isMe}
          onClick={() => setIsDeleteOpen(true)}
          className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 text-center">
            <img
              src={avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border border-border-ui bg-background-app mx-auto"
            />
            <h2 className="text-xl font-bold text-text-primary mt-4">
              {user.name}
            </h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-info/10 text-info">
                {roleLabel}
              </span>
              <span
                className={
                  user.isActive
                    ? "px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success"
                    : "px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/10 text-danger"
                }
              >
                {user.isActive ? "Đang hoạt động" : "Đã khóa"}
              </span>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Email
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-info" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Vai trò
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {roleLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserRound className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Ngày tạo
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatDateTime(user.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Cập nhật gần nhất
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatDateTime(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border-ui">
            <h3 className="text-base font-bold text-text-primary">
              Hoạt động gần đây
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Chưa có dữ liệu (Activity Log module sẽ build sau)
            </p>
          </div>
          <div className="p-10 text-center text-sm text-text-secondary">
            Chưa có hoạt động nào.
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={isToggleOpen}
        onClose={() => !toggleMutation.isPending && setIsToggleOpen(false)}
        onConfirm={onConfirmToggle}
        title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={
          user.isActive
            ? "Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa."
            : "Người dùng sẽ có thể đăng nhập và thao tác theo quyền được gán."
        }
        confirmLabel={user.isActive ? "Khóa tài khoản" : "Mở khóa"}
        variant={user.isActive ? "danger" : "info"}
        loading={toggleMutation.isPending}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onClose={() => !deleteMutation.isPending && setIsDeleteOpen(false)}
        onConfirm={onConfirmDelete}
        title="Xóa người dùng"
        message={
          <>
            Hành động này không thể hoàn tác. Bạn có chắc muốn xóa{" "}
            <strong className="text-text-primary">{user.name}</strong>?
          </>
        }
        confirmLabel="Xóa"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
