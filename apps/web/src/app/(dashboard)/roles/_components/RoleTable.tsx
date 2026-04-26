"use client";

import React from "react";
import Link from "next/link";
import { Eye, Pencil, Shield, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface RoleRow {
  id: string;
  name: string;
  label: string;
  description: string;
  userCount: number;
  permissionCount: number;
  createdAt: string;
  locked: boolean;
}

const roles: RoleRow[] = [
  { id: "1", name: "ADMIN", label: "Quản trị viên", description: "Toàn quyền hệ thống, duyệt phiếu và quản lý người dùng", userCount: 3, permissionCount: 18, createdAt: "10/01/2024", locked: true },
  { id: "2", name: "WAREHOUSE_STAFF", label: "Thủ kho", description: "Quản lý sản phẩm, lập phiếu nhập/xuất và xem tồn kho", userCount: 27, permissionCount: 10, createdAt: "10/01/2024", locked: true },
  { id: "3", name: "ACCOUNTANT", label: "Kế toán", description: "Xem báo cáo, xuất dữ liệu và tra cứu sản phẩm", userCount: 12, permissionCount: 6, createdAt: "10/01/2024", locked: true },
];

export function RoleTable() {
  const [deleteRole, setDeleteRole] = React.useState<RoleRow | null>(null);

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-200">
          <thead className="bg-background-app/50 border-b border-border-ui">
            <tr>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Vai trò</th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Mô tả</th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">Người dùng</th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">Quyền</th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Ngày tạo</th>
              <th className="px-5 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-background-app/30 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center"><Shield className="w-5 h-5" /></div>
                    <div>
                      <Link href={`/roles/${role.id}`} className="text-sm font-bold text-text-primary hover:text-accent transition-colors">{role.label}</Link>
                      <p className="text-[11px] text-text-secondary font-mono">{role.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary max-w-100"><span className="line-clamp-2">{role.description}</span></td>
                <td className="px-5 py-4 text-center"><span className="text-sm font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">{role.userCount}</span></td>
                <td className="px-5 py-4 text-center"><span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">{role.permissionCount}</span></td>
                <td className="px-5 py-4 text-sm text-text-secondary">{role.createdAt}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/roles/${role.id}`} className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"><Eye className="w-4 h-4" /></Link>
                    <Link href={`/roles/${role.id}/edit`} className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"><Pencil className="w-4 h-4" /></Link>
                    <button disabled={role.locked} onClick={() => setDeleteRole(role)} className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={deleteRole !== null} onClose={() => setDeleteRole(null)} onConfirm={() => console.log("Delete role", deleteRole?.id)} title="Xóa vai trò" message="Bạn chỉ nên xóa vai trò khi không còn người dùng nào đang được gán vai trò này." confirmLabel="Xóa vai trò" variant="danger" />
    </div>
  );
}
