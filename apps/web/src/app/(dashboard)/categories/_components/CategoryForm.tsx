"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RotateCcw, Upload, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  code: z.string().min(1, "Vui lòng nhập mã danh mục"),
  parentId: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "HIDDEN"]),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues>;
  isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit }: CategoryFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image || null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: (initialData as CategoryFormValues) || {
      name: "",
      code: "",
      parentId: "",
      description: "",
      status: "ACTIVE",
      image: "",
    },
  });

  const currentStatus = watch("status");

  const onSubmit = (data: CategoryFormValues) => {
    console.log("Form data:", data);
    // TODO: Connect to API
    router.push("/categories");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue("image", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-10">
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-text-primary">
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Tên danh mục <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Nhập tên danh mục"
                  className={cn(
                    "w-full px-4 py-2.5 text-sm bg-card-white border rounded-lg outline-none focus:border-accent transition-all",
                    errors.name ? "border-danger" : "border-border-ui",
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-danger mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Mã danh mục <span className="text-danger">*</span>
                </label>
                <div className="space-y-1.5">
                  <input
                    {...register("code")}
                    placeholder="Nhập mã danh mục"
                    className={cn(
                      "w-full px-4 py-2.5 text-sm bg-card-white border rounded-lg outline-none focus:border-accent transition-all",
                      errors.code ? "border-danger" : "border-border-ui",
                    )}
                  />
                  <p className="text-[11px] text-text-secondary">
                    Mã danh mục không được trùng
                  </p>
                </div>
                {errors.code && (
                  <p className="text-xs text-danger mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Danh mục cha
                </label>
                <div className="relative group">
                  <select
                    {...register("parentId")}
                    className="w-full px-4 py-2.5 text-sm bg-card-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Chọn danh mục cha (nếu có)</option>
                    <option value="parent-1">Điện tử</option>
                    <option value="parent-2">Gia dụng</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none group-focus-within:text-accent transition-colors" />
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Mô tả
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Nhập mô tả danh mục"
                  className="w-full px-4 py-3 text-sm bg-card-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-border-ui/50" />

          {/* Section 2: Status */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-text-primary">
              Trạng thái
            </h3>

            <div className="flex flex-wrap gap-10 justify-between">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  {...register("status")}
                  value="ACTIVE"
                  className="sr-only"
                />
                <div
                  className={cn(
                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    currentStatus === "ACTIVE"
                      ? "border-success bg-success"
                      : "border-border-ui group-hover:border-success/50",
                  )}
                >
                  {currentStatus === "ACTIVE" && (
                    <div className="w-2 h-2 bg-card-white rounded-full" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      currentStatus === "ACTIVE"
                        ? "text-success"
                        : "text-text-primary",
                    )}
                  >
                    Đang sử dụng
                  </span>
                  <p className="text-xs text-text-secondary">
                    Danh mục hiển thị và sử dụng bình thường
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  {...register("status")}
                  value="PAUSED"
                  className="sr-only"
                />
                <div
                  className={cn(
                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    currentStatus === "PAUSED"
                      ? "border-warning bg-warning"
                      : "border-border-ui group-hover:border-warning/50",
                  )}
                >
                  {currentStatus === "PAUSED" && (
                    <div className="w-2 h-2 bg-card-white rounded-full" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      currentStatus === "PAUSED"
                        ? "text-warning"
                        : "text-text-primary",
                    )}
                  >
                    Tạm dừng
                  </span>
                  <p className="text-xs text-text-secondary">
                    Tạm ngưng sử dụng danh mục
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  {...register("status")}
                  value="HIDDEN"
                  className="sr-only"
                />
                <div
                  className={cn(
                    "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    currentStatus === "HIDDEN"
                      ? "border-danger bg-danger"
                      : "border-border-ui group-hover:border-danger/50",
                  )}
                >
                  {currentStatus === "HIDDEN" && (
                    <div className="w-2 h-2 bg-card-white rounded-full" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      currentStatus === "HIDDEN"
                        ? "text-danger"
                        : "text-text-primary",
                    )}
                  >
                    Ẩn
                  </span>
                  <p className="text-xs text-text-secondary">
                    Ẩn danh mục, không hiển thị trong hệ thống
                  </p>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-border-ui/50" />

          {/* Section 3: Image */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-text-primary">
              Hình ảnh đại diện
            </h3>

            <div className="max-w-md">
              {previewImage ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border-ui group shadow-sm">
                  <img
                    src={previewImage}
                    alt="Category"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="p-2 bg-card-white rounded-full text-text-primary hover:text-accent cursor-pointer shadow-lg transition-transform hover:scale-110">
                      <RotateCcw className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-card-white rounded-full text-text-primary hover:text-danger shadow-lg transition-transform hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-80 h-48 border-2 border-dashed border-border-ui rounded-xl bg-background-app/50 hover:bg-background-app hover:border-accent/50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-card-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-text-secondary group-hover:text-accent" />
                  </div>
                  <p className="text-xs text-text-secondary mb-1">
                    Kéo thả ảnh vào đây hoặc
                  </p>
                  <span className="px-4 py-1.5 bg-card-white border border-border-ui rounded-lg text-xs font-bold text-accent shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                    Chọn ảnh
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              <p className="mt-3 text-[11px] text-text-secondary italic">
                Hỗ trợ JPG, PNG, WebP (Tối đa 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-background-app/30 border-t border-border-ui flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-2.5 bg-card-white border border-border-ui rounded-lg text-sm font-bold text-text-secondary hover:bg-background-app transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
          >
            {isEdit ? "Cập nhật danh mục" : "Lưu danh mục"}
          </button>
        </div>
      </div>
    </form>
  );
}

