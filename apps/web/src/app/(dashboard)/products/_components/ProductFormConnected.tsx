"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save } from "lucide-react";
import { createProductSchema } from "@wms/validations";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from "@/lib/hooks/use-products";
import { cn } from "@/lib/utils";
import type { CreateProductInput } from "@wms/types";
import type { CreateProductSchemaInput } from "@wms/validations";

interface ProductFormConnectedProps {
  productId?: string;
}

type ProductFormValues = CreateProductSchemaInput;

export function ProductFormConnected({ productId }: ProductFormConnectedProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const { data: product, isLoading } = useProduct(productId ?? "");
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(productId ?? "");
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(
      createProductSchema,
    ) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      sku: "",
      barcode: null,
      categoryId: "",
      brand: null,
      model: null,
      unit: "cái",
      costPrice: null,
      salePrice: null,
      taxRate: null,
      minStock: 0,
      location: null,
      description: null,
      image: null,
    },
  });

  React.useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      categoryId: product.categoryId,
      brand: product.brand,
      model: product.model,
      unit: product.unit,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      taxRate: product.taxRate,
      minStock: product.minStock,
      location: product.location,
      description: product.description,
      image: product.image,
    });
  }, [product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    try {
      if (isEdit && productId) {
        await updateMutation.mutateAsync(values as CreateProductInput);
        router.push(`/products/${productId}`);
      } else {
        const created = await createMutation.mutateAsync(
          values as CreateProductInput,
        );
        router.push(`/products/${created.id}`);
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể lưu sản phẩm"));
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin sản phẩm...
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
              Thông tin sản phẩm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tên sản phẩm" error={errors.name?.message} required>
                <input
                  {...register("name")}
                  className={inputClass(errors.name?.message)}
                  placeholder="Nhập tên sản phẩm"
                />
              </Field>
              <Field label="Mã SKU" error={errors.sku?.message} required>
                <input
                  {...register("sku")}
                  className={inputClass(errors.sku?.message)}
                  placeholder="SP0001"
                />
              </Field>
              <Field label="Mã vạch" error={errors.barcode?.message}>
                <input
                  {...register("barcode")}
                  className={inputClass(errors.barcode?.message)}
                  placeholder="893..."
                />
              </Field>
              <Field
                label="Mã danh mục"
                error={errors.categoryId?.message}
                required
              >
                <input
                  {...register("categoryId")}
                  className={inputClass(errors.categoryId?.message)}
                  placeholder="categoryId"
                />
              </Field>
              <Field label="Thương hiệu" error={errors.brand?.message}>
                <input
                  {...register("brand")}
                  className={inputClass(errors.brand?.message)}
                  placeholder="Logitech, Dell..."
                />
              </Field>
              <Field label="Model" error={errors.model?.message}>
                <input
                  {...register("model")}
                  className={inputClass(errors.model?.message)}
                  placeholder="M331, K2..."
                />
              </Field>
              <Field label="Đơn vị tính" error={errors.unit?.message} required>
                <input
                  {...register("unit")}
                  className={inputClass(errors.unit?.message)}
                  placeholder="cái, hộp, thùng..."
                />
              </Field>
              <Field label="Vị trí mặc định" error={errors.location?.message}>
                <input
                  {...register("location")}
                  className={inputClass(errors.location?.message)}
                  placeholder="A-1-02"
                />
              </Field>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Giá & tồn kho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Giá vốn" error={errors.costPrice?.message}>
                <input
                  type="number"
                  {...register("costPrice", { valueAsNumber: true })}
                  className={inputClass(errors.costPrice?.message)}
                />
              </Field>
              <Field label="Giá bán" error={errors.salePrice?.message}>
                <input
                  type="number"
                  {...register("salePrice", { valueAsNumber: true })}
                  className={inputClass(errors.salePrice?.message)}
                />
              </Field>
              <Field label="Thuế suất (%)" error={errors.taxRate?.message}>
                <input
                  type="number"
                  {...register("taxRate", { valueAsNumber: true })}
                  className={inputClass(errors.taxRate?.message)}
                />
              </Field>
              <Field
                label="Tồn tối thiểu"
                error={errors.minStock?.message}
                required
              >
                <input
                  type="number"
                  {...register("minStock", { valueAsNumber: true })}
                  className={inputClass(errors.minStock?.message)}
                />
              </Field>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Mô tả & hình ảnh
            </h3>
            <div className="space-y-4">
              <Field label="URL hình ảnh" error={errors.image?.message}>
                <input
                  {...register("image")}
                  className={inputClass(errors.image?.message)}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Mô tả" error={errors.description?.message}>
                <textarea
                  {...register("description")}
                  rows={4}
                  className={cn(
                    inputClass(errors.description?.message),
                    "resize-none",
                  )}
                  placeholder="Nhập mô tả sản phẩm..."
                />
              </Field>
            </div>
          </div>
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
                {isEdit ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
              </button>
              <button
                type="button"
                onClick={() => reset()}
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
