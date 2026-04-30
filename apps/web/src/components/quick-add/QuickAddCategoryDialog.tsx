"use client";

import React from "react";
import { Folder, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  type CreateCategorySchemaInput,
} from "@wms/validations";
import { FormDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { useCreateCategory } from "@/lib/hooks/use-categories";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Category } from "@wms/types";

interface QuickAddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  onCreated?: (category: Category) => void;
}

export function QuickAddCategoryDialog({
  open,
  onClose,
  initialName,
  onCreated,
}: QuickAddCategoryDialogProps) {
  const create = useCreateCategory();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategorySchemaInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: initialName ?? "", description: null },
  });

  React.useEffect(() => {
    if (open) {
      reset({ name: initialName ?? "", description: null });
    }
  }, [open, initialName, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await create.mutateAsync({
        name: values.name,
        description: values.description,
      });
      toast.success(`Đã tạo danh mục ${created.name}`);
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể tạo danh mục"));
    }
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Thêm nhanh danh mục"
      description="Đặt tên ngắn gọn — có thể bổ sung mô tả sau."
      icon={<Folder className="w-5 h-5" />}
      size="sm"
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
            form="quick-add-category-form"
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
        id="quick-add-category-form"
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <Field label="Tên danh mục" required error={errors.name?.message}>
          <input
            {...register("name")}
            autoFocus
            className={inputClass(errors.name?.message)}
            placeholder="VD: Thiết bị ngoại vi"
          />
        </Field>
        <Field label="Mô tả" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={3}
            className={cn(
              inputClass(errors.description?.message),
              "resize-none",
            )}
            placeholder="Nhập mô tả ngắn gọn (tùy chọn)"
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
