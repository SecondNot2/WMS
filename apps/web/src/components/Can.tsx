"use client";

import React from "react";
import {
  usePermission,
  formatAllowedRoles,
  type PermissionAction,
} from "@/lib/permissions";

interface CanProps {
  /** Action key — phải có trong PERMISSIONS matrix */
  action: PermissionAction;
  /** Mặc định `hide`: ẩn hoàn toàn nếu không đủ quyền.
   *  `disable`: vẫn render nhưng disable + thêm tooltip. */
  mode?: "hide" | "disable";
  /** UI hiển thị khi không đủ quyền (chỉ dùng với `mode="hide"`) */
  fallback?: React.ReactNode;
  /** Element con — nếu là single React element và `mode="disable"`,
   *  sẽ tự inject `disabled` + `title` tooltip */
  children: React.ReactNode;
}

/**
 * Wrap action UI để gating theo quyền.
 *
 * @example
 *   <Can action="receipt.approve">
 *     <Button onClick={handleApprove}>Duyệt phiếu</Button>
 *   </Can>
 *
 * @example  // disable + tooltip
 *   <Can action="receipt.approve" mode="disable">
 *     <Button onClick={handleApprove}>Duyệt phiếu</Button>
 *   </Can>
 */
export function Can({
  action,
  mode = "hide",
  fallback = null,
  children,
}: CanProps) {
  const allowed = usePermission(action);

  if (allowed) return <>{children}</>;

  if (mode === "hide") return <>{fallback}</>;

  // mode === "disable" → clone single child với disabled + title
  if (React.isValidElement(children)) {
    const tooltip = `Chỉ ${formatAllowedRoles(action)} mới có quyền thao tác này`;
    const child = children as React.ReactElement<
      Record<string, unknown> & { className?: string }
    >;
    return React.cloneElement(child, {
      disabled: true,
      "aria-disabled": true,
      title: tooltip,
      className: [child.props.className, "opacity-50 cursor-not-allowed"]
        .filter(Boolean)
        .join(" "),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      },
    });
  }

  return <>{children}</>;
}
