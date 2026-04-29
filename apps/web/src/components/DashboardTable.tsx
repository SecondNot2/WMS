"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Column<T = Record<string, unknown>> {
  header: string;
  accessor: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DashboardTableProps<T = Record<string, unknown>> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  showFooter?: boolean;
  footerHref?: string;
  footerLabel?: string;
}

export function DashboardTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  emptyMessage = "Không có dữ liệu",
  showFooter = true,
  footerHref,
  footerLabel = "Xem tất cả",
}: DashboardTableProps<T>) {
  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden h-full flex flex-col">
      {title && (
        <div className="px-4 py-3.5 border-b border-border-ui flex items-center bg-card-white">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-app/50">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2.5 text-[11px] font-semibold text-text-secondary border-b border-border-ui uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="group hover:bg-background-app/50 transition-colors cursor-pointer"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-4 py-3 text-[12px] text-text-primary border-b border-border-ui"
                    >
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-10 text-center text-xs text-text-secondary border-b border-border-ui"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showFooter && (
        <div className="p-3 border-t border-border-ui flex justify-end">
          {footerHref ? (
            <Link
              href={footerHref}
              className="text-[11px] font-bold text-accent hover:underline flex items-center"
            >
              {footerLabel} <span className="ml-1">→</span>
            </Link>
          ) : (
            <button className="text-[11px] font-bold text-accent hover:underline flex items-center">
              {footerLabel} <span className="ml-1">→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const configs = {
    pending: { bg: "bg-warning/10", text: "text-warning", label: "Chờ duyệt" },
    approved: { bg: "bg-success/10", text: "text-success", label: "Đã duyệt" },
    rejected: { bg: "bg-danger/10", text: "text-danger", label: "Từ chối" },
  };

  const config = configs[status];

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[11px] font-semibold",
        config.bg,
        config.text,
      )}
    >
      {config.label}
    </span>
  );
}
