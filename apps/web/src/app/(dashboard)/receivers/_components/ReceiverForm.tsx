"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const receiverSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên đơn vị nhận"),
  type: z.enum(["BRANCH", "WAREHOUSE", "CUSTOMER"]),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional(),
  note: z.string().optional(),
  isActive: z.boolean(),
});

type ReceiverFormValues = z.infer<typeof receiverSchema>;

interface ReceiverFormProps {
  initialData?: Partial<ReceiverFormValues>;
  isEdit?: boolean;
}

export function ReceiverForm({ initialData, isEdit }: ReceiverFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReceiverFormValues>({
    resolver: zodResolver(receiverSchema),
    defaultValues: {
      name: "",
      type: "BRANCH",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      note: "",
      isActive: true,
      ...initialData,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = (data: ReceiverFormValues) => {
    console.log("Receiver form data:", data);
    router.push("/receivers");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
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
                  Loại đơn vị
                </label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                >
                  <option value="BRANCH">Chi nhánh</option>
                  <option value="WAREHOUSE">Kho trung chuyển</option>
                  <option value="CUSTOMER">Khách hàng/đại lý</option>
                </select>
              </div>

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

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Địa chỉ nhận hàng
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  placeholder="Nhập địa chỉ giao nhận"
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-accent" /> Người phụ trách nhận
              hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Người liên hệ
                </label>
                <input
                  {...register("contactPerson")}
                  placeholder="Họ tên"
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Số điện thoại
                </label>
                <input
                  {...register("phone")}
                  placeholder="0902 345 678"
                  className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Email
                </label>
                <input
                  {...register("email")}
                  placeholder="receiver@company.vn"
                  className={cn(
                    "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors",
                    errors.email ? "border-danger" : "border-border-ui",
                  )}
                />
                {errors.email && (
                  <p className="text-[10px] text-danger font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5">
              Ghi chú xuất kho
            </h3>
            <textarea
              {...register("note")}
              rows={4}
              placeholder="Khung giờ nhận hàng, yêu cầu chứng từ, điều kiện bàn giao..."
              className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Tóm tắt
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Building2 className="w-4 h-4 text-accent mt-0.5" />
                <p className="text-[11px] text-text-secondary">
                  <span className="block text-xs font-bold text-text-primary">
                    Dữ liệu nền xuất kho
                  </span>
                  Đơn vị nhận sẽ xuất hiện trong form lập phiếu xuất.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Phone className="w-4 h-4 text-success mt-0.5" />
                <p className="text-[11px] text-text-secondary">
                  <span className="block text-xs font-bold text-text-primary">
                    Liên hệ bàn giao
                  </span>
                  Nên nhập người phụ trách để xác nhận giao nhận.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <MapPin className="w-4 h-4 text-warning mt-0.5" />
                <p className="text-[11px] text-text-secondary">
                  <span className="block text-xs font-bold text-text-primary">
                    Địa chỉ nhận hàng
                  </span>
                  Dùng khi in phiếu xuất và điều phối vận chuyển.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                <Mail className="w-4 h-4 text-info mt-0.5" />
                <p className="text-[11px] text-text-secondary">
                  <span className="block text-xs font-bold text-text-primary">
                    Thông báo
                  </span>
                  Email giúp gửi xác nhận xuất kho trong tương lai.
                </p>
              </div>
            </div>
          </div>

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
              {isEdit ? "Cập nhật" : "Lưu đơn vị"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
