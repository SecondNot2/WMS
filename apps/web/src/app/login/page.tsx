"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Boxes, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <main className="min-h-screen bg-background-app flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-card-white rounded-3xl border border-border-ui shadow-2xl overflow-hidden">
        <section className="hidden lg:flex flex-col justify-between bg-primary p-10 text-white min-h-175">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-black tracking-wider uppercase">WMS System</p>
                <p className="text-xs text-white/60">Warehouse Management Platform</p>
              </div>
            </div>

            <div className="mt-20 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-white/80">
                <ShieldCheck className="w-3.5 h-3.5" /> Bảo mật vận hành kho
              </span>
              <h1 className="text-4xl font-black leading-tight">Quản lý kho logistics cửa khẩu theo thời gian thực</h1>
              <p className="text-sm text-white/70 leading-relaxed max-w-md">Theo dõi tồn kho, lập phiếu nhập xuất, kiểm soát phê duyệt và báo cáo vận hành trong một giao diện thống nhất.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <p className="text-2xl font-black">1.2K</p>
              <p className="text-xs text-white/60 mt-1">SKU theo dõi</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <p className="text-2xl font-black">24/7</p>
              <p className="text-xs text-white/60 mt-1">Realtime</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <p className="text-2xl font-black">3</p>
              <p className="text-xs text-white/60 mt-1">Vai trò</p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-black text-text-primary tracking-wider uppercase">WMS System</p>
                <p className="text-xs text-text-secondary">Warehouse Management Platform</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Warehouse className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-text-primary">Đăng nhập</h2>
              <p className="text-sm text-text-secondary mt-2">Sử dụng tài khoản được cấp để truy cập hệ thống quản lý kho.</p>
            </div>

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input type="email" defaultValue="admin@wms.com" className="w-full pl-9 pr-4 py-3 text-sm bg-background-app/50 border border-border-ui rounded-xl outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Mật khẩu</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input type={showPassword ? "text" : "password"} defaultValue="password" className="w-full pl-9 pr-11 py-3 text-sm bg-background-app/50 border border-border-ui rounded-xl outline-none focus:border-accent transition-colors" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                  <input type="checkbox" className="rounded border-border-ui accent-accent" /> Ghi nhớ đăng nhập
                </label>
                <button type="button" className="text-xs font-bold text-accent hover:underline">Quên mật khẩu?</button>
              </div>

              <Link href="/" className={cn("w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-lg shadow-accent/20 transition-colors")}>
                Đăng nhập hệ thống <ArrowRight className="w-4 h-4" />
              </Link>
            </form>

            <div className="mt-8 rounded-xl border border-warning/20 bg-warning/5 p-4">
              <p className="text-xs font-bold text-text-primary">Tài khoản mẫu</p>
              <p className="text-xs text-text-secondary mt-1">Admin: admin@wms.com · Thủ kho: warehouse@wms.com · Kế toán: accountant@wms.com</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
