"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import bgImage from "@/assets/images/login-bg.png";
import pageBg from "@/assets/images/page-bg.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginInput } from "@wms/validations";
import {
  ArrowRight,
  Boxes,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Warehouse,
  Loader2,
  AlertCircle,
  Globe,
  BarChart3,
  User,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "reviewer@wms.com", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data.email, data.password),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.replace("/");
    },
  });

  const onSubmit = handleSubmit((data) => loginMutation.mutate(data));

  const apiError = loginMutation.isError
    ? getApiErrorMessage(loginMutation.error, "Đăng nhập thất bại")
    : null;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Global Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={pageBg}
          alt="Page Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-[0_20px_70px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 border border-white/20">
        {/* Left Side: Visual & Info */}
        <section className="hidden lg:flex flex-col relative overflow-hidden h-[540px]">
          {/* Background Image - Isometric Warehouse */}
          <div className="absolute inset-0">
            <Image
              src={bgImage}
              alt="Isometric Smart Warehouse"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Blue Gradient Overlay - Matching screenshot */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#003d99]/90 via-[#004dc0]/70 to-transparent" />

          <div className="relative z-20 p-12 h-full flex flex-col justify-between text-white">
            <div>
              {/* Logo Section */}
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                  <Boxes className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight leading-none uppercase">
                    WMS <span className="text-[#3399ff]">Smart</span>
                  </h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1 font-bold">
                    Logistics 8H Platform
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Shield Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white/90">
                  <ShieldCheck className="w-4 h-4 text-[#3399ff]" />
                  Bảo mật & Hiệu quả
                </div>

                {/* Main Heading */}
                <h1 className="text-[42px] font-black leading-[1.1] tracking-tight">
                  Quản lý kho <br />
                  <span className="text-[#3399ff]">Thông minh.</span>
                </h1>

                {/* Description */}
                <p className="text-sm text-white/90 leading-relaxed max-w-[320px] font-medium">
                  Hệ thống tối ưu hóa vận hành, kiểm soát tồn kho realtime và
                  báo cáo thông minh.
                </p>

                {/* Features List */}
                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-4 group/item cursor-default transition-transform hover:translate-x-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-lg group-hover/item:bg-[#3399ff]/20 transition-colors">
                      <Boxes className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">
                      Nhập xuất hàng tự động
                    </span>
                  </div>
                  <div className="flex items-center gap-4 group/item cursor-default transition-transform hover:translate-x-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-lg group-hover/item:bg-[#3399ff]/20 transition-colors">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">
                      Thống kê trực quan 24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-4 group/item cursor-default transition-transform hover:translate-x-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-lg group-hover/item:bg-[#3399ff]/20 transition-colors">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">
                      Phân quyền người dùng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="p-8 lg:p-10 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto">
            {/* User Icon Circle */}
            <div className="w-14 h-14 rounded-full bg-[#f0f6ff] flex items-center justify-center mb-5 shadow-inner">
              <UserRound className="w-7 h-7 text-[#0061f2]" />
            </div>

            <div className="mb-8">
              <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
                Đăng nhập
              </h2>
              <p className="text-slate-500 mt-2.5 text-sm font-medium">
                Hệ thống quản lý kho Logistics 8H
              </p>
            </div>

            {apiError && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold">{apiError}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={onSubmit} noValidate>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0061f2] transition-colors">
                    <Mail className="w-full h-full" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="reviewer@wms.com"
                    autoFocus
                    {...register("email")}
                    className="w-full pl-12 pr-4 py-3.5 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#0061f2] focus:bg-white focus:ring-4 focus:ring-[#0061f2]/10 transition-all font-medium placeholder:text-slate-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-bold mt-1.5 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0061f2] transition-colors">
                    <LockKeyhole className="w-full h-full" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full pl-12 pr-12 py-3.5 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#0061f2] focus:bg-white focus:ring-4 focus:ring-[#0061f2]/10 transition-all font-medium placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#0061f2] transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-bold mt-1.5 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 py-1">
                <label className="flex items-center gap-2.5 text-sm font-bold text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#0061f2] focus:ring-[#0061f2]"
                  />{" "}
                  Ghi nhớ đăng nhập
                </label>
                <button
                  type="button"
                  className="text-sm font-bold text-[#0061f2] hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-3 bg-[#0061f2] hover:bg-[#0052ce] text-white rounded-2xl px-4 py-3.5 text-sm font-black shadow-xl shadow-[#0061f2]/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100",
                )}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập hệ thống</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Box */}
            <div className="mt-8 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                Reviewer Access
              </p>
              <div className="space-y-1 text-[11px] font-bold text-slate-600">
                <p>
                  <span className="text-slate-400">Account:</span>{" "}
                  reviewer@wms.com / Reviewer@wms
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Info - Outside Card */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 hidden sm:flex">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 WMS Smart Logistics
        </p>
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            v1.0.0
          </span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <a
          href="#"
          className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#0061f2]"
        >
          Hỗ trợ kỹ thuật
        </a>
      </div>
    </main>
  );
}
