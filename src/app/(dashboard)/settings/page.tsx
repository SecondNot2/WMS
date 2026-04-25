"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Cài đặt hệ thống</h1>
          <p className="text-xs text-text-secondary mt-0.5">Cấu hình thông tin kho và các thiết lập chung</p>
        </div>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent" />
            Thông tin cơ bản
          </h3>
          <div className="space-y-3">
             <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium">Tên hệ thống</label>
                <input defaultValue="WMS System" className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent" />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs text-text-secondary font-medium">Email quản trị</label>
                <input defaultValue="admin@wms.com" className="w-full px-3 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent" />
             </div>
          </div>
          <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-accent/90">Lưu cấu hình</button>
        </div>
      </div>
    </div>
  );
}
