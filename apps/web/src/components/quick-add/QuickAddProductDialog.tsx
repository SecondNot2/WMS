"use client";

import React from "react";
import { Folder, Loader2, Package, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useCategories } from "@/lib/hooks/use-categories";
import { useCreateProduct } from "@/lib/hooks/use-products";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { CreateProductInput, Product } from "@wms/types";
import { QuickAddCategoryDialog } from "./QuickAddCategoryDialog";

// Schema rút gọn: chỉ các field bắt buộc + đủ để tạo product
const quickAddProductSchema = z.object({
  sku: z.string().trim().min(1, "Vui lòng nhập SKU").max(50),
  name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(200),
  categoryId: z.string().min(1, "Chọn danh mục"),
  unit: z.string().trim().min(1, "Vui lòng nhập đơn vị").max(50),
});

type QuickAddProductValues = z.infer<typeof quickAddProductSchema>;

interface QuickAddProductDialogProps {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  onCreated?: (product: Product) => void;
}

export function QuickAddProductDialog({
  open,
  onClose,
  initialName,
  onCreated,
}: QuickAddProductDialogProps) {
  const create = useCreateProduct();
  const toast = useToast();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
    isActive: true,
  });
  const categories = categoriesData?.data ?? [];

  const [quickCategoryOpen, setQuickCategoryOpen] = React.useState(false);
  const [quickCategorySearch, setQuickCategorySearch] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<QuickAddProductValues>({
    resolver: zodResolver(quickAddProductSchema),
    defaultValues: {
      sku: "",
      name: initialName ?? "",
      categoryId: "",
      unit: "cái",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        sku: "",
        name: initialName ?? "",
        categoryId: "",
        unit: "cái",
      });
    }
  }, [open, initialName, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload: CreateProductInput = {
        sku: values.sku,
        name: values.name,
        categoryId: values.categoryId,
        unit: values.unit,
        barcode: null,
        brand: null,
        model: null,
        costPrice: null,
        salePrice: null,
        taxRate: null,
        minStock: 0,
        location: null,
        description: null,
        image: null,
      };
      const created = await create.mutateAsync(payload);
      toast.success(`Đã tạo sản phẩm ${created.name}`);
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể tạo sản phẩm"));
    }
  });

  return (
    <>
      <FormDialog
        open={open}
        onClose={onClose}
        title="Thêm nhanh sản phẩm"
        description="Đủ field bắt buộc để dùng ngay — bổ sung chi tiết sau ở trang sản phẩm."
        icon={<Package className="w-5 h-5" />}
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
              form="quick-add-product-form"
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
          id="quick-add-product-form"
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <Field label="Tên sản phẩm" required error={errors.name?.message}>
            <input
              {...register("name")}
              autoFocus
              className={inputClass(errors.name?.message)}
              placeholder="Nhập tên sản phẩm"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Mã SKU" required error={errors.sku?.message}>
              <input
                {...register("sku")}
                className={inputClass(errors.sku?.message)}
                placeholder="SP0001"
              />
            </Field>
            <Field label="Đơn vị tính" required error={errors.unit?.message}>
              <input
                {...register("unit")}
                className={inputClass(errors.unit?.message)}
                placeholder="cái, hộp, thùng..."
              />
            </Field>
          </div>

          <Field label="Danh mục" required error={errors.categoryId?.message}>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Combobox<string>
                  value={field.value ?? ""}
                  onChange={(next) => field.onChange(next)}
                  options={categories.map<ComboboxOption<string>>((cat) => ({
                    value: cat.id,
                    label: cat.name,
                    hint: `${cat.productCount} sp`,
                    icon: (
                      <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
                        <Folder className="w-3.5 h-3.5" />
                      </span>
                    ),
                  }))}
                  loading={categoriesLoading}
                  placeholder="-- Chọn danh mục --"
                  searchPlaceholder="Tìm danh mục..."
                  hasError={Boolean(errors.categoryId)}
                  emptyMessage="Chưa có danh mục"
                  onCreateNew={(search) => {
                    setQuickCategorySearch(search);
                    setQuickCategoryOpen(true);
                  }}
                />
              )}
            />
          </Field>
        </form>
      </FormDialog>

      <QuickAddCategoryDialog
        open={quickCategoryOpen}
        onClose={() => setQuickCategoryOpen(false)}
        initialName={quickCategorySearch}
        onCreated={(cat) => {
          setValue("categoryId", cat.id, { shouldValidate: true });
        }}
      />
    </>
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
