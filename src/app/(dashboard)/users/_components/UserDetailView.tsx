"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Lock, Mail, Pencil, Shield, UserRound } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface UserDetailViewProps {
  id: string;
}

export function UserDetailView({ id }: UserDetailViewProps) {
  const [isLockOpen, setIsLockOpen] = React.useState(false);
  const user = {
    id,
    name: "Nguyễn Văn A",
    email: "admin@wms.com",
    role: "Quản trị viên",
    isActive: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    createdAt: "10/01/2024 08:00",
    lastLogin: "Hôm nay, 08:30",
  };

  const activities = [
    { action: "Duyệt phiếu nhập", target: "PNK-2024-0056", time: "17/05/2024 09:30" },
    { action: "Cập nhật sản phẩm", target: "SP000456", time: "16/05/2024 14:22" },
    { action: "Tạo người dùng", target: "Trần Thị B", time: "15/05/2024 10:10" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/users" className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary mt-2">Chi tiết người dùng</h1>
            <p className="text-sm text-text-secondary">Thông tin tài khoản và hoạt động gần đây</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/users/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-card-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm shadow-sm"><Pencil className="w-4 h-4" /> Chỉnh sửa</Link>
          <button onClick={() => setIsLockOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-card-white border border-danger/20 rounded-lg text-danger hover:bg-danger/5 transition-colors font-medium text-sm shadow-sm"><Lock className="w-4 h-4" /> Khóa tài khoản</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 text-center">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border border-border-ui bg-background-app mx-auto" />
            <h2 className="text-xl font-bold text-text-primary mt-4">{user.name}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-info/10 text-info">{user.role}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">Đang hoạt động</span>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-accent" /><div><p className="text-xs text-text-secondary uppercase font-bold">Email</p><p className="text-sm font-semibold text-text-primary">{user.email}</p></div></div>
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-info" /><div><p className="text-xs text-text-secondary uppercase font-bold">Vai trò</p><p className="text-sm font-semibold text-text-primary">{user.role}</p></div></div>
            <div className="flex items-center gap-3"><UserRound className="w-5 h-5 text-success" /><div><p className="text-xs text-text-secondary uppercase font-bold">Ngày tạo</p><p className="text-sm font-semibold text-text-primary">{user.createdAt}</p></div></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-warning" /><div><p className="text-xs text-text-secondary uppercase font-bold">Đăng nhập gần nhất</p><p className="text-sm font-semibold text-text-primary">{user.lastLogin}</p></div></div>
          </div>
        </div>

        <div className="xl:col-span-8 bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border-ui"><h3 className="text-base font-bold text-text-primary">Hoạt động gần đây</h3></div>
          <div className="divide-y divide-border-ui">
            {activities.map((activity) => (
              <div key={`${activity.action}-${activity.time}`} className="p-5 flex items-start gap-3 hover:bg-background-app/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center"><Clock className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{activity.action} <span className="text-accent">{activity.target}</span></p>
                  <p className="text-xs text-text-secondary mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog isOpen={isLockOpen} onClose={() => setIsLockOpen(false)} onConfirm={() => console.log("Lock user", id)} title="Khóa tài khoản" message="Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa." confirmLabel="Khóa tài khoản" variant="danger" />
    </div>
  );
}
