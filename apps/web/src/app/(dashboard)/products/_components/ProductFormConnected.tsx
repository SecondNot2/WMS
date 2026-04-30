"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, RotateCcw, Save } from "lucide-react";
import { createProductSchema } from "@wms/validations";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { ImageUpload, type ImageUploadHandle } from "@/components/ImageUpload";
import { QuickAddCategoryDialog } from "@/components/quick-add/QuickAddCategoryDialog";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { productsApi } from "@/lib/api/products";
import { useCategories, useCategory } from "@/lib/hooks/use-categories";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
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

type ProductFormValues = CreateProductSchemaInput & {
  /** Chỉ dùng khi tạo mới: lượng tồn kho khởi tạo, sau khi tạo sẽ gọi adjust-stock */
  initialStock?: number;
};

export function ProductFormConnected({ productId }: ProductFormConnectedProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const { data: product, isLoading } = useProduct(productId ?? "");
  // Server-side search cho danh mục
  const [categorySearch, setCategorySearch] = React.useState("");
  const debouncedCategorySearch = useDebouncedValue(categorySearch, 250);
  const { data: categoriesData, isFetching: categoriesLoading } = useCategories(
    {
      limit: 30,
      search: debouncedCategorySearch || undefined,
      isActive: true,
    },
  );
  const categories = categoriesData?.data ?? [];
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(productId ?? "");
  const toast = useToast();
  const imageUploadRef = React.useRef<ImageUploadHandle>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [categoryQuickAdd, setCategoryQuickAdd] = React.useState<{
    open: boolean;
    name: string;
  }>({ open: false, name: "" });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
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
      initialStock: 0,
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
    // Tách initialStock khỏi payload — backend createProduct không nhận field này
    const { initialStock, ...payload } = values;
    try {
      // Upload ảnh pending (nếu có) và xóa ảnh cũ — trước khi gửi API
      if (imageUploadRef.current) {
        const finalImage = await imageUploadRef.current.commit();
        payload.image = finalImage;
      }
      if (isEdit && productId) {
        await updateMutation.mutateAsync(payload as CreateProductInput);
        toast.success(`Đã cập nhật ${values.name}`);
        router.push(`/products/${productId}`);
      } else {
        const created = await createMutation.mutateAsync(
          payload as CreateProductInput,
        );
        toast.success(`Đã tạo sản phẩm ${created.name}`);
        // Nếu user nhập tồn kho khởi tạo > 0 → gọi adjust-stock để tạo entry lịch sử
        const initial = Number(initialStock ?? 0);
        if (Number.isInteger(initial) && initial > 0) {
          try {
            await productsApi.adjustStock(created.id, {
              quantity: initial,
              note: "Tồn kho khởi tạo",
            });
          } catch (err) {
            // Sản phẩm đã tạo thành công — chỉ cảnh báo nếu adjust fail
            const msg = getApiErrorMessage(
              err,
              "Đã tạo sản phẩm nhưng không thể set tồn kho khởi tạo",
            );
            setSubmitError(msg);
            toast.error(msg);
          }
        }
        router.push(`/products/${created.id}`);
      }
    } catch (error) {
      const msg = getApiErrorMessage(error, "Không thể lưu sản phẩm");
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/refs -- handleSubmit returns event handler; ref.current is read inside async submit, not during render
  const submitHandler = handleSubmit(onSubmit);

  return (
    <form onSubmit={submitHandler} className="space-y-6">
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
                label="Danh mục"
                error={errors.categoryId?.message}
                required
              >
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <CategoryComboboxField
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      categories={categories}
                      loading={categoriesLoading}
                      searchValue={categorySearch}
                      onSearchChange={setCategorySearch}
                      hasError={Boolean(errors.categoryId)}
                      onCreateNew={(search) =>
                        setCategoryQuickAdd({ open: true, name: search })
                      }
                    />
                  )}
                />
                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-[10px] text-warning font-medium">
                    Chưa có danh mục nào. Hãy tạo danh mục trước khi thêm sản
                    phẩm.
                  </p>
                )}
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
                  min={0}
                  {...register("minStock", { valueAsNumber: true })}
                  className={inputClass(errors.minStock?.message)}
                />
              </Field>
              {!isEdit && (
                <Field
                  label="Tồn kho ban đầu"
                  error={errors.initialStock?.message}
                >
                  <input
                    type="number"
                    min={0}
                    step={1}
                    {...register("initialStock", { valueAsNumber: true })}
                    className={inputClass(errors.initialStock?.message)}
                    placeholder="0"
                  />
                </Field>
              )}
            </div>
            {!isEdit && (
              <p className="text-[11px] text-text-secondary mt-3">
                Tồn kho ban đầu sẽ được ghi vào lịch sử tồn kho với loại
                <span className="font-bold text-accent"> ADJUST</span>. Để trống
                hoặc 0 nếu chưa nhập hàng.
              </p>
            )}
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              Mô tả & hình ảnh
            </h3>
            <div className="space-y-4">
              <Field label="Hình ảnh sản phẩm" error={errors.image?.message}>
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <ImageUpload
                      ref={imageUploadRef}
                      value={field.value ?? null}
                      onChange={(url) => field.onChange(url)}
                      folder="products"
                      aspect="video"
                    />
                  )}
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

      <QuickAddCategoryDialog
        open={categoryQuickAdd.open}
        onClose={() => setCategoryQuickAdd({ open: false, name: "" })}
        initialName={categoryQuickAdd.name}
        onCreated={(c) => {
          setValue("categoryId", c.id, { shouldValidate: true });
        }}
      />
    </form>
  );
}

// Category Combobox với server-side search + giữ selected khi đang search
function CategoryComboboxField({
  value,
  onChange,
  categories,
  loading,
  searchValue,
  onSearchChange,
  hasError,
  onCreateNew,
}: {
  value: string;
  onChange: (next: string) => void;
  categories: Array<{ id: string; name: string; productCount: number }>;
  loading: boolean;
  searchValue: string;
  onSearchChange: (next: string) => void;
  hasError: boolean;
  onCreateNew: (search: string) => void;
}) {
  const hasSelectedInList = !!value && categories.some((c) => c.id === value);
  const { data: selectedCategory } = useCategory(
    !value || hasSelectedInList ? "" : value,
  );

  const merged = React.useMemo(() => {
    if (hasSelectedInList || !selectedCategory) return categories;
    return [
      {
        id: selectedCategory.id,
        name: selectedCategory.name,
        productCount: selectedCategory.productCount,
      },
      ...categories,
    ];
  }, [hasSelectedInList, selectedCategory, categories]);

  return (
    <Combobox<string>
      value={value}
      onChange={(next) => onChange(next)}
      options={merged.map<ComboboxOption<string>>((cat) => ({
        value: cat.id,
        label: cat.name,
        hint: `${cat.productCount} sp`,
        icon: (
          <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
            <Folder className="w-3.5 h-3.5" />
          </span>
        ),
      }))}
      searchable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      loading={loading}
      placeholder="-- Chọn danh mục --"
      searchPlaceholder="Tìm danh mục..."
      hasError={hasError}
      emptyMessage={
        searchValue ? `Không tìm thấy "${searchValue}"` : "Chưa có danh mục"
      }
      onCreateNew={onCreateNew}
    />
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
