"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { PermissionMatrix } from "./PermissionMatrix";

const roleSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập mã vai trò"),
  label: z.string().min(1, "Vui lòng nhập tên hiển thị"),
  description: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: Partial<RoleFormValues>;
  isEdit?: boolean;
}

export function RoleForm({ initialData, isEdit }: RoleFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      label: "",
      description: "",
      ...initialData,
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    console.log("Role form data:", data);
    router.push("/roles");
  };

  const matrixRole =
    initialData?.name === "ACCOUNTANT"
      ? "ACCOUNTANT"
      : initialData?.name === "WAREHOUSE_STAFF"
        ? "WAREHOUSE_STAFF"
        : "ADMIN";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" /> Thông tin vai trò
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Mã vai trò <span className="text-danger">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="VD: MANAGER"
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors uppercase",
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
              Tên hiển thị <span className="text-danger">*</span>
            </label>
            <input
              {...register("label")}
              placeholder="VD: Quản lý kho"
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                errors.label ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.label && (
              <p className="text-[10px] text-danger font-medium">
                {errors.label.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Mô tả
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Mô tả phạm vi trách nhiệm của vai trò"
              className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <PermissionMatrix editable role={matrixRole} />

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isEdit ? "Cập nhật" : "Lưu vai trò"}
        </button>
      </div>
    </form>
  );
}
