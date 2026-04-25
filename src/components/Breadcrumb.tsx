"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeMap: Record<string, string> = {
  products: "Sản phẩm",
  new: "Thêm mới",
  import: "Nhập Excel",
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
};

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((item) => item !== "" && item !== "(dashboard)");

  return (
    <nav className="flex items-center space-x-2 text-[18px] font-semibold">
      <Link href="/" className="text-text-secondary hover:text-accent transition-colors flex items-center">
        <Home className="w-4.5 h-4.5" />
      </Link>
      
      {pathSegments.length > 0 && (
        <ChevronRight className="w-4 h-4 text-text-secondary/50 shrink-0" />
      )}

      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const label = routeMap[segment] || segment;
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

        if (isLast) {
          return (
            <span key={segment} className="text-text-primary truncate max-w-50">
              {label}
            </span>
          );
        }

        return (
          <React.Fragment key={segment}>
            <Link 
              href={href}
              className="text-text-secondary hover:text-accent transition-colors truncate max-w-37.5"
            >
              {label}
            </Link>
            <ChevronRight className="w-4 h-4 text-text-secondary/50 shrink-0" />
          </React.Fragment>
        );
      })}
    </nav>
  );
}
