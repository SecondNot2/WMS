"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Save } from "lucide-react";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@wms/validations";
import { cn } from "@/lib/utils";
import { useChangePassword } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";

export function ChangePasswordForm() {
  const mutation = useChangePassword();
  const toast = useToast();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    setSuccess(false);
    try {
      await mutation.mutateAsync(data);
      reset({ currentPassword: "", newPassword: "" });
      setSuccess(true);
      toast.success("Đã đổi mật khẩu thành công");
    } catch (e) {
      const msg = getApiErrorMessage(e, "Không thể đổi mật khẩu");
      setServerError(msg);
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-warning" /> Đổi mật khẩu
        </h3>

        {serverError && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
            {serverError}
          </div>
        )}
        {success && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-success/5 border border-success/20 text-xs text-success">
            Đã đổi mật khẩu thành công.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Mật khẩu hiện tại <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              {...register("currentPassword")}
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                errors.currentPassword ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.currentPassword && (
              <p className="text-[10px] text-danger font-medium">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Mật khẩu mới <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              {...register("newPassword")}
              placeholder="Tối thiểu 8 ký tự"
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                errors.newPassword ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.newPassword && (
              <p className="text-[10px] text-danger font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
}
