"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  UserRound,
} from "lucide-react";
import { createSupplierSchema } from "@wms/validations";
import type { CreateSupplierSchemaInput } from "@wms/validations";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useCreateSupplier,
  useSupplier,
  useUpdateSupplier,
} from "@/lib/hooks/use-suppliers";
import { cn } from "@/lib/utils";
import type {
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@wms/types";

type SupplierFormValues = CreateSupplierSchemaInput & { isActive?: boolean };

const defaultValues: SupplierFormValues = {
  name: "",
  phone: null,
  email: null,
  address: null,
  taxCode: null,
  isActive: true,
};

interface SupplierFormConnectedProps {
  supplierId?: string;
}

export function SupplierFormConnected({
  supplierId,
}: SupplierFormConnectedProps) {
  const router = useRouter();
  const isEdit = Boolean(supplierId);
  const { data: supplier, isLoading } = useSupplier(supplierId ?? "");
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier(supplierId ?? "");
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(
      createSupplierSchema,
    ) as unknown as Resolver<SupplierFormValues>,
    defaultValues,
  });

  React.useEffect(() => {
    if (!supplier) return;
    reset({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      taxCode: supplier.taxCode,
      isActive: supplier.isActive,
    });
  }, [supplier, reset]);

  const isActive = watch("isActive") ?? true;

  const onSubmit = async (values: SupplierFormValues) => {
    setSubmitError(null);
    try {
      if (isEdit && supplierId) {
        const payload: UpdateSupplierInput = {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
          taxCode: values.taxCode,
          isActive: values.isActive,
        };
        await updateMutation.mutateAsync(payload);
        router.push(`/suppliers/${supplierId}`);
      } else {
        const payload: CreateSupplierInput = {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
          taxCode: values.taxCode,
        };
        const created = await createMutation.mutateAsync(payload);
        router.push(`/suppliers/${created.id}`);
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể lưu nhà cung cấp"));
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin nhà cung cấp...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      {submitError && (
        <div className="bg-danger/5 border border-danger/20 text-danger text-sm rounded-xl p-4">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" /> Thông tin doanh
              nghiệp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Tên nhà cung cấp <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Nhập tên công ty/đối tác"
                  className={inputClass(errors.name?.message)}
                />
                {errors.name && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Mã số thuế
                </label>
                <input
                  {...register("taxCode")}
                  placeholder="0101234567"
                  className={inputClass(errors.taxCode?.message)}
                />
                {errors.taxCode && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.taxCode.message}
                  </p>
                )}
              </div>

              {isEdit && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">
                    Trạng thái
                  </label>
                  <button
                    type="button"
                    onClick={() => setValue("isActive", !isActive)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg transition-colors",
                      isActive
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20",
                    )}
                  >
                    <span className="font-semibold">
                      {isActive ? "Đang hoạt động" : "Tạm dừng"}
                    </span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Địa chỉ
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  placeholder="Nhập địa chỉ giao dịch"
                  className={cn(
                    inputClass(errors.address?.message),
                    "resize-none",
                  )}
                />
                {errors.address && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-accent" /> Thông tin liên hệ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Số điện thoại
                </label>
                <input
                  {...register("phone")}
                  placeholder="0901 234 567"
                  className={inputClass(errors.phone?.message)}
                />
                {errors.phone && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Email
                </label>
                <input
                  {...register("email")}
                  placeholder="contact@company.vn"
                  className={inputClass(errors.email?.message)}
                />
                {errors.email && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Lưu ý
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Building2 className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Dữ liệu nền nhập kho
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Nhà cung cấp sẽ xuất hiện trong form lập phiếu nhập.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Phone className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Liên hệ nhanh
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Nên nhập số điện thoại/email để phối hợp giao nhận.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <MapPin className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Địa chỉ giao dịch
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Dùng khi in phiếu và đối soát chứng từ nhập kho.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Mail className="w-4 h-4 text-info mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Mã số thuế duy nhất
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Mã số thuế đã tồn tại sẽ không được tạo trùng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 sticky top-24">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
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
                <Save className="w-4 h-4" />
                {isEdit ? "Cập nhật" : "Lưu nhà cung cấp"}
              </button>
              <button
                type="button"
                onClick={() =>
                  reset(
                    isEdit && supplier
                      ? {
                          name: supplier.name,
                          phone: supplier.phone,
                          email: supplier.email,
                          address: supplier.address,
                          taxCode: supplier.taxCode,
                          isActive: supplier.isActive,
                        }
                      : defaultValues,
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-card-white border border-border-ui text-text-secondary hover:bg-background-app font-bold py-2.5 rounded-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Làm mới
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

function inputClass(error?: string) {
  return cn(
    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
    error ? "border-danger" : "border-border-ui",
  );
}
