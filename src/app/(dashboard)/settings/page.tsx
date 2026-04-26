"use client";

import React from "react";
import {
  Bell,
  Building2,
  Database,
  KeyRound,
  Mail,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "general", label: "Thông tin kho", icon: Warehouse },
  { id: "alerts", label: "Cảnh báo", icon: Bell },
  { id: "security", label: "Bảo mật", icon: ShieldCheck },
  { id: "integrations", label: "Tích hợp", icon: Database },
] as const;

type SettingsTab = (typeof tabs)[number]["id"];

const inputClassName =
  "w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors";
const labelClassName = "text-xs text-text-secondary font-semibold";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("general");

  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Cài đặt hệ thống
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Cấu hình thông tin kho, cảnh báo, bảo mật và tích hợp dữ liệu
          </p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20">
          <Save className="w-4 h-4" /> Lưu cấu hình
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <aside className="xl:col-span-3 bg-card-white rounded-xl border border-border-ui shadow-sm p-3 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-text-secondary hover:bg-background-app hover:text-text-primary",
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="xl:col-span-9 space-y-5">
          {activeTab === "general" && (
            <section className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" /> Thông tin kho
                  vận
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Dữ liệu này dùng cho header phiếu nhập/xuất và báo cáo in ấn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClassName}>Tên hệ thống</label>
                  <input defaultValue="WMS System" className={inputClassName} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>Mã kho</label>
                  <input defaultValue="WMS-LS-001" className={inputClassName} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>Tên kho</label>
                  <input
                    defaultValue="Kho cửa khẩu Lạng Sơn"
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>Email quản trị</label>
                  <input
                    defaultValue="admin@wms.com"
                    className={inputClassName}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className={labelClassName}>Địa chỉ kho</label>
                  <textarea
                    defaultValue="Khu logistics cửa khẩu, Lạng Sơn"
                    rows={3}
                    className={cn(inputClassName, "resize-none")}
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === "alerts" && (
            <section className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning" /> Thiết lập cảnh báo
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Cấu hình ngưỡng thông báo cho tồn kho, phiếu chờ duyệt và
                  email vận hành.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClassName}>
                    Cảnh báo tồn thấp trước
                  </label>
                  <input
                    defaultValue="100"
                    type="number"
                    className={inputClassName}
                  />
                  <p className="text-[11px] text-text-secondary">
                    Tính theo phần trăm so với minStock
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>
                    Phiếu chờ duyệt quá hạn
                  </label>
                  <input
                    defaultValue="24"
                    type="number"
                    className={inputClassName}
                  />
                  <p className="text-[11px] text-text-secondary">Đơn vị: giờ</p>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>Tần suất tổng hợp</label>
                  <select defaultValue="daily" className={inputClassName}>
                    <option value="realtime">Realtime</option>
                    <option value="daily">Hằng ngày</option>
                    <option value="weekly">Hằng tuần</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Gửi email khi hàng hết tồn",
                  "Gửi thông báo khi phiếu nhập quá hạn",
                  "Gửi thông báo khi phiếu xuất bị từ chối",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border-ui bg-background-app/40"
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-border-ui accent-accent"
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {activeTab === "security" && (
            <section className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-success" /> Bảo mật truy
                  cập
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Các thiết lập này áp dụng cho phiên đăng nhập và chính sách
                  mật khẩu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClassName}>
                    Thời hạn access token
                  </label>
                  <input
                    defaultValue="15"
                    type="number"
                    className={inputClassName}
                  />
                  <p className="text-[11px] text-text-secondary">
                    Đơn vị: phút
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>
                    Thời hạn refresh token
                  </label>
                  <input
                    defaultValue="7"
                    type="number"
                    className={inputClassName}
                  />
                  <p className="text-[11px] text-text-secondary">
                    Đơn vị: ngày
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>Số lần đăng nhập sai</label>
                  <input
                    defaultValue="5"
                    type="number"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border-ui bg-background-app/40">
                  <KeyRound className="w-5 h-5 text-warning mb-3" />
                  <p className="text-sm font-bold text-text-primary">
                    Yêu cầu đổi mật khẩu định kỳ
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Nhắc người dùng đổi mật khẩu sau 90 ngày.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border-ui bg-background-app/40">
                  <ShieldCheck className="w-5 h-5 text-success mb-3" />
                  <p className="text-sm font-bold text-text-primary">
                    Khóa phiên khi không hoạt động
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Tự động đăng xuất sau thời gian không thao tác.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "integrations" && (
            <section className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-info" /> Tích hợp
                  và xuất dữ liệu
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Thiết lập webhook, email SMTP và định dạng export mặc định.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClassName}>Webhook URL</label>
                  <input
                    placeholder="https://example.com/webhook/wms"
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>
                    Định dạng báo cáo mặc định
                  </label>
                  <select defaultValue="xlsx" className={inputClassName}>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>SMTP Host</label>
                  <input
                    placeholder="smtp.company.vn"
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClassName}>Email gửi thông báo</label>
                  <input
                    placeholder="no-reply@wms.com"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-info/20 bg-info/5 p-4">
                <Mail className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    Lưu ý bảo mật
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Không hardcode API key hoặc SMTP password trong frontend; dữ
                    liệu nhạy cảm phải nằm ở backend hoặc biến môi trường
                    server-side.
                  </p>
                </div>
              </div>
            </section>
          )}

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex items-center justify-end gap-3">
            <button className="px-4 py-2 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-colors">
              Khôi phục mặc định
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors">
              <Save className="w-4 h-4" /> Lưu thay đổi
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
