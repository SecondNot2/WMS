"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeMap: Record<string, string> = {
  products: "Sản phẩm",
  new: "Thêm mới",
  edit: "Chỉnh sửa",
  import: "Nhập Excel",
  "stock-history": "Lịch sử tồn kho",
  categories: "Danh mục",
  inbound: "Nhập kho",
  outbound: "Xuất kho",
  inventory: "Tồn kho realtime",
  alerts: "Cảnh báo",
  statistics: "Thống kê",
  reports: "Báo cáo",
  suppliers: "Nhà cung cấp",
  receivers: "Đơn vị nhận hàng",
  users: "Người dùng",
  roles: "Vai trò & Phân quyền",
  "activity-log": "Nhật ký hoạt động",
  settings: "Cài đặt",
  profile: "Tài khoản của tôi",
};

const CUID_RE = /^c[a-z0-9]{20,30}$/i;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isIdSegment(seg: string): boolean {
  if (CUID_RE.test(seg) || UUID_RE.test(seg)) return true;
  // Fallback: not in routeMap, no dash, ≥ 16 chars → coi như id
  return !routeMap[seg] && seg.length >= 16 && !seg.includes("-");
}

interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter((item) => item !== "" && item !== "(dashboard)");

  const crumbs: Crumb[] = [];
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    const next = pathSegments[i + 1];
    const href = `/${pathSegments.slice(0, i + 1).join("/")}`;

    if (isIdSegment(segment)) {
      // Nếu có sub-route phía sau (edit / stock-history) → bỏ qua segment id,
      // để sub-route làm leaf rõ nghĩa hơn.
      if (next && routeMap[next]) continue;
      crumbs.push({ label: "Chi tiết", href });
      continue;
    }

    crumbs.push({ label: routeMap[segment] ?? segment, href });
  }

  return (
    <nav className="flex items-center space-x-2 text-[18px] font-semibold">
      <Link
        href="/"
        className="text-text-secondary hover:text-accent transition-colors flex items-center"
      >
        <Home className="w-4.5 h-4.5" />
      </Link>

      {crumbs.length > 0 && (
        <ChevronRight className="w-4 h-4 text-text-secondary/50 shrink-0" />
      )}

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        if (isLast) {
          return (
            <span
              key={crumb.href}
              className="text-text-primary truncate max-w-50"
            >
              {crumb.label}
            </span>
          );
        }

        return (
          <React.Fragment key={crumb.href}>
            <Link
              href={crumb.href}
              className="text-text-secondary hover:text-accent transition-colors truncate max-w-37.5"
            >
              {crumb.label}
            </Link>
            <ChevronRight className="w-4 h-4 text-text-secondary/50 shrink-0" />
          </React.Fragment>
        );
      })}
    </nav>
  );
}
