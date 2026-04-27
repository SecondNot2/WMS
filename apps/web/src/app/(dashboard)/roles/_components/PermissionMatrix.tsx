"use client";

import React from "react";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RolePermissions } from "@wms/types";

const MODULES = [
  { key: "product", label: "Sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "inbound", label: "Nhập kho" },
  { key: "outbound", label: "Xuất kho" },
  { key: "inventory", label: "Tồn kho" },
  { key: "report", label: "Báo cáo" },
  { key: "user", label: "Người dùng" },
  { key: "role", label: "Vai trò" },
];

const ACTIONS = [
  { key: "read", label: "Xem" },
  { key: "write", label: "Tạo/Sửa" },
  { key: "delete", label: "Xóa" },
  { key: "approve", label: "Duyệt" },
  { key: "export", label: "Xuất" },
];

interface PermissionMatrixProps {
  permissions: RolePermissions;
  onChange?: (next: RolePermissions) => void;
}

function isWildcard(perms: RolePermissions): boolean {
  return !!perms["*"]?.includes("*");
}

function isAllowed(
  perms: RolePermissions,
  moduleKey: string,
  actionKey: string,
): boolean {
  if (isWildcard(perms)) return true;
  return !!perms[moduleKey]?.includes(actionKey);
}

function expandWildcard(): RolePermissions {
  const next: RolePermissions = {};
  for (const m of MODULES) next[m.key] = ACTIONS.map((a) => a.key);
  return next;
}

function togglePermission(
  perms: RolePermissions,
  moduleKey: string,
  actionKey: string,
): RolePermissions {
  let next: RolePermissions = isWildcard(perms)
    ? expandWildcard()
    : { ...perms };
  const current = next[moduleKey] ?? [];
  if (current.includes(actionKey)) {
    const filtered = current.filter((a) => a !== actionKey);
    if (filtered.length === 0) {
      const { [moduleKey]: _, ...rest } = next;
      next = rest;
    } else {
      next[moduleKey] = filtered;
    }
  } else {
    next[moduleKey] = [...current, actionKey];
  }
  return next;
}

export function PermissionMatrix({
  permissions,
  onChange,
}: PermissionMatrixProps) {
  const editable = !!onChange;
  const wildcard = isWildcard(permissions);

  const handleToggle = (moduleKey: string, actionKey: string) => {
    if (!onChange) return;
    onChange(togglePermission(permissions, moduleKey, actionKey));
  };

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border-ui">
        <h3 className="text-sm font-semibold text-text-primary">
          Ma trận phân quyền
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          {wildcard
            ? "Vai trò này có toàn quyền (*:*)"
            : "Quyền được lưu dạng JSON permissions trên Role"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-180">
          <thead className="bg-background-app/50 border-b border-border-ui">
            <tr>
              <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Module
              </th>
              {ACTIONS.map((action) => (
                <th
                  key={action.key}
                  className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center"
                >
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {MODULES.map((module) => (
              <tr
                key={module.key}
                className="hover:bg-background-app/30 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-bold text-text-primary">
                  {module.label}
                </td>
                {ACTIONS.map((action) => {
                  const enabled = isAllowed(permissions, module.key, action.key);
                  return (
                    <td key={action.key} className="px-5 py-4 text-center">
                      {editable ? (
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handleToggle(module.key, action.key)}
                          className="rounded border-border-ui accent-accent w-4 h-4"
                        />
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-full",
                            enabled
                              ? "bg-success/10 text-success"
                              : "bg-background-app text-text-secondary",
                          )}
                        >
                          {enabled ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <MinusCircle className="w-4 h-4" />
                          )}
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

// Helper exposed for callers (form, detail) tính số quyền bật.
export function countPermissions(perms: RolePermissions): number {
  if (isWildcard(perms)) return MODULES.length * ACTIONS.length;
  return Object.values(perms).reduce((sum, arr) => sum + arr.length, 0);
}
