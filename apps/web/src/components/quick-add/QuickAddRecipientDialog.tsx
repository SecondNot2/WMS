"use client";

import React from "react";
import { Building, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRecipientSchema,
  type CreateRecipientSchemaInput,
} from "@wms/validations";
import { FormDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { useCreateRecipient } from "@/lib/hooks/use-recipients";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Recipient } from "@wms/types";

interface QuickAddRecipientDialogProps {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  onCreated?: (recipient: Recipient) => void;
}

export function QuickAddRecipientDialog({
  open,
  onClose,
  initialName,
  onCreated,
}: QuickAddRecipientDialogProps) {
  const create = useCreateRecipient();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRecipientSchemaInput>({
    resolver: zodResolver(createRecipientSchema),
    defaultValues: {
      name: initialName ?? "",
      phone: null,
      email: null,
      address: null,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialName ?? "",
        phone: null,
        email: null,
        address: null,
      });
    }
  }, [open, initialName, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await create.mutateAsync({
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
      });
      toast.success(`Đã tạo đơn vị nhận ${created.name}`);
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể tạo đơn vị nhận"));
    }
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Thêm nhanh đơn vị nhận"
      description="Chỉ cần tên — các trường khác có thể bổ sung sau."
      icon={<Building className="w-5 h-5" />}
      size="md"
      loading={create.isPending}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={create.isPending}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-background-app rounded-lg disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="quick-add-recipient-form"
            disabled={create.isPending}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-accent hover:bg-accent/90 text-white shadow-sm flex items-center gap-2 disabled:opacity-60"
          >
            {create.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu
          </button>
        </>
      }
    >
      <form
        id="quick-add-recipient-form"
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <Field label="Tên đơn vị nhận" required error={errors.name?.message}>
          <input
            {...register("name")}
            autoFocus
            className={inputClass(errors.name?.message)}
            placeholder="Tên chi nhánh / đối tác nhận"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Số điện thoại" error={errors.phone?.message}>
            <input
              {...register("phone")}
              className={inputClass(errors.phone?.message)}
              placeholder="0902 345 678"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              className={inputClass(errors.email?.message)}
              placeholder="receiver@company.vn"
            />
          </Field>
        </div>
        <Field label="Địa chỉ nhận hàng" error={errors.address?.message}>
          <input
            {...register("address")}
            className={inputClass(errors.address?.message)}
            placeholder="Địa chỉ giao nhận"
          />
        </Field>
      </form>
    </FormDialog>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold text-text-secondary">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-danger font-medium">{error}</p>}
    </div>
  );
}

function inputClass(error?: string) {
  return cn(
    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
    error ? "border-danger" : "border-border-ui",
  );
}
