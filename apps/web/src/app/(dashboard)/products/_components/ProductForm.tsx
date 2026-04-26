"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  X,
  Save,
  RotateCcw,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  sku: z.string().min(1, "Vui lòng nhập mã SKU"),
  barcode: z.string().optional(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  brand: z.string().optional(),
  model: z.string().optional(),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
  spec: z.string().optional(),
  costPrice: z.number().min(0, "Giá vốn không được âm"),
  salePrice: z.number().min(0, "Giá bán không được âm"),
  taxRate: z.number().optional(),
  minStock: z.number().min(0, "Ngưỡng tồn tối thiểu không được âm"),
  maxStock: z.number().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["in_stock", "out_of_stock"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormValues>;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: (initialData as ProductFormValues) || {
      name: "",
      sku: "",
      category: "",
      unit: "",
      costPrice: 0,
      salePrice: 0,
      minStock: 0,
      status: "in_stock",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info Section */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Tên sản phẩm <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Nhập tên sản phẩm"
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
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
                  Mã SKU <span className="text-danger">*</span>
                </label>
                <input
                  {...register("sku")}
                  placeholder="SP0001"
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                    errors.sku ? "border-danger" : "border-border-ui",
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Mã vạch (Barcode)
                </label>
                <input
                  {...register("barcode")}
                  placeholder="893..."
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Danh mục <span className="text-danger">*</span>
                </label>
                <select
                  {...register("category")}
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                    errors.category ? "border-danger" : "border-border-ui",
                  )}
                >
                  <option value="">Chọn danh mục</option>
                  <option value="peripheral">Thiết bị ngoại vi</option>
                  <option value="monitor">Màn hình</option>
                  <option value="laptop">Laptop</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Thương hiệu
                </label>
                <input
                  {...register("brand")}
                  placeholder="Logitech, Dell..."
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Model / Đời máy
                </label>
                <input
                  {...register("model")}
                  placeholder="Vd: M331, K2..."
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Đơn vị tính <span className="text-danger">*</span>
                </label>
                <select
                  {...register("unit")}
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                    errors.unit ? "border-danger" : "border-border-ui",
                  )}
                >
                  <option value="">Chọn đơn vị</option>
                  <option value="unit">Cái</option>
                  <option value="set">Bộ</option>
                  <option value="box">Hộp</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Quy cách / Đặc tính
                </label>
                <input
                  {...register("spec")}
                  placeholder="Vd: Màu đen, 16GB RAM, 512GB SSD..."
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Tax Section */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Giá sản phẩm & Thuế
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Giá vốn (VNĐ)
                </label>
                <input
                  type="number"
                  {...register("costPrice", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Giá bán (VNĐ)
                </label>
                <input
                  type="number"
                  {...register("salePrice", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors font-bold text-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Thuế suất (%)
                </label>
                <input
                  type="number"
                  {...register("taxRate", { valueAsNumber: true })}
                  placeholder="8"
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Logistics & Dimensions Section */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Vận chuyển & Kích thước
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Trọng lượng (kg)
                </label>
                <input
                  type="number"
                  {...register("weight", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Dài (cm)
                </label>
                <input
                  type="number"
                  {...register("length", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Rộng (cm)
                </label>
                <input
                  type="number"
                  {...register("width", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Cao (cm)
                </label>
                <input
                  type="number"
                  {...register("height", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Inventory Policy Section */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Thiết lập tồn kho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Tồn tối thiểu <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register("minStock", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Tồn tối đa
                </label>
                <input
                  type="number"
                  {...register("maxStock", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Vị trí mặc định
                </label>
                <input
                  {...register("location")}
                  placeholder="Vd: A-1-02"
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Mô tả chi tiết
            </h3>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Nhập mô tả sản phẩm..."
              className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
        </div>

        {/* Right Column - Image & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Image Upload Section */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Hình ảnh sản phẩm
            </h3>

            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-square bg-background-app/50 border-2 border-dashed border-border-ui rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-background-app transition-all group relative overflow-hidden">
                {initialData?.name ? (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=400&q=80"
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        className="bg-card-white p-2 rounded-full text-text-primary hover:text-accent shadow-lg transition-transform hover:scale-110"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary">
                      Chọn ảnh hoặc kéo thả
                    </p>
                    <p className="text-[11px] text-text-secondary mt-1">
                      Hỗ trợ JPG, PNG, WebP (Tối đa 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions Card */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-text-primary mb-5">
              Thao tác
            </h3>
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-accent/20"
              >
                <Save className="w-4.5 h-4.5" />
                {isEdit ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-card-white border border-border-ui text-text-secondary hover:bg-background-app font-bold py-2.5 rounded-lg transition-all"
              >
                <RotateCcw className="w-4.5 h-4.5" />
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
