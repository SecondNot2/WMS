"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Building2, CheckCircle2, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const supplierSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhà cung cấp"),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  taxCode: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
  isActive: z.boolean(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  initialData?: Partial<SupplierFormValues>;
  isEdit?: boolean;
}

export function SupplierForm({ initialData, isEdit }: SupplierFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      taxCode: "",
      address: "",
      note: "",
      isActive: true,
      ...initialData,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = (data: SupplierFormValues) => {
    console.log("Supplier form data:", data);
    router.push("/suppliers");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-primary mt-2">{isEdit ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}</h1>
          <p className="text-sm text-text-secondary">{isEdit ? "Cập nhật thông tin đối tác cung ứng" : "Tạo mới đối tác cung ứng hàng hóa"}</p>
        </div>
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-card-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm w-fit shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" /> Thông tin doanh nghiệp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Tên nhà cung cấp <span className="text-danger">*</span></label>
                  <input {...register("name")} placeholder="Nhập tên công ty/đối tác" className={cn("w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors", errors.name ? "border-danger" : "border-border-ui")} />
                  {errors.name && <p className="text-[10px] text-danger font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Mã số thuế</label>
                  <input {...register("taxCode")} placeholder="0101234567" className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Trạng thái</label>
                  <button type="button" onClick={() => setValue("isActive", !isActive)} className={cn("w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg transition-colors", isActive ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20")}>
                    <span className="font-semibold">{isActive ? "Đang hoạt động" : "Tạm dừng"}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Địa chỉ</label>
                  <textarea {...register("address")} rows={3} placeholder="Nhập địa chỉ giao dịch" className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-accent" /> Người phụ trách liên hệ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Người liên hệ</label>
                  <input {...register("contactPerson")} placeholder="Họ tên" className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Số điện thoại</label>
                  <input {...register("phone")} placeholder="0901 234 567" className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Email</label>
                  <input {...register("email")} placeholder="contact@company.vn" className={cn("w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors", errors.email ? "border-danger" : "border-border-ui")} />
                  {errors.email && <p className="text-[10px] text-danger font-medium">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-5">Ghi chú vận hành</h3>
              <textarea {...register("note")} rows={4} placeholder="Điều khoản giao hàng, lịch nhận hàng, ghi chú thanh toán..." className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors resize-none" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Tóm tắt</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                  <Building2 className="w-4 h-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">Dữ liệu nền nhập kho</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Nhà cung cấp sẽ xuất hiện trong form lập phiếu nhập.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                  <Phone className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">Liên hệ nhanh</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Nên nhập số điện thoại/email để phối hợp giao nhận.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                  <MapPin className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">Địa chỉ giao dịch</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Dùng khi in phiếu và đối soát chứng từ nhập kho.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui">
                  <Mail className="w-4 h-4 text-info mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">Thông báo</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Email hợp lệ giúp gửi xác nhận đơn nhập trong tương lai.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex items-center justify-end gap-3">
              <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-colors">Hủy</button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors">
                <Save className="w-4 h-4" /> {isEdit ? "Cập nhật" : "Lưu nhà cung cấp"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
