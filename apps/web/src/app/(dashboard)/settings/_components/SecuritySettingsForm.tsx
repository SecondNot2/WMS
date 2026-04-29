"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Save, ShieldCheck } from "lucide-react";
import type { z } from "zod";
import { securitySettingsSchema } from "@wms/validations";
import type { SecuritySettings, SystemSettingMeta } from "@wms/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { useUpdateSecuritySettings } from "@/lib/hooks/use-settings";
import { SettingsMeta } from "./SettingsMeta";
import { useUnsavedGuard } from "./useUnsavedGuard";

type SecurityInput = z.input<typeof securitySettingsSchema>;
type SecurityOutput = z.output<typeof securitySettingsSchema>;

const inputClassName =
  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors";
const labelClassName = "text-xs text-text-secondary font-semibold";

interface Props {
  defaults: SecuritySettings;
  meta: SystemSettingMeta;
  canEdit: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export function SecuritySettingsForm({
  defaults,
  meta,
  canEdit,
  onDirtyChange,
}: Props) {
  const toast = useToast();
  const mutation = useUpdateSecuritySettings();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SecurityInput, unknown, SecurityOutput>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: defaults,
  });

  React.useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useUnsavedGuard(isDirty);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await mutation.mutateAsync(values);
      reset(result.value);
      toast.success("Đã lưu cấu hình bảo mật");
    } catch (e) {
      const msg = getApiErrorMessage(e, "Không thể lưu cấu hình");
      setServerError(msg);
      toast.error(msg);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 md:p-8 space-y-7"
    >
      <div className="space-y-2">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-success" /> Bảo mật truy cập
        </h2>
        <p className="text-xs text-text-secondary">
          Các thiết lập này áp dụng cho phiên đăng nhập và chính sách mật khẩu.
          Thay đổi sẽ áp dụng cho các phiên đăng nhập mới.
        </p>
        <SettingsMeta meta={meta} />
      </div>

      {serverError && (
        <div className="px-3 py-2 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
          {serverError}
        </div>
      )}

      <fieldset disabled={!canEdit} className="contents">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <div className="space-y-1.5">
            <label className={labelClassName}>Thời hạn access token</label>
            <input
              type="number"
              min={1}
              {...register("accessTokenMinutes", { valueAsNumber: true })}
              className={cn(
                inputClassName,
                errors.accessTokenMinutes
                  ? "border-danger"
                  : "border-border-ui",
              )}
            />
            <p className="text-[11px] text-text-secondary">Đơn vị: phút</p>
            {errors.accessTokenMinutes && (
              <p className="text-[10px] text-danger font-medium">
                {errors.accessTokenMinutes.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName}>Thời hạn refresh token</label>
            <input
              type="number"
              min={1}
              {...register("refreshTokenDays", { valueAsNumber: true })}
              className={cn(
                inputClassName,
                errors.refreshTokenDays ? "border-danger" : "border-border-ui",
              )}
            />
            <p className="text-[11px] text-text-secondary">Đơn vị: ngày</p>
            {errors.refreshTokenDays && (
              <p className="text-[10px] text-danger font-medium">
                {errors.refreshTokenDays.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName}>Số lần đăng nhập sai</label>
            <input
              type="number"
              min={1}
              {...register("maxFailedLogin", { valueAsNumber: true })}
              className={cn(
                inputClassName,
                errors.maxFailedLogin ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.maxFailedLogin && (
              <p className="text-[10px] text-danger font-medium">
                {errors.maxFailedLogin.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <label className="p-4 rounded-xl border border-border-ui bg-background-app/40 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("requirePeriodicReset")}
              className="mt-1 rounded border-border-ui accent-accent"
            />
            <div>
              <KeyRound className="w-5 h-5 text-warning mb-1" />
              <p className="text-sm font-bold text-text-primary">
                Yêu cầu đổi mật khẩu định kỳ
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Nhắc người dùng đổi mật khẩu sau 90 ngày.
              </p>
            </div>
          </label>
          <label className="p-4 rounded-xl border border-border-ui bg-background-app/40 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("autoLockInactive")}
              className="mt-1 rounded border-border-ui accent-accent"
            />
            <div>
              <ShieldCheck className="w-5 h-5 text-success mb-1" />
              <p className="text-sm font-bold text-text-primary">
                Khóa phiên khi không hoạt động
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Tự động đăng xuất sau thời gian không thao tác.
              </p>
            </div>
          </label>
        </div>
      </fieldset>

      {canEdit && (
        <div className="flex justify-end border-t border-border-ui/60 -mx-6 md:-mx-8 px-6 md:px-8 pt-5">
          <button
            type="submit"
            disabled={mutation.isPending || !isDirty}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu bảo mật
          </button>
        </div>
      )}
    </form>
  );
}
