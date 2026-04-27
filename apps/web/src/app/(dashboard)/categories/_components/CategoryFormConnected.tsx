"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save } from "lucide-react";
import { createCategorySchema } from "@wms/validations";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/hooks/use-categories";
import { cn } from "@/lib/utils";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@wms/types";
import type { CreateCategorySchemaInput } from "@wms/validations";

interface CategoryFormConnectedProps {
  categoryId?: string;
}

type CategoryFormValues = CreateCategorySchemaInput & { isActive?: boolean };

const defaultValues: CategoryFormValues = {
  name: "",
  description: null,
  isActive: true,
};

export function CategoryFormConnected({
  categoryId,
}: CategoryFormConnectedProps) {
  const router = useRouter();
  const isEdit = Boolean(categoryId);
  const { data: category, isLoading } = useCategory(categoryId ?? "");
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(categoryId ?? "");
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(
      createCategorySchema,
    ) as unknown as Resolver<CategoryFormValues>,
    defaultValues,
  });

  React.useEffect(() => {
    if (!category) return;
    reset({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
  }, [category, reset]);

  const isActive = watch("isActive") ?? true;

  const onSubmit = async (values: CategoryFormValues) => {
    setSubmitError(null);
    try {
      if (isEdit && categoryId) {
        const payload: UpdateCategoryInput = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        };
        await updateMutation.mutateAsync(payload);
        router.push(`/categories/${categoryId}`);
      } else {
        const payload: CreateCategoryInput = {
          name: values.name,
          description: values.description,
        };
        const created = await createMutation.mutateAsync(payload);
        router.push(`/categories/${created.id}`);
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể lưu danh mục"));
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin danh mục...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="bg-danger/5 border border-danger/20 text-danger text-sm rounded-xl p-4">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Thông tin danh mục
            </h3>
            <div className="space-y-4">
              <Field label="Tên danh mục" required error={errors.name?.message}>
                <input
                  {...register("name")}
                  className={inputClass(errors.name?.message)}
                  placeholder="VD: Thiết bị ngoại vi"
                />
              </Field>
              <Field label="Mô tả" error={errors.description?.message}>
                <textarea
                  {...register("description")}
                  rows={5}
                  className={cn(
                    inputClass(errors.description?.message),
                    "resize-none",
                  )}
                  placeholder="Nhập mô tả ngắn gọn về danh mục..."
                />
              </Field>
            </div>
          </div>

          {isEdit && (
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-accent rounded-full" />
                Trạng thái
              </h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    checked={isActive}
                    onChange={() => setValue("isActive", true)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      isActive
                        ? "border-success bg-success"
                        : "border-border-ui group-hover:border-success/50",
                    )}
                  >
                    {isActive && (
                      <div className="w-2 h-2 bg-card-white rounded-full" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span
                      className={cn(
                        "text-sm font-bold transition-colors",
                        isActive ? "text-success" : "text-text-primary",
                      )}
                    >
                      Đang sử dụng
                    </span>
                    <p className="text-xs text-text-secondary">
                      Danh mục hiển thị và có thể gán cho sản phẩm
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    checked={!isActive}
                    onChange={() => setValue("isActive", false)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      !isActive
                        ? "border-warning bg-warning"
                        : "border-border-ui group-hover:border-warning/50",
                    )}
                  >
                    {!isActive && (
                      <div className="w-2 h-2 bg-card-white rounded-full" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span
                      className={cn(
                        "text-sm font-bold transition-colors",
                        !isActive ? "text-warning" : "text-text-primary",
                      )}
                    >
                      Tạm dừng
                    </span>
                    <p className="text-xs text-text-secondary">
                      Ẩn danh mục khỏi danh sách lựa chọn
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-text-primary mb-5">
              Thao tác
            </h3>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-accent/20"
              >
                <Save className="w-4.5 h-4.5" />
                {isEdit ? "Cập nhật danh mục" : "Lưu danh mục"}
              </button>
              <button
                type="button"
                onClick={() =>
                  reset(
                    isEdit && category
                      ? {
                          name: category.name,
                          description: category.description,
                          isActive: category.isActive,
                        }
                      : defaultValues,
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-card-white border border-border-ui text-text-secondary hover:bg-background-app font-bold py-2.5 rounded-lg transition-all"
              >
                <RotateCcw className="w-4.5 h-4.5" />
                Làm mới
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary font-medium py-2 transition-colors text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
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
