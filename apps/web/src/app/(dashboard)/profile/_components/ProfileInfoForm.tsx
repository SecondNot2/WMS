"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UserRound } from "lucide-react";
import { updateProfileSchema, type UpdateProfileInput } from "@wms/validations";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "@/lib/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/client";
import type { AuthUser } from "@wms/types";

interface ProfileInfoFormProps {
  user: AuthUser;
}

export function ProfileInfoForm({ user }: ProfileInfoFormProps) {
  const mutation = useUpdateProfile();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? "",
    },
  });

  const onSubmit = handleSubmit(async (raw) => {
    setServerError(null);
    setSuccess(false);
    try {
      const updated = await mutation.mutateAsync({
        name: raw.name,
        email: raw.email,
        avatar: raw.avatar || null,
      });
      reset({
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar ?? "",
      });
      setSuccess(true);
    } catch (e) {
      setServerError(getApiErrorMessage(e, "Không thể cập nhật thông tin"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
          <UserRound className="w-5 h-5 text-accent" /> Thông tin cá nhân
        </h3>

        {serverError && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
            {serverError}
          </div>
        )}
        {success && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-success/5 border border-success/20 text-xs text-success">
            Đã cập nhật thông tin thành công.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Họ tên <span className="text-danger">*</span>
            </label>
            <input
              {...register("name")}
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                errors.name ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.name && (
              <p className="text-[10px] text-danger font-medium">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Email <span className="text-danger">*</span>
            </label>
            <input
              {...register("email")}
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                errors.email ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.email && (
              <p className="text-[10px] text-danger font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              URL Ảnh đại diện
            </label>
            <input
              {...register("avatar")}
              placeholder="https://..."
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                errors.avatar ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.avatar && (
              <p className="text-[10px] text-danger font-medium">
                {errors.avatar.message}
              </p>
            )}
            <p className="text-[10px] text-text-secondary">
              Để trống để dùng avatar mặc định
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={mutation.isPending || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}
