"use client";

import React from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  Save,
  Package,
  Truck,
  User,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupplier, useSuppliers } from "@/lib/hooks/use-suppliers";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useCreateInbound, useUpdateInbound } from "@/lib/hooks/use-inbound";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";
import { ProductCombobox } from "@/components/ProductCombobox";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { QuickAddSupplierDialog } from "@/components/quick-add/QuickAddSupplierDialog";
import { QuickAddProductDialog } from "@/components/quick-add/QuickAddProductDialog";

const inboundItemSchema = z.object({
  productId: z.string().min(1, "Chọn sản phẩm"),
  quantity: z
    .number({ error: "Số lượng không hợp lệ" })
    .int()
    .min(1, "Tối thiểu 1"),
  unitPrice: z.number({ error: "Đơn giá không hợp lệ" }).min(0, "Giá không âm"),
});

const inboundSchema = z.object({
  supplierId: z.string().min(1, "Chọn nhà cung cấp"),
  note: z.string().optional(),
  items: z.array(inboundItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

export type InboundFormValues = z.infer<typeof inboundSchema>;

interface InboundFormProps {
  initialData?: Partial<InboundFormValues>;
  isEdit?: boolean;
  inboundId?: string;
}

export function InboundForm({
  initialData,
  isEdit,
  inboundId,
}: InboundFormProps) {
  const router = useRouter();

  // Server-side search cho danh sách nhà cung cấp
  const [supplierSearch, setSupplierSearch] = React.useState("");
  const debouncedSupplierSearch = useDebouncedValue(supplierSearch, 250);
  const { data: suppliersData, isFetching: suppliersLoading } = useSuppliers({
    limit: 30,
    search: debouncedSupplierSearch || undefined,
    isActive: true,
  });
  const suppliers = suppliersData?.data ?? [];

  const createMutation = useCreateInbound();
  const updateMutation = useUpdateInbound(inboundId ?? "");
  const toast = useToast();

  // Quick-add states
  const [supplierQuickAdd, setSupplierQuickAdd] = React.useState<{
    open: boolean;
    name: string;
  }>({ open: false, name: "" });
  const [productQuickAdd, setProductQuickAdd] = React.useState<{
    open: boolean;
    name: string;
    rowIndex: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InboundFormValues>({
    resolver: zodResolver(inboundSchema),
    defaultValues: initialData ?? {
      supplierId: "",
      note: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = useWatch({ control, name: "items" });

  const totalAmount =
    watchItems?.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice || 0),
      0,
    ) || 0;

  const onSubmit = async (data: InboundFormValues) => {
    const payload = {
      supplierId: data.supplierId,
      note: data.note?.trim() ? data.note.trim() : null,
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    try {
      if (isEdit && inboundId) {
        await updateMutation.mutateAsync(payload);
        toast.success("Đã cập nhật phiếu nhập");
        router.push(`/inbound/${inboundId}`);
      } else {
        const created = await createMutation.mutateAsync(payload);
        toast.success(`Đã tạo phiếu ${created.code}`);
        router.push(`/inbound/${created.id}`);
      }
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          isEdit ? "Không thể cập nhật phiếu" : "Không thể tạo phiếu",
        ),
      );
    }
  };

  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 md:p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Thông tin nguồn hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Nhà cung cấp <span className="text-danger">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="supplierId"
                    render={({ field }) => (
                      <SupplierComboboxField
                        value={field.value}
                        onChange={field.onChange}
                        suppliers={suppliers}
                        loading={suppliersLoading}
                        searchValue={supplierSearch}
                        onSearchChange={setSupplierSearch}
                        hasError={Boolean(errors.supplierId)}
                        onCreateNew={(search) =>
                          setSupplierQuickAdd({ open: true, name: search })
                        }
                      />
                    )}
                  />
                  {errors.supplierId && (
                    <p className="text-xs text-danger mt-1">
                      {errors.supplierId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Ghi chú
                  </label>
                  <input
                    {...register("note")}
                    placeholder="Nhập ghi chú thêm nếu có..."
                    className="w-full px-4 py-2.5 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-border-ui/50" />

            {/* Items Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Danh sách hàng hóa nhập
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    append({ productId: "", quantity: 1, unitPrice: 0 })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-card-white border border-accent text-accent rounded-lg font-medium text-xs hover:bg-accent/5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Thêm dòng
                </button>
              </div>

              <div className="overflow-x-auto -mx-6 md:-mx-8">
                <table className="w-full text-left min-w-200">
                  <thead className="bg-background-app/50 border-b border-border-ui">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-12">
                        STT
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-32">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-40">
                        Đơn giá nhập
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-40 text-right">
                        Thành tiền
                      </th>
                      <th className="px-6 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-ui">
                    {fields.map((field, index) => (
                      <tr key={field.id} className="group">
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <Controller
                            control={control}
                            name={`items.${index}.productId` as const}
                            render={({ field: ctrl }) => (
                              <ProductCombobox
                                value={ctrl.value}
                                onChange={(id) => ctrl.onChange(id)}
                                hasError={Boolean(
                                  errors.items?.[index]?.productId,
                                )}
                                excludeIds={(watchItems ?? [])
                                  .map((it, i) =>
                                    i !== index ? it?.productId : null,
                                  )
                                  .filter((id): id is string => Boolean(id))}
                                placeholder="Tìm sản phẩm theo SKU/tên..."
                                onCreateNew={(search) =>
                                  setProductQuickAdd({
                                    open: true,
                                    name: search,
                                    rowIndex: index,
                                  })
                                }
                              />
                            )}
                          />
                          {errors.items?.[index]?.productId && (
                            <p className="text-[10px] text-danger mt-1">
                              {errors.items[index]?.productId?.message}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min={1}
                            {...register(`items.${index}.quantity` as const, {
                              valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 text-sm bg-card-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all text-center"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            {...register(`items.${index}.unitPrice` as const, {
                              valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 text-sm bg-card-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all text-right font-medium"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                          {new Intl.NumberFormat("vi-VN").format(
                            (watchItems?.[index]?.quantity || 0) *
                              (watchItems?.[index]?.unitPrice || 0),
                          )}{" "}
                          đ
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="p-2 text-text-secondary hover:text-danger transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {errors.items?.root && (
                  <div className="p-4 bg-danger/5 border-t border-danger/20 flex items-center gap-2 text-danger text-sm">
                    <AlertCircle className="w-4 h-4" />{" "}
                    {errors.items.root.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="w-1 h-3 bg-accent rounded-full" />
              Tổng hợp phiếu nhập
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary font-medium">
                  Số lượng mặt hàng:
                </span>
                <span className="text-text-primary font-bold">
                  {fields.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary font-medium">
                  Tổng số lượng SP:
                </span>
                <span className="text-text-primary font-bold">
                  {watchItems?.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0,
                  ) || 0}
                </span>
              </div>

              <hr className="border-border-ui/50 my-2" />

              <div className="space-y-1">
                <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">
                  Tổng giá trị phiếu
                </p>
                <p className="text-2xl font-black text-accent tracking-tighter">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
                </p>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="w-full py-2.5 border border-border-ui rounded-lg text-sm font-bold text-text-secondary hover:bg-background-app transition-all disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-sm shadow-md shadow-accent/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Đang lưu..." : "Lưu phiếu"}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-info/5 rounded-lg border border-info/10">
              <p className="text-[11px] text-info leading-relaxed">
                <strong>Lưu ý:</strong> Sau khi lưu, phiếu sẽ ở trạng thái{" "}
                <strong>Chờ duyệt</strong>. Tồn kho chỉ được cập nhật sau khi
                quản trị viên phê duyệt phiếu này.
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuickAddSupplierDialog
        open={supplierQuickAdd.open}
        onClose={() => setSupplierQuickAdd({ open: false, name: "" })}
        initialName={supplierQuickAdd.name}
        onCreated={(s) => {
          setValue("supplierId", s.id, { shouldValidate: true });
        }}
      />

      {productQuickAdd && (
        <QuickAddProductDialog
          open={productQuickAdd.open}
          onClose={() => setProductQuickAdd(null)}
          initialName={productQuickAdd.name}
          onCreated={(p) => {
            setValue(`items.${productQuickAdd.rowIndex}.productId`, p.id, {
              shouldValidate: true,
            });
          }}
        />
      )}
    </form>
  );
}

// Field component cho NCC Combobox: tự fetch supplier đã chọn nếu nó không có
// trong kết quả search hiện tại (case edit phiếu cũ với search đang gõ).
function SupplierComboboxField({
  value,
  onChange,
  suppliers,
  loading,
  searchValue,
  onSearchChange,
  hasError,
  onCreateNew,
}: {
  value: string;
  onChange: (next: string) => void;
  suppliers: Array<{
    id: string;
    name: string;
    taxCode: string | null;
    phone: string | null;
  }>;
  loading: boolean;
  searchValue: string;
  onSearchChange: (next: string) => void;
  hasError: boolean;
  onCreateNew: (search: string) => void;
}) {
  // Nếu supplier đã chọn không có trong kết quả search → fetch riêng để vẫn
  // hiển thị tên trong trigger và giữ trong dropdown.
  const hasSelectedInList = !!value && suppliers.some((s) => s.id === value);
  const { data: selectedSupplier } = useSupplier(
    !value || hasSelectedInList ? "" : value,
  );

  const merged = React.useMemo(() => {
    if (hasSelectedInList || !selectedSupplier) return suppliers;
    return [
      {
        id: selectedSupplier.id,
        name: selectedSupplier.name,
        taxCode: selectedSupplier.taxCode,
        phone: selectedSupplier.phone,
      },
      ...suppliers,
    ];
  }, [hasSelectedInList, selectedSupplier, suppliers]);

  return (
    <Combobox<string>
      value={value}
      onChange={(next) => onChange(next)}
      options={merged.map<ComboboxOption<string>>((s) => ({
        value: s.id,
        label: s.name,
        description:
          [s.taxCode, s.phone].filter(Boolean).join(" · ") || undefined,
        icon: (
          <span className="w-7 h-7 rounded-md bg-accent/10 text-accent flex items-center justify-center">
            <Truck className="w-3.5 h-3.5" />
          </span>
        ),
      }))}
      searchable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      loading={loading}
      placeholder="Chọn nhà cung cấp"
      searchPlaceholder="Tìm theo tên, MST, SĐT..."
      emptyMessage={
        searchValue ? `Không tìm thấy "${searchValue}"` : "Chưa có nhà cung cấp"
      }
      hasError={hasError}
      onCreateNew={onCreateNew}
    />
  );
}
