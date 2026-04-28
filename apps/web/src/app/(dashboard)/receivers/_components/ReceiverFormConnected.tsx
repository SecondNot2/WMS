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
import { createRecipientSchema } from "@wms/validations";
import type { CreateRecipientSchemaInput } from "@wms/validations";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useCreateRecipient,
  useRecipient,
  useUpdateRecipient,
} from "@/lib/hooks/use-recipients";
import { cn } from "@/lib/utils";
import type {
  CreateRecipientInput,
  UpdateRecipientInput,
} from "@wms/types";

type ReceiverFormValues = CreateRecipientSchemaInput & { isActive?: boolean };

const defaultValues: ReceiverFormValues = {
  name: "",
  phone: null,
  email: null,
  address: null,
  isActive: true,
};

interface ReceiverFormConnectedProps {
  receiverId?: string;
}

export function ReceiverFormConnected({
  receiverId,
}: ReceiverFormConnectedProps) {
  const router = useRouter();
  const isEdit = Boolean(receiverId);
  const { data: recipient, isLoading } = useRecipient(receiverId ?? "");
  const createMutation = useCreateRecipient();
  const updateMutation = useUpdateRecipient(receiverId ?? "");
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReceiverFormValues>({
    resolver: zodResolver(
      createRecipientSchema,
    ) as unknown as Resolver<ReceiverFormValues>,
    defaultValues,
  });

  React.useEffect(() => {
    if (!recipient) return;
    reset({
      name: recipient.name,
      phone: recipient.phone,
      email: recipient.email,
      address: recipient.address,
      isActive: recipient.isActive,
    });
  }, [recipient, reset]);

  const isActive = watch("isActive") ?? true;

  const onSubmit = async (values: ReceiverFormValues) => {
    setSubmitError(null);
    try {
      if (isEdit && receiverId) {
        const payload: UpdateRecipientInput = {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
          isActive: values.isActive,
        };
        await updateMutation.mutateAsync(payload);
        router.push(`/receivers/${receiverId}`);
      } else {
        const payload: CreateRecipientInput = {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
        };
        const created = await createMutation.mutateAsync(payload);
        router.push(`/receivers/${created.id}`);
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Không thể lưu đơn vị nhận"));
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin đơn vị nhận...
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
              <Building2 className="w-5 h-5 text-accent" /> Thông tin đơn vị
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Tên đơn vị nhận <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Nhập tên chi nhánh/kho/đối tác nhận"
                  className={inputClass(errors.name?.message)}
                />
                {errors.name && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.name.message}
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
                  Địa chỉ nhận hàng
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  placeholder="Nhập địa chỉ giao nhận"
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
                  placeholder="0902 345 678"
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
                  placeholder="receiver@company.vn"
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
                    Dữ liệu nền xuất kho
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Đơn vị nhận sẽ xuất hiện trong form lập phiếu xuất.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Phone className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Liên hệ bàn giao
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Nên nhập số điện thoại để xác nhận giao nhận.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <MapPin className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Địa chỉ nhận hàng
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Dùng khi in phiếu xuất và điều phối vận chuyển.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Mail className="w-4 h-4 text-info mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Thông báo qua email
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Email giúp gửi xác nhận xuất kho trong tương lai.
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
                {isEdit ? "Cập nhật" : "Lưu đơn vị"}
              </button>
              <button
                type="button"
                onClick={() =>
                  reset(
                    isEdit && recipient
                      ? {
                          name: recipient.name,
                          phone: recipient.phone,
                          email: recipient.email,
                          address: recipient.address,
                          isActive: recipient.isActive,
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
