"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import {
  can,
  useCurrentRole,
  formatAllowedRoles,
  ROLE_LABELS,
  type PermissionAction,
} from "@/lib/permissions";

interface PermissionDeniedProps {
  /** Action mà user thiếu quyền — dùng để show role được phép */
  action?: PermissionAction;
  /** Tiêu đề tùy chỉnh */
  title?: string;
  /** Mô tả tùy chỉnh */
  description?: string;
  /** Đường dẫn quay lại (mặc định "/") */
  backHref?: string;
  /** Label nút quay lại */
  backLabel?: string;
}

/**
 * Empty state full-page cho trường hợp user vào trang/section không có quyền.
 *
 * @example
 *   <PageGuard action="user.view">
 *     <UserListPage />
 *   </PageGuard>
 *
 *   // hoặc dùng trực tiếp:
 *   if (!can(role, 'user.view')) return <PermissionDenied action="user.view" />
 */
export function PermissionDenied({
  action,
  title = "Không có quyền truy cập",
  description,
  backHref = "/",
  backLabel = "Quay lại Dashboard",
}: PermissionDeniedProps) {
  const role = useCurrentRole();
  const roleLabel = role ? ROLE_LABELS[role] : "—";

  const defaultDesc = action
    ? `Tài khoản của bạn (vai trò ${roleLabel}) không được phép xem nội dung này. Chỉ ${formatAllowedRoles(action)} mới có quyền truy cập. Vui lòng liên hệ Quản trị viên nếu bạn cần quyền này.`
    : `Tài khoản của bạn (vai trò ${roleLabel}) không có quyền truy cập trang này. Vui lòng liên hệ Quản trị viên.`;

  return (
    <div className="flex flex-1 items-center justify-center p-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-warning" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            {description ?? defaultDesc}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

interface PageGuardProps {
  action: PermissionAction;
  children: React.ReactNode;
  /** UI tùy chỉnh khi không đủ quyền (mặc định: <PermissionDenied />) */
  fallback?: React.ReactNode;
}

/**
 * Bọc cả 1 page/route — nếu thiếu quyền thì render <PermissionDenied />
 * thay cho redirect im lặng.
 */
export function PageGuard({ action, children, fallback }: PageGuardProps) {
  const role = useCurrentRole();
  if (!can(role, action)) {
    return <>{fallback ?? <PermissionDenied action={action} />}</>;
  }
  return <>{children}</>;
}
