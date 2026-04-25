"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileUp,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  FileSpreadsheet,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const steps = [
    { id: 1, label: "Tải lên file Excel", icon: FileUp },
    { id: 2, label: "Kiểm tra dữ liệu", icon: FileSpreadsheet },
    { id: 3, label: "Kết quả nhập", icon: CheckCircle2 },
  ];

  return (
    <div className="bg-card-white rounded-2xl border border-border-ui shadow-sm overflow-hidden w-full transition-all duration-500">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border-ui flex items-center justify-between bg-white">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            Quy trình nhập dữ liệu
          </h3>
          <p className="text-xs text-text-secondary">
            Vui lòng thực hiện theo các bước dưới đây để đảm bảo dữ liệu chính
            xác
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-12 py-8 bg-background-app/20 border-b border-border-ui">
        <div className="flex items-center justify-between relative max-w-4xl mx-auto">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border-ui z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-accent transition-all duration-500 z-0"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((s) => (
            <div
              key={s.id}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  step === s.id
                    ? "bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-110"
                    : step > s.id
                      ? "bg-success border-success text-white"
                      : "bg-white border-border-ui text-text-secondary",
                )}
              >
                {step > s.id ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-bold uppercase tracking-wider",
                  step === s.id
                    ? "text-accent"
                    : step > s.id
                      ? "text-success"
                      : "text-text-secondary",
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 min-h-100 flex flex-col items-center justify-center">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500">
            {/* Upload Area */}
            <div className="space-y-6">
              <div className="aspect-video bg-background-app/50 border-3 border-dashed border-border-ui rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-accent/5 hover:border-accent transition-all group relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-lg font-bold text-text-primary">
                  Tải file lên hệ thống
                </h4>
                <p className="text-sm text-text-secondary mt-1">
                  Kéo thả file .xlsx hoặc .xls vào đây
                </p>
                <button className="mt-6 px-6 py-2 bg-white border border-border-ui text-sm font-bold text-text-primary rounded-xl shadow-sm group-hover:border-accent group-hover:text-accent transition-colors">
                  Duyệt file từ máy tính
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[12px] leading-relaxed">
                  Hệ thống hỗ trợ nhập tối đa{" "}
                  <span className="font-bold">5.000 dòng</span> dữ liệu mỗi lần.
                  Các dòng trùng lặp mã SKU sẽ được bỏ qua hoặc ghi đè tùy chọn.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-8 py-4">
              <div>
                <h4 className="text-md font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-accent rounded-full" />
                  Hướng dẫn chuẩn bị dữ liệu
                </h4>
                <ul className="space-y-4">
                  {[
                    "Sử dụng đúng file mẫu do hệ thống cung cấp.",
                    "Không thay đổi tên cột hoặc thứ tự các cột.",
                    "Các trường đánh dấu sao (*) là bắt buộc.",
                    "Đảm bảo mã SKU là duy nhất cho mỗi sản phẩm.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-card-white border border-border-ui rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-text-primary">
                      File mẫu nhập liệu
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      Version 2.0 (Cập nhật 20/05/2024)
                    </p>
                  </div>
                  <button className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-accent text-white font-bold rounded-xl shadow-xl shadow-accent/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Tiếp tục kiểm tra dữ liệu <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Tổng số dòng",
                  value: "152",
                  color: "text-text-primary",
                  bg: "bg-background-app",
                },
                {
                  label: "Dòng hợp lệ",
                  value: "148",
                  color: "text-success",
                  bg: "bg-success/5",
                },
                {
                  label: "Dòng có lỗi",
                  value: "4",
                  color: "text-danger",
                  bg: "bg-danger/5",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-6 rounded-2xl border border-border-ui shadow-sm",
                    item.bg,
                  )}
                >
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className={cn("text-3xl font-black mt-2", item.color)}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border-ui rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border-ui bg-background-app/30 flex items-center justify-between">
                <h4 className="text-sm font-bold text-text-primary">
                  Chi tiết các dòng dữ liệu
                </h4>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white border border-border-ui rounded-full text-[10px] font-bold text-text-secondary flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-success" /> Hợp lệ
                  </span>
                  <span className="px-3 py-1 bg-white border border-border-ui rounded-full text-[10px] font-bold text-text-secondary flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-danger" /> Lỗi
                  </span>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white sticky top-0 border-b border-border-ui">
                    <tr className="text-[11px] font-bold text-text-secondary uppercase">
                      <th className="px-6 py-3 w-20 text-center">Dòng</th>
                      <th className="px-6 py-3">Mã SKU</th>
                      <th className="px-6 py-3">Tên sản phẩm</th>
                      <th className="px-6 py-3">Trạng thái</th>
                      <th className="px-6 py-3">Ghi chú lỗi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-ui">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr
                        key={i}
                        className={cn(
                          "hover:bg-background-app/20 transition-colors",
                          i === 2 ? "bg-danger/5" : "",
                        )}
                      >
                        <td className="px-6 py-4 text-center font-medium text-text-secondary">
                          {i}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          SP-000{i}
                        </td>
                        <td className="px-6 py-4 text-text-primary font-medium">
                          Sản phẩm mẫu số {i}
                        </td>
                        <td className="px-6 py-4">
                          {i === 2 ? (
                            <span className="text-danger font-bold text-[11px] flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Thất bại
                            </span>
                          ) : (
                            <span className="text-success font-bold text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hợp lệ
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-text-secondary">
                          {i === 2 ? "Mã SKU đã tồn tại trong hệ thống" : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-white border border-border-ui text-text-primary font-bold rounded-xl hover:bg-background-app transition-all"
              >
                Hủy và tải lại
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-12 py-3 bg-accent text-white font-bold rounded-xl shadow-xl shadow-accent/20 flex items-center gap-2 hover:scale-105 transition-all"
              >
                Xác nhận nhập 148 sản phẩm <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 w-full max-w-2xl text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="relative">
              <div className="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-2xl relative z-10">
                <CheckCircle2 className="w-16 h-16 text-success animate-bounce" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-success/5 rounded-full animate-ping" />
            </div>

            <div className="space-y-3">
              <h4 className="text-3xl font-black text-text-primary tracking-tight">
                Thành công rực rỡ!
              </h4>
              <p className="text-lg text-text-secondary">
                Hệ thống đã ghi nhận thêm{" "}
                <span className="text-success font-black">148</span> sản phẩm
                mới.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 bg-background-app/50 rounded-2xl border border-border-ui">
                <p className="text-[10px] font-bold text-text-secondary uppercase">
                  Thời gian
                </p>
                <p className="text-sm font-bold text-text-primary">1.2s</p>
              </div>
              <div className="p-4 bg-background-app/50 rounded-2xl border border-border-ui">
                <p className="text-[10px] font-bold text-text-secondary uppercase">
                  Dung lượng
                </p>
                <p className="text-sm font-bold text-text-primary">2.4 MB</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-white border border-border-ui text-text-primary font-bold rounded-xl hover:bg-background-app transition-all"
              >
                Nhập thêm tệp khác
              </button>
              <Link
                href="/products"
                className="px-12 py-3 bg-accent text-white font-bold rounded-xl shadow-xl shadow-accent/20 transition-all hover:scale-105 flex items-center justify-center"
              >
                Về danh sách
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
