"use client";

import { useAuthStore } from "@/lib/store";
import type { Role } from "@wms/types";

// ─────────────────────────────────────────
// ROLE LABELS (centralized — thay cho 7 chỗ duplicate)
// ─────────────────────────────────────────

// Dùng Record<string, string> để có thể index bằng `string`
// (vd: RoleEntity.name từ DB) mà không cần cast.
// Vẫn ép typed cho 3 role cố định ở từ điển khởi tạo.
export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
} satisfies Record<Role, string>;

export const labelOfRole = (role: string): string => ROLE_LABELS[role] ?? role;

// ─────────────────────────────────────────
// PERMISSIONS MATRIX
// Action key dạng `<resource>.<action>` — single source of truth
// ─────────────────────────────────────────

export const PERMISSIONS = {
  // Products
  "product.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "product.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "product.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "product.delete": ["ADMIN"],
  "product.import": ["ADMIN", "WAREHOUSE_STAFF"],
  "product.adjustStock": ["ADMIN", "WAREHOUSE_STAFF"],

  // Categories
  "category.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "category.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "category.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "category.delete": ["ADMIN"],

  // Inbound (goods receipts)
  "receipt.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "receipt.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.approve": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.reject": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.delete": ["ADMIN"],

  // Outbound (goods issues)
  "issue.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "issue.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.approve": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.reject": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.delete": ["ADMIN"],

  // Inventory / Stock
  "stock.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "stock.adjust": ["ADMIN", "WAREHOUSE_STAFF"],

  // Suppliers
  "supplier.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "supplier.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "supplier.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "supplier.delete": ["ADMIN"],

  // Recipients
  "recipient.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "recipient.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "recipient.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "recipient.delete": ["ADMIN"],

  // Reports
  "report.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "report.export": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],

  // Users (ADMIN only)
  "user.view": ["ADMIN"],
  "user.create": ["ADMIN"],
  "user.update": ["ADMIN"],
  "user.delete": ["ADMIN"],

  // Roles (ADMIN only)
  "role.view": ["ADMIN"],
  "role.create": ["ADMIN"],
  "role.update": ["ADMIN"],
  "role.delete": ["ADMIN"],

  // Activity logs
  "activityLog.view": ["ADMIN"],
} as const satisfies Record<string, readonly Role[]>;

export type PermissionAction = keyof typeof PERMISSIONS;

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

/** Pure check — dùng được ở mọi nơi (không cần React) */
export function can(
  role: Role | null | undefined,
  action: PermissionAction,
): boolean {
  if (!role) return false;
  return (PERMISSIONS[action] as readonly Role[]).includes(role);
}

/** Trả về danh sách role được phép (dùng để show trong tooltip / message) */
export function rolesAllowedFor(action: PermissionAction): readonly Role[] {
  return PERMISSIONS[action];
}

/** Format danh sách roles thành text tiếng Việt */
export function formatAllowedRoles(action: PermissionAction): string {
  return rolesAllowedFor(action)
    .map((r) => ROLE_LABELS[r])
    .join(", ");
}

// ─────────────────────────────────────────
// React hook
// ─────────────────────────────────────────

export function useCurrentRole(): Role | null {
  return useAuthStore((s) => s.user?.role ?? null);
}

export function usePermission(action: PermissionAction): boolean {
  const role = useCurrentRole();
  return can(role, action);
}
