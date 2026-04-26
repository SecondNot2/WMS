"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  History,
  Settings,
  Database,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  PackageX,
  Printer,
  Copy,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailViewProps {
  id: string;
}

export function ProductDetailView({ id }: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "inventory" | "history"
  >("general");

  const tabs = [
    { id: "general", label: "Thông tin chung", icon: Box },
    { id: "inventory", label: "Tồn kho", icon: Database },
    { id: "history", label: "Lịch sử thay đổi", icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Product Hero Header */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          <div className="w-full md:w-48 aspect-square rounded-xl border border-border-ui overflow-hidden bg-background-app/30 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=400&q=80"
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent uppercase tracking-wider">
                    Thiết bị ngoại vi
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider">
                    Còn hàng
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Chuột không dây Logitech M331
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  SKU:{" "}
                  <span className="font-semibold text-text-primary">
                    SP000456
                  </span>{" "}
                  | Mã vạch:{" "}
                  <span className="font-semibold text-text-primary">
                    6954176845123
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${id}/edit`}
                  className="px-4 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-sm font-bold transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Chỉnh sửa
                </Link>
                <button className="px-4 py-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                  <Printer className="w-4 h-4" /> In mã vạch
                </button>
                <button className="px-4 py-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                  <Copy className="w-4 h-4" /> Sao chép
                </button>
                <button className="p-2 bg-card-white border border-border-ui text-text-secondary hover:text-danger hover:border-danger rounded-lg transition-all">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border-ui/50">
              <div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                  Giá vốn
                </p>
                <p className="text-lg font-bold text-text-primary">
                  250,000{" "}
                  <span className="text-[12px] font-normal text-text-secondary">
                    đ
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                  Giá bán
                </p>
                <p className="text-lg font-bold text-accent">
                  350,000{" "}
                  <span className="text-[12px] font-normal text-text-secondary">
                    đ
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                  Tồn hiện tại
                </p>
                <p className="text-lg font-bold text-success">
                  120{" "}
                  <span className="text-[12px] font-normal text-text-secondary">
                    Cái
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                  Lợi nhuận dự kiến
                </p>
                <p className="text-lg font-bold text-text-primary">
                  100,000{" "}
                  <span className="text-[12px] font-normal text-text-secondary">
                    đ
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border-ui overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary hover:bg-background-app/50",
            )}
          >
            <tab.icon className="w-4.5 h-4.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-100">
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-300">
            <div className="md:col-span-8 space-y-6">
              <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-accent rounded-full" />
                  Mô tả sản phẩm
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Chuột không dây Logitech M331 Silent Plus mang đến sự yên tĩnh
                  tuyệt đối cho người dùng với khả năng giảm 90% tiếng ồn click.
                  Thiết kế công thái học vừa vặn với tay cầm, pin sử dụng lên
                  đến 24 tháng. - Kết nối: Wireless 2.4GHz thông qua USB
                  Receiver. - Độ phân giải: 1000 DPI. - Khoảng cách kết nối:
                  10m.
                </p>
              </div>

              <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-accent rounded-full" />
                  Thông số kỹ thuật & Quy cách
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    { label: "Thương hiệu", value: "Logitech" },
                    { label: "Mô hình", value: "M331" },
                    { label: "Màu sắc", value: "Đen" },
                    { label: "Đơn vị tính", value: "Cái" },
                    {
                      label: "Quy cách",
                      value: "Silent Plus, Wireless 2.4GHz",
                    },
                    { label: "Bảo hành", value: "12 tháng" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-border-ui/50 last:border-0"
                    >
                      <span className="text-xs text-text-secondary font-medium">
                        {item.label}
                      </span>
                      <span className="text-xs text-text-primary font-bold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-accent rounded-full" />
                  Thông tin Logistics & Kích thước
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Trọng lượng", value: "0.091 kg" },
                    { label: "Chiều dài", value: "10.5 cm" },
                    { label: "Chiều rộng", value: "6.8 cm" },
                    { label: "Chiều cao", value: "3.8 cm" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-background-app/50 rounded-lg border border-border-ui text-center"
                    >
                      <p className="text-[10px] text-text-secondary font-bold uppercase mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-black text-text-primary">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Thông tin tồn kho
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      Ngưỡng tồn tối thiểu
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      20 Cái
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      Ngưỡng tồn tối đa
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      200 Cái
                    </span>
                  </div>
                  <div className="h-2 bg-background-app rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[60%]" />
                  </div>
                  <p className="text-[10px] text-text-secondary text-center italic">
                    Đang ở mức an toàn (60%)
                  </p>
                </div>
              </div>

              <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Thông tin hệ thống
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                      Ngày tạo
                    </span>
                    <span className="text-xs text-text-primary font-bold">
                      15/04/2024 10:30
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                      Người tạo
                    </span>
                    <span className="text-xs text-text-primary font-bold">
                      Nguyễn Văn A
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                      Cập nhật cuối
                    </span>
                    <span className="text-xs text-text-primary font-bold">
                      17/05/2024 14:32
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-6">
                  Trạng thái tồn kho
                </h3>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-background-app stroke-current"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-success stroke-current"
                        strokeWidth="3"
                        strokeDasharray="60, 100"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-text-primary">
                        120
                      </span>
                      <span className="text-[10px] text-text-secondary font-medium uppercase">
                        Cái
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs text-text-secondary">
                        Khả dụng
                      </span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-xs text-text-secondary">
                        Đang đặt hàng
                      </span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      20
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background-app/50 border-b border-border-ui">
                    <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">
                      Kho hàng
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase text-center">
                      Tồn kho
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase text-center">
                      Khả dụng
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase text-center">
                      Giữ chỗ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {[
                    {
                      name: "Kho chính (Tổng)",
                      stock: 120,
                      available: 100,
                      reserved: 20,
                    },
                    {
                      name: "Khu vực A-01",
                      stock: 80,
                      available: 75,
                      reserved: 5,
                    },
                    {
                      name: "Khu vực B-03",
                      stock: 40,
                      available: 25,
                      reserved: 15,
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-background-app/20">
                      <td className="px-5 py-4 text-sm font-bold text-text-primary">
                        {row.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-center font-bold text-accent">
                        {row.stock}
                      </td>
                      <td className="px-5 py-4 text-sm text-center font-bold text-success">
                        {row.available}
                      </td>
                      <td className="px-5 py-4 text-sm text-center font-bold text-danger">
                        {row.reserved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden animate-in fade-in duration-300">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-app/50 border-b border-border-ui">
                  <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">
                    Thời gian
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">
                    Người thực hiện
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">
                    Hành động
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">
                    Chi tiết thay đổi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-ui">
                {[
                  {
                    time: "17/05/2024 14:32",
                    user: "Nguyễn Văn A",
                    action: "Cập nhật tồn kho",
                    details: "Tăng 20 Cái (Nhập kho #PN1023)",
                  },
                  {
                    time: "16/05/2024 10:15",
                    user: "Trần Thị B",
                    action: "Cập nhật thông tin",
                    details: "Thay đổi mô tả sản phẩm",
                  },
                  {
                    time: "15/05/2024 09:00",
                    user: "Lê Văn C",
                    action: "Giảm tồn kho",
                    details: "Giảm 5 Cái (Xuất kho #PX0987)",
                  },
                  {
                    time: "15/04/2024 10:30",
                    user: "Nguyễn Văn A",
                    action: "Tạo mới",
                    details: "Thêm sản phẩm vào hệ thống",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-background-app/20">
                    <td className="px-5 py-4 text-xs text-text-secondary">
                      {row.time}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-text-primary">
                      {row.user}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-accent">
                      {row.action}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {row.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
