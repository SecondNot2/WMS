"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, KeyRound, Mail, Save, Shield, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const userSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  password: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: Partial<UserFormValues>;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit }: UserFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "WAREHOUSE_STAFF",
      password: "",
      isActive: true,
      ...initialData,
    },
  });

  const onSubmit = (data: UserFormValues) => {
    console.log("User form data:", data);
    router.push("/users");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-primary mt-2">{isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h1>
          <p className="text-sm text-text-secondary">{isEdit ? "Cập nhật thông tin và quyền truy cập" : "Tạo tài khoản nhân viên mới"}</p>
        </div>
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-card-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm w-fit shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2"><UserRound className="w-5 h-5 text-accent" /> Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">Họ tên <span className="text-danger">*</span></label>
                <input {...register("name")} placeholder="Nhập họ tên" className={cn("w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors", errors.name ? "border-danger" : "border-border-ui")} />
                {errors.name && <p className="text-[10px] text-danger font-medium">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">Email <span className="text-danger">*</span></label>
                <input {...register("email")} placeholder="user@wms.com" className={cn("w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors", errors.email ? "border-danger" : "border-border-ui")} />
                {errors.email && <p className="text-[10px] text-danger font-medium">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">Vai trò</label>
                <select {...register("role")} className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors">
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="WAREHOUSE_STAFF">Thủ kho</option>
                  <option value="ACCOUNTANT">Kế toán</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">Mật khẩu {isEdit ? "mới" : "mặc định"}</label>
                <input type="password" {...register("password")} placeholder={isEdit ? "Bỏ trống nếu không đổi" : "Nhập mật khẩu mặc định"} className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> Quyền theo vai trò</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border-ui bg-background-app/50"><p className="text-xs font-bold text-text-primary">Admin</p><p className="text-[11px] text-text-secondary mt-1">Toàn quyền hệ thống, duyệt phiếu, quản lý user.</p></div>
              <div className="p-4 rounded-xl border border-border-ui bg-background-app/50"><p className="text-xs font-bold text-text-primary">Thủ kho</p><p className="text-[11px] text-text-secondary mt-1">Quản lý sản phẩm, lập phiếu nhập/xuất, xem tồn kho.</p></div>
              <div className="p-4 rounded-xl border border-border-ui bg-background-app/50"><p className="text-xs font-bold text-text-primary">Kế toán</p><p className="text-[11px] text-text-secondary mt-1">Xem báo cáo, xuất dữ liệu, tra cứu sản phẩm.</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Lưu ý bảo mật</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui"><Mail className="w-4 h-4 text-accent mt-0.5" /><p className="text-[11px] text-text-secondary"><span className="block text-xs font-bold text-text-primary">Email đăng nhập</span>Email phải duy nhất trong hệ thống.</p></div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui"><KeyRound className="w-4 h-4 text-warning mt-0.5" /><p className="text-[11px] text-text-secondary"><span className="block text-xs font-bold text-text-primary">Mật khẩu mặc định</span>Yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên khi backend hỗ trợ.</p></div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-app/50 border border-border-ui"><Shield className="w-4 h-4 text-success mt-0.5" /><p className="text-[11px] text-text-secondary"><span className="block text-xs font-bold text-text-primary">Phân quyền</span>Quyền chi tiết được cấu hình trong module Vai trò.</p></div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-colors">Hủy</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors"><Save className="w-4 h-4" /> {isEdit ? "Cập nhật" : "Tạo tài khoản"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
