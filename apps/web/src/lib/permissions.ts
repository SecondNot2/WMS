"use client";

import { useAuthStore } from "@/lib/store";
import type { Role } from "@wms/types";
export {
  can,
  formatAllowedRoles,
  labelOfRole,
  PERMISSIONS,
  ROLE_LABELS,
  rolesAllowedFor,
  type PermissionAction,
} from "@/lib/permission-core";
import { can as canCore, type PermissionAction } from "@/lib/permission-core";

// ─────────────────────────────────────────
// React hook
// ─────────────────────────────────────────

export function useCurrentRole(): Role | null {
  return useAuthStore((s) => s.user?.role ?? null);
}

export function usePermission(action: PermissionAction): boolean {
  const user = useAuthStore((s) => s.user);
  return canCore(user, action);
}
