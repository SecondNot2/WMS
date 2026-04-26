"use client";

import React from "react";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  { key: "product", label: "Sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "receipt", label: "Nhập kho" },
  { key: "issue", label: "Xuất kho" },
  { key: "stock", label: "Tồn kho" },
  { key: "report", label: "Báo cáo" },
  { key: "user", label: "Người dùng" },
  { key: "role", label: "Vai trò" },
];

const actions = [
  { key: "read", label: "Xem" },
  { key: "write", label: "Tạo/Sửa" },
  { key: "delete", label: "Xóa" },
  { key: "approve", label: "Duyệt" },
  { key: "export", label: "Xuất" },
];

interface PermissionMatrixProps {
  editable?: boolean;
  role?: "ADMIN" | "WAREHOUSE_STAFF" | "ACCOUNTANT";
}

const hasPermission = (role: PermissionMatrixProps["role"], moduleKey: string, actionKey: string) => {
  if (role === "ADMIN") return true;
  if (role === "WAREHOUSE_STAFF") {
    return ["product", "category", "receipt", "issue", "stock"].includes(moduleKey) && ["read", "write"].includes(actionKey);
  }
  if (role === "ACCOUNTANT") {
    return ["product", "stock", "report"].includes(moduleKey) && ["read", "export"].includes(actionKey);
  }
  return ["read"].includes(actionKey);
};

export function PermissionMatrix({ editable = false, role = "ADMIN" }: PermissionMatrixProps) {
  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border-ui">
        <h3 className="text-sm font-semibold text-text-primary">Ma trận phân quyền</h3>
        <p className="text-xs text-text-secondary mt-1">Quyền được lưu dạng JSON permissions trên Role</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-180">
          <thead className="bg-background-app/50 border-b border-border-ui">
            <tr>
              <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Module</th>
              {actions.map((action) => (
                <th key={action.key} className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">{action.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {modules.map((module) => (
              <tr key={module.key} className="hover:bg-background-app/30 transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-text-primary">{module.label}</td>
                {actions.map((action) => {
                  const enabled = hasPermission(role, module.key, action.key);
                  return (
                    <td key={action.key} className="px-5 py-4 text-center">
                      {editable ? (
                        <input type="checkbox" defaultChecked={enabled} className="rounded border-border-ui accent-accent" />
                      ) : (
                        <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full", enabled ? "bg-success/10 text-success" : "bg-background-app text-text-secondary")}>
                          {enabled ? <CheckCircle2 className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
