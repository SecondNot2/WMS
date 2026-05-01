"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Save, SlidersHorizontal } from "lucide-react";
import type { z } from "zod";
import { integrationSettingsSchema } from "@wms/validations";
import type {
  IntegrationSettings,
  ReportFormat,
  SystemSettingMeta,
} from "@wms/types";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/Combobox";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { useUpdateIntegrationSettings } from "@/lib/hooks/use-settings";
import { SettingsMeta } from "./SettingsMeta";
import { useUnsavedGuard } from "./useUnsavedGuard";

type IntegrationInput = z.input<typeof integrationSettingsSchema>;
type IntegrationOutput = z.output<typeof integrationSettingsSchema>;

const inputClassName =
  "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors";
const labelClassName = "text-xs text-text-secondary font-semibold";

const REPORT_FORMAT_OPTIONS = [
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
] as const;

interface Props {
  defaults: IntegrationSettings;
  meta: SystemSettingMeta;
  canEdit: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export function IntegrationSettingsForm({
  defaults,
  meta,
  canEdit,
  onDirtyChange,
}: Props) {
  const toast = useToast();
  const mutation = useUpdateIntegrationSettings();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<IntegrationInput, unknown, IntegrationOutput>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: {
      webhookUrl: defaults.webhookUrl ?? "",
      defaultReportFormat: defaults.defaultReportFormat,
      smtpHost: defaults.smtpHost ?? "",
      notificationEmail: defaults.notificationEmail ?? "",
    },
  });

  React.useEffect(() => {
    reset({
      webhookUrl: defaults.webhookUrl ?? "",
      defaultReportFormat: defaults.defaultReportFormat,
      smtpHost: defaults.smtpHost ?? "",
      notificationEmail: defaults.notificationEmail ?? "",
    });
  }, [defaults, reset]);

  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useUnsavedGuard(isDirty);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await mutation.mutateAsync(values);
      const updated = result.value;
      reset({
        webhookUrl: updated.webhookUrl ?? "",
        defaultReportFormat: updated.defaultReportFormat,
        smtpHost: updated.smtpHost ?? "",
        notificationEmail: updated.notificationEmail ?? "",
      });
      toast.success("Đã lưu cấu hình tích hợp");
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
          <SlidersHorizontal className="w-5 h-5 text-info" /> Tích hợp và xuất
          dữ liệu
        </h2>
        <p className="text-xs text-text-secondary">
          Thiết lập webhook, email SMTP và định dạng export mặc định.
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
          <div className="space-y-1.5">
            <label className={labelClassName}>Webhook URL</label>
            <input
              {...register("webhookUrl")}
              placeholder="https://example.com/webhook/wms"
              className={cn(
                inputClassName,
                errors.webhookUrl ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.webhookUrl && (
              <p className="text-[10px] text-danger font-medium">
                {errors.webhookUrl.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName}>Định dạng báo cáo mặc định</label>
            <Controller
              control={control}
              name="defaultReportFormat"
              render={({ field }) => (
                <Combobox<ReportFormat>
                  value={field.value || "xlsx"}
                  onChange={(next) =>
                    field.onChange((next || "xlsx") as ReportFormat)
                  }
                  options={[...REPORT_FORMAT_OPTIONS]}
                  searchable={false}
                  disabled={!canEdit}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName}>SMTP Host</label>
            <input
              {...register("smtpHost")}
              placeholder="smtp.company.vn"
              className={cn(
                inputClassName,
                errors.smtpHost ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.smtpHost && (
              <p className="text-[10px] text-danger font-medium">
                {errors.smtpHost.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className={labelClassName}>Email gửi thông báo</label>
            <input
              type="email"
              {...register("notificationEmail")}
              placeholder="no-reply@wms.com"
              className={cn(
                inputClassName,
                errors.notificationEmail ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.notificationEmail && (
              <p className="text-[10px] text-danger font-medium">
                {errors.notificationEmail.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-6 rounded-xl border border-info/20 bg-info/5 p-4 mt-8">
          <Mail className="w-5 h-5 text-info mt-0.5" />
          <div>
            <p className="text-sm font-bold text-text-primary">Lưu ý bảo mật</p>
            <p className="text-xs text-text-secondary mt-1">
              Không hardcode API key hoặc SMTP password trong frontend; dữ liệu
              nhạy cảm phải nằm ở backend hoặc biến môi trường server-side.
            </p>
          </div>
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
            Lưu tích hợp
          </button>
        </div>
      )}
    </form>
  );
}
