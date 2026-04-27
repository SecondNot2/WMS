"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Mail, Save, Shield, UserRound, Loader2 } from "lucide-react";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserSchemaInput,
  type UpdateUserSchemaInput,
} from "@wms/validations";
import { cn } from "@/lib/utils";
import { useRoles } from "@/lib/hooks/use-roles";
import { useCreateUser, useUpdateUser } from "@/lib/hooks/use-users";
import { getApiErrorMessage } from "@/lib/api/client";
import type { User } from "@wms/types";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
};

interface UserFormProps {
  initialData?: User;
}

type CreateValues = CreateUserSchemaInput;
type UpdateValues = UpdateUserSchemaInput;

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser(initialData?.id ?? "");

  const form = useForm<CreateValues | UpdateValues>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: isEdit
      ? {
          name: initialData?.name ?? "",
          email: initialData?.email ?? "",
          password: "",
          roleId: initialData?.roleId ?? "",
        }
      : {
          name: "",
          email: "",
          password: "",
          roleId: "",
        },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [serverError, setServerError] = React.useState<string | null>(null);

  const onSubmit = handleSubmit(async (raw) => {
    setServerError(null);
    try {
      if (isEdit) {
        const data = raw as UpdateValues;
        // Bỏ password rỗng
        const payload: UpdateValues = {
          ...data,
          password: data.password || undefined,
        };
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(raw as CreateValues);
      }
      router.push("/users");
    } catch (e) {
      setServerError(getApiErrorMessage(e, "Không thể lưu thông tin"));
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20"
    >
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
            <UserRound className="w-5 h-5 text-accent" /> Thông tin tài khoản
          </h3>

          {serverError && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-text-secondary">
                Họ tên <span className="text-danger">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="Nhập họ tên"
                className={cn(
                  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                  errors.name ? "border-danger" : "border-border-ui",
                )}
              />
              {errors.name && (
                <p className="text-[10px] text-danger font-medium">
                  {errors.name.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-text-secondary">
                Email <span className="text-danger">*</span>
              </label>
              <input
                {...register("email")}
                placeholder="user@wms.com"
                className={cn(
                  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                  errors.email ? "border-danger" : "border-border-ui",
                )}
              />
              {errors.email && (
                <p className="text-[10px] text-danger font-medium">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-text-secondary">
                Vai trò <span className="text-danger">*</span>
              </label>
              <select
                {...register("roleId")}
                disabled={rolesLoading}
                className={cn(
                  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors disabled:opacity-50",
                  errors.roleId ? "border-danger" : "border-border-ui",
                )}
              >
                <option value="">-- Chọn vai trò --</option>
                {roles?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {ROLE_LABELS[r.name] ?? r.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-[10px] text-danger font-medium">
                  {errors.roleId.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-text-secondary">
                Mật khẩu {isEdit ? "mới" : <span className="text-danger">*</span>}
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder={
                  isEdit ? "Bỏ trống nếu không đổi" : "Tối thiểu 8 ký tự"
                }
                className={cn(
                  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                  errors.password ? "border-danger" : "border-border-ui",
                )}
              />
              {errors.password && (
                <p className="text-[10px] text-danger font-medium">
                  {errors.password.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Lưu ý bảo mật
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
              <Mail className="w-4 h-4 text-accent mt-0.5" />
              <p className="text-[11px] text-text-secondary">
                <span className="block text-xs font-bold text-text-primary">
                  Email đăng nhập
                </span>
                Email phải duy nhất trong hệ thống.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
              <KeyRound className="w-4 h-4 text-warning mt-0.5" />
              <p className="text-[11px] text-text-secondary">
                <span className="block text-xs font-bold text-text-primary">
                  Mật khẩu
                </span>
                Tối thiểu 8 ký tự. Khi sửa, để trống nếu không đổi.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
              <Shield className="w-4 h-4 text-success mt-0.5" />
              <p className="text-[11px] text-text-secondary">
                <span className="block text-xs font-bold text-text-primary">
                  Phân quyền
                </span>
                Quyền chi tiết được cấu hình trong module Vai trò.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="px-4 py-2 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-colors disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEdit ? "Cập nhật" : "Tạo tài khoản"}
          </button>
        </div>
      </div>
    </form>
  );
}
