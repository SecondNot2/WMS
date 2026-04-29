"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Save } from "lucide-react";
import type { z } from "zod";
import { generalSettingsSchema } from "@wms/validations";
import type { GeneralSettings, SystemSettingMeta } from "@wms/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { useUpdateGeneralSettings } from "@/lib/hooks/use-settings";
import { SettingsMeta } from "./SettingsMeta";
import { useUnsavedGuard } from "./useUnsavedGuard";

type GeneralSettingsInput = z.input<typeof generalSettingsSchema>;

const inputClassName =
  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors";
const labelClassName = "text-xs text-text-secondary font-semibold";

interface Props {
  defaults: GeneralSettings;
  meta: SystemSettingMeta;
  canEdit: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export function GeneralSettingsForm({
  defaults,
  meta,
  canEdit,
  onDirtyChange,
}: Props) {
  const toast = useToast();
  const mutation = useUpdateGeneralSettings();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsInput>({
    resolver: zodResolver(generalSettingsSchema),
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
      toast.success("Đã lưu cấu hình thông tin kho");
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
          <Building2 className="w-5 h-5 text-accent" /> Thông tin kho vận
        </h2>
        <p className="text-xs text-text-secondary">
          Dữ liệu này dùng cho header phiếu nhập/xuất, báo cáo in ấn và branding
          sidebar.
        </p>
        <SettingsMeta meta={meta} />
      </div>

      {serverError && (
        <div className="px-3 py-2 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
          {serverError}
        </div>
      )}

      <fieldset disabled={!canEdit} className="contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <Field
            label="Tên hệ thống"
            error={errors.systemName?.message}
            input={
              <input
                {...register("systemName")}
                className={cn(
                  inputClassName,
                  errors.systemName ? "border-danger" : "border-border-ui",
                )}
              />
            }
          />
          <Field
            label="Mã kho"
            error={errors.warehouseCode?.message}
            input={
              <input
                {...register("warehouseCode")}
                className={cn(
                  inputClassName,
                  errors.warehouseCode ? "border-danger" : "border-border-ui",
                )}
              />
            }
          />
          <Field
            label="Tên kho"
            error={errors.warehouseName?.message}
            input={
              <input
                {...register("warehouseName")}
                className={cn(
                  inputClassName,
                  errors.warehouseName ? "border-danger" : "border-border-ui",
                )}
              />
            }
          />
          <Field
            label="Email quản trị"
            error={errors.adminEmail?.message}
            input={
              <input
                type="email"
                {...register("adminEmail")}
                className={cn(
                  inputClassName,
                  errors.adminEmail ? "border-danger" : "border-border-ui",
                )}
              />
            }
          />
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClassName}>Địa chỉ kho</label>
            <textarea
              {...register("address")}
              rows={3}
              className={cn(
                inputClassName,
                "resize-none",
                errors.address ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.address && (
              <p className="text-[10px] text-danger font-medium">
                {errors.address.message}
              </p>
            )}
          </div>
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
            Lưu thông tin kho
          </button>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelClassName}>{label}</label>
      {input}
      {error && <p className="text-[10px] text-danger font-medium">{error}</p>}
    </div>
  );
}
