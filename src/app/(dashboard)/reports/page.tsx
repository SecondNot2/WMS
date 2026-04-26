"use client";

import React from "react";
import { FileBarChart, History, PieChart, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const reportModules = [
  {
    title: "Báo cáo Biến động Nhập - Xuất",
    description: "Phân tích lưu lượng hàng hóa luân chuyển qua kho theo thời gian thực hoặc định kỳ.",
    href: "/reports/receipt-issue",
    icon: History,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Báo cáo Tồn kho Snapshot",
    description: "Thống kê chính xác số lượng và giá trị tài sản đang lưu kho tại một thời điểm cụ thể.",
    href: "/reports/inventory",
    icon: PieChart,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Báo cáo Hiệu suất Sản phẩm",
    description: "Top các sản phẩm có tốc độ luân chuyển nhanh hoặc chậm nhất trong kho.",
    href: "#",
    icon: FileBarChart,
    color: "text-warning",
    bg: "bg-warning/10",
    disabled: true,
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mt-2">Trung tâm Báo cáo</h1>
        <p className="text-sm text-text-secondary">Chọn loại báo cáo bạn muốn xem hoặc kết xuất dữ liệu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportModules.map((report) => (
          <Link
            key={report.title}
            href={report.href}
            className={cn(
              "group relative flex flex-col p-6 bg-white rounded-2xl border border-border-ui shadow-sm transition-all duration-300",
              report.disabled 
                ? "opacity-60 cursor-not-allowed" 
                : "hover:shadow-xl hover:border-accent hover:-translate-y-1 cursor-pointer"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300", report.bg, report.color)}>
              <report.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
              {report.title}
            </h3>
            
            <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">
              {report.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-ui/50">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {report.disabled ? "Sắp ra mắt" : "Xem chi tiết"}
              </span>
              {!report.disabled && (
                <div className="w-8 h-8 rounded-full bg-background-app flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Tips / Info */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex gap-4 items-start">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-accent/10">
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">Mẹo nhỏ</h4>
          <p className="text-sm text-text-secondary mt-1">
            Bạn có thể xuất tất cả các báo cáo ra định dạng <strong>Excel (.xlsx)</strong> hoặc <strong>PDF</strong> để phục vụ lưu trữ vật lý hoặc gửi cho các bên liên quan.
          </p>
        </div>
      </div>
    </div>
  );
}
