"use client";

import React from "react";
import { DashboardTable } from "@/components/DashboardTable";
import { cn } from "@/lib/utils";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Package, 
  FileText, 
  Settings,
  ExternalLink,
  Trash2
} from "lucide-react";
import Link from "next/link";

export function AlertTable() {
  // TODO: Replace with useQuery -> GET /alerts
  const mockAlerts = [
    {
      id: "1",
      type: "STOCK",
      severity: "CRITICAL",
      message: "Sản phẩm 'Chuột không dây Logitech M331' đã hết hàng.",
      targetId: "p1",
      targetCode: "SP001",
      createdAt: "10 phút trước",
      isRead: false,
    },
    {
      id: "2",
      type: "WORKFLOW",
      severity: "WARNING",
      message: "Phiếu nhập kho PNK-2024-0056 đang chờ duyệt hơn 24 giờ.",
      targetId: "r1",
      targetCode: "PNK-2024-0056",
      createdAt: "2 giờ trước",
      isRead: false,
    },
    {
      id: "3",
      type: "SYSTEM",
      severity: "INFO",
      message: "Hệ thống sẽ bảo trì định kỳ vào 23:00 tối nay.",
      targetId: null,
      targetCode: null,
      createdAt: "5 giờ trước",
      isRead: true,
    },
    {
      id: "4",
      type: "STOCK",
      severity: "WARNING",
      message: "Sản phẩm 'Bàn phím cơ Keychron K2' sắp hết hàng (Còn 3).",
      targetId: "p2",
      targetCode: "SP002",
      createdAt: "Hôm qua",
      isRead: true,
    },
  ];

  const TYPE_CONFIG = {
    STOCK: { icon: Package, cls: "text-accent" },
    WORKFLOW: { icon: FileText, cls: "text-warning" },
    SYSTEM: { icon: Settings, cls: "text-text-secondary" },
  };

  const SEVERITY_STYLES = {
    CRITICAL: "bg-danger/10 text-danger border-danger/20",
    WARNING: "bg-warning/10 text-warning border-warning/20",
    INFO: "bg-info/10 text-info border-info/20",
  };

  const columns = [
    {
      header: "Nội dung",
      accessor: "message",
      render: (val: unknown, row: any) => {
        const config = TYPE_CONFIG[row.type as keyof typeof TYPE_CONFIG];
        const Icon = config.icon;
        
        return (
          <div className={cn("flex items-start gap-3", row.isRead ? "opacity-60" : "opacity-100")}>
            <div className={cn("mt-0.5 p-2 rounded-lg bg-background-app", config.cls)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1">
              <p className={cn("text-sm leading-relaxed", !row.isRead ? "font-bold text-text-primary" : "font-medium text-text-secondary")}>
                {val as string}
              </p>
              {row.targetCode && (
                <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">Mã liên quan: {row.targetCode}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Mức độ",
      accessor: "severity",
      render: (val: unknown) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
          SEVERITY_STYLES[val as keyof typeof SEVERITY_STYLES]
        )}>
          {val as string}
        </span>
      )
    },
    {
      header: "Thời gian",
      accessor: "createdAt",
      render: (val: unknown) => <span className="text-xs text-text-secondary font-medium">{val as string}</span>
    },
    {
      header: "",
      accessor: "id",
      render: (val: unknown, row: any) => (
        <div className="flex justify-end gap-2">
          {row.targetId && (
            <Link 
              href={row.type === "STOCK" ? `/products/${row.targetId}` : `/inbound/${row.targetId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-background-app rounded-lg text-xs font-bold text-accent transition-all"
            >
              Xử lý <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          <button className="p-2 hover:bg-background-app rounded-lg text-text-secondary hover:text-danger transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardTable 
      title=""
      columns={columns}
      data={mockAlerts}
    />
  );
}
