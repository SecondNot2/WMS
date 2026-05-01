"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Loader2, Save } from "lucide-react";
import type { z } from "zod";
import { alertSettingsSchema } from "@wms/validations";
import type { AlertSettings, SystemSettingMeta } from "@wms/types";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/Combobox";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { useUpdateAlertSettings } from "@/lib/hooks/use-settings";
import { SettingsMeta } from "./SettingsMeta";
import { useUnsavedGuard } from "./useUnsavedGuard";

type AlertSettingsInput = z.input<typeof alertSettingsSchema>;
type AlertSettingsOutput = z.output<typeof alertSettingsSchema>;

const inputClassName =
  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors";
const labelClassName = "text-xs text-text-secondary font-semibold";

interface Props {
  defaults: AlertSettings;
  meta: SystemSettingMeta;
  canEdit: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

const FREQUENCY_OPTIONS = [
  { value: "realtime", label: "Realtime" },
  { value: "daily", label: "Hằng ngày" },
  { value: "weekly", label: "Hằng tuần" },
] as const;

const TOGGLES: {
  name: keyof Pick<
    AlertSettings,
    "emailLowStock" | "emailPendingOverdue" | "emailIssueRejected"
  >;
  label: string;
}[] = [
  { name: "emailLowStock", label: "Gửi email khi hàng hết tồn" },
  {
    name: "emailPendingOverdue",
    label: "Gửi thông báo khi phiếu nhập quá hạn",
  },
  {
    name: "emailIssueRejected",
    label: "Gửi thông báo khi phiếu xuất bị từ chối",
  },
];

export function AlertSettingsForm({
  defaults,
  meta,
  canEdit,
  onDirtyChange,
}: Props) {
  const toast = useToast();
  const mutation = useUpdateAlertSettings();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<AlertSettingsInput, unknown, AlertSettingsOutput>({
    resolver: zodResolver(alertSettingsSchema),
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
      toast.success("Đã lưu cấu hình cảnh báo");
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
          <Bell className="w-5 h-5 text-warning" /> Thiết lập cảnh báo
        </h2>
        <p className="text-xs text-text-secondary">
          Cấu hình ngưỡng thông báo cho tồn kho, phiếu chờ duyệt và email vận
          hành.
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
            <label className={labelClassName}>Cảnh báo tồn thấp trước</label>
            <input
              type="number"
              min={0}
              {...register("lowStockPercent", { valueAsNumber: true })}
              className={cn(
                inputClassName,
                errors.lowStockPercent ? "border-danger" : "border-border-ui",
              )}
            />
            <p className="text-[11px] text-text-secondary">
              Tính theo phần trăm so với minStock
            </p>
            {errors.lowStockPercent && (
              <p className="text-[10px] text-danger font-medium">
                {errors.lowStockPercent.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName}>Phiếu chờ duyệt quá hạn</label>
            <input
              type="number"
              min={0}
              {...register("pendingHours", { valueAsNumber: true })}
              className={cn(
                inputClassName,
                errors.pendingHours ? "border-danger" : "border-border-ui",
              )}
            />
            <p className="text-[11px] text-text-secondary">Đơn vị: giờ</p>
            {errors.pendingHours && (
              <p className="text-[10px] text-danger font-medium">
                {errors.pendingHours.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5 ">
            <label className={labelClassName}>Tần suất tổng hợp</label>
            <Controller
              control={control}
              name="summaryFrequency"
              render={({ field }) => (
                <Combobox<AlertSettings["summaryFrequency"]>
                  value={field.value || "daily"}
                  onChange={(next) => field.onChange(next || "daily")}
                  options={[...FREQUENCY_OPTIONS]}
                  searchable={false}
                  disabled={!canEdit}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-3 pt-8">
          {TOGGLES.map((t) => (
            <label
              key={t.name}
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border-ui bg-background-app/40"
            >
              <span className="text-sm font-semibold text-text-primary">
                {t.label}
              </span>
              <input
                type="checkbox"
                {...register(t.name)}
                className="rounded border-border-ui accent-accent"
              />
            </label>
          ))}
        </div>
      </fieldset>

      {canEdit && (
        <div className="flex justify-end border-t border-border-ui/60 -mx-6 md:-mx-8 px-6 md:px-8 pt-5">
          <button
            type="submit"
            disabled={mutation.isPending || !isDirty}
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu cảnh báo
          </button>
        </div>
      )}
    </form>
  );
}
