import type { AuthUser, Role, RolePermissions } from "@wms/types";

export const CORE_ROLES = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] as const;
export type CoreRole = (typeof CORE_ROLES)[number];

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
} satisfies Record<CoreRole, string>;

export const PERMISSIONS = {
  "product.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "product.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "product.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "product.delete": ["ADMIN"],
  "product.import": ["ADMIN", "WAREHOUSE_STAFF"],
  "product.adjustStock": ["ADMIN", "WAREHOUSE_STAFF"],
  "category.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "category.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "category.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "category.delete": ["ADMIN"],
  "category.import": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "receipt.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.approve": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.reject": ["ADMIN", "WAREHOUSE_STAFF"],
  "receipt.delete": ["ADMIN"],
  "receipt.export": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "issue.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "issue.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.approve": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.reject": ["ADMIN", "WAREHOUSE_STAFF"],
  "issue.delete": ["ADMIN"],
  "issue.export": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "stock.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "stock.adjust": ["ADMIN", "WAREHOUSE_STAFF"],
  "supplier.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "supplier.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "supplier.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "supplier.delete": ["ADMIN"],
  "recipient.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "recipient.create": ["ADMIN", "WAREHOUSE_STAFF"],
  "recipient.update": ["ADMIN", "WAREHOUSE_STAFF"],
  "recipient.delete": ["ADMIN"],
  "report.view": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "report.export": ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"],
  "user.view": ["ADMIN"],
  "user.create": ["ADMIN"],
  "user.update": ["ADMIN"],
  "user.delete": ["ADMIN"],
  "role.view": ["ADMIN"],
  "role.create": ["ADMIN"],
  "role.update": ["ADMIN"],
  "role.delete": ["ADMIN"],
  "activityLog.view": ["ADMIN"],
} as const satisfies Record<string, readonly CoreRole[]>;

export type PermissionAction = keyof typeof PERMISSIONS;

const ACTION_TO_STORED: Record<
  PermissionAction,
  { module: string; actions: string[] }
> = {
  "product.view": { module: "product", actions: ["read"] },
  "product.create": { module: "product", actions: ["write"] },
  "product.update": { module: "product", actions: ["write"] },
  "product.delete": { module: "product", actions: ["delete"] },
  "product.import": { module: "product", actions: ["write"] },
  "product.adjustStock": { module: "product", actions: ["write"] },
  "category.view": { module: "category", actions: ["read"] },
  "category.create": { module: "category", actions: ["write"] },
  "category.update": { module: "category", actions: ["write"] },
  "category.delete": { module: "category", actions: ["delete"] },
  "category.import": { module: "category", actions: ["write"] },
  "receipt.view": { module: "inbound", actions: ["read"] },
  "receipt.create": { module: "inbound", actions: ["write"] },
  "receipt.update": { module: "inbound", actions: ["write"] },
  "receipt.approve": { module: "inbound", actions: ["approve"] },
  "receipt.reject": { module: "inbound", actions: ["approve"] },
  "receipt.delete": { module: "inbound", actions: ["delete"] },
  "receipt.export": { module: "inbound", actions: ["export"] },
  "issue.view": { module: "outbound", actions: ["read"] },
  "issue.create": { module: "outbound", actions: ["write"] },
  "issue.update": { module: "outbound", actions: ["write"] },
  "issue.approve": { module: "outbound", actions: ["approve"] },
  "issue.reject": { module: "outbound", actions: ["approve"] },
  "issue.delete": { module: "outbound", actions: ["delete"] },
  "issue.export": { module: "outbound", actions: ["export"] },
  "stock.view": { module: "inventory", actions: ["read"] },
  "stock.adjust": { module: "inventory", actions: ["write"] },
  "supplier.view": { module: "supplier", actions: ["read"] },
  "supplier.create": { module: "supplier", actions: ["write"] },
  "supplier.update": { module: "supplier", actions: ["write"] },
  "supplier.delete": { module: "supplier", actions: ["delete"] },
  "recipient.view": { module: "recipient", actions: ["read"] },
  "recipient.create": { module: "recipient", actions: ["write"] },
  "recipient.update": { module: "recipient", actions: ["write"] },
  "recipient.delete": { module: "recipient", actions: ["delete"] },
  "report.view": { module: "report", actions: ["read"] },
  "report.export": { module: "report", actions: ["export"] },
  "user.view": { module: "user", actions: ["read"] },
  "user.create": { module: "user", actions: ["write"] },
  "user.update": { module: "user", actions: ["write"] },
  "user.delete": { module: "user", actions: ["delete"] },
  "role.view": { module: "role", actions: ["read"] },
  "role.create": { module: "role", actions: ["write"] },
  "role.update": { module: "role", actions: ["write"] },
  "role.delete": { module: "role", actions: ["delete"] },
  "activityLog.view": { module: "activityLog", actions: ["read"] },
};

export function labelOfRole(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

export function hasStoredPermission(
  permissions: RolePermissions | null | undefined,
  action: PermissionAction,
): boolean {
  if (!permissions) return false;
  if (permissions["*"]?.includes("*")) return true;
  const required = ACTION_TO_STORED[action];
  if (!required) return false;
  return required.actions.some((a) =>
    permissions[required.module]?.includes(a),
  );
}

export function can(
  subject: Role | AuthUser | null | undefined,
  action: PermissionAction,
): boolean {
  if (!subject) return false;
  if (typeof subject === "string") {
    return (PERMISSIONS[action] as readonly string[]).includes(subject);
  }
  if (hasStoredPermission(subject.permissions, action)) return true;
  return (PERMISSIONS[action] as readonly string[]).includes(subject.role);
}

export function rolesAllowedFor(action: PermissionAction): readonly CoreRole[] {
  return PERMISSIONS[action];
}

export function formatAllowedRoles(action: PermissionAction): string {
  return rolesAllowedFor(action)
    .map((r) => ROLE_LABELS[r])
    .join(", ");
}
