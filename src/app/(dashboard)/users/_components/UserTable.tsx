"use client";

import React from "react";
import Link from "next/link";
import { Eye, Lock, Pencil, Trash2, Unlock, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "WAREHOUSE_STAFF" | "ACCOUNTANT";
  avatar: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

const ROLE_LABELS = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
};

const ROLE_STYLES = {
  ADMIN: "bg-info/10 text-info",
  WAREHOUSE_STAFF: "bg-accent/10 text-accent",
  ACCOUNTANT: "bg-success/10 text-success",
};

const mockUsers: UserRow[] = [
  { id: "1", name: "Nguyễn Văn A", email: "admin@wms.com", role: "ADMIN", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", isActive: true, lastLogin: "Hôm nay, 08:30", createdAt: "10/01/2024" },
  { id: "2", name: "Trần Thị B", email: "warehouse@wms.com", role: "WAREHOUSE_STAFF", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", isActive: true, lastLogin: "Hôm qua, 17:20", createdAt: "15/01/2024" },
  { id: "3", name: "Lê Văn C", email: "accountant@wms.com", role: "ACCOUNTANT", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella", isActive: true, lastLogin: "17/05/2024 09:45", createdAt: "20/01/2024" },
  { id: "4", name: "Phạm Minh D", email: "staff.locked@wms.com", role: "WAREHOUSE_STAFF", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max", isActive: false, lastLogin: "01/05/2024 11:00", createdAt: "05/02/2024" },
];

export function UserTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [confirmUser, setConfirmUser] = React.useState<UserRow | null>(null);

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-220">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Người dùng</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Vai trò</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Ngày tạo</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background-app/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-border-ui bg-background-app" />
                      <div>
                        <Link href={`/users/${user.id}`} className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors">{user.name}</Link>
                        <p className="text-[11px] text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold", ROLE_STYLES[user.role])}>{ROLE_LABELS[user.role]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit", user.isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/users/${user.id}`} className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors" title="Xem chi tiết"><Eye className="w-4 h-4" /></Link>
                      <Link href={`/users/${user.id}/edit`} className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors" title="Chỉnh sửa"><Pencil className="w-4 h-4" /></Link>
                      <button onClick={() => setConfirmUser(user)} className={cn("p-1.5 rounded-md transition-colors", user.isActive ? "hover:bg-danger/10 text-danger" : "hover:bg-success/10 text-success")} title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
                        {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={5} pageSize={pageSize} totalItems={42} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      <ConfirmDialog
        isOpen={confirmUser !== null}
        onClose={() => setConfirmUser(null)}
        onConfirm={() => console.log("Toggle user", confirmUser?.id)}
        title={confirmUser?.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={confirmUser?.isActive ? "Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa." : "Người dùng sẽ có thể đăng nhập và thao tác theo quyền được gán."}
        confirmLabel={confirmUser?.isActive ? "Khóa tài khoản" : "Mở khóa"}
        variant={confirmUser?.isActive ? "danger" : "info"}
      />
    </div>
  );
}
