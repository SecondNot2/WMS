"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Column<T = Record<string, unknown>> {
  header: string;
  accessor: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DashboardTableProps<T = Record<string, unknown>> {
  title: string;
  columns: Column<T>[];
  data: T[];
}

export function DashboardTable<T extends Record<string, unknown>>({ title, columns, data }: DashboardTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3.5 border-b border-border-ui flex items-center bg-white">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
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
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="group hover:bg-[#f8fafc] transition-colors cursor-pointer">
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className="px-4 py-3 text-[12px] text-text-primary border-b border-border-ui"
                  >
                    {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-border-ui flex justify-end">
        <button className="text-[11px] font-bold text-accent hover:underline flex items-center">
          Xem tất cả <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const configs = {
    pending: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]", label: "Chờ duyệt" },
    approved: { bg: "bg-[#dcfce7]", text: "text-[#166534]", label: "Đã duyệt" },
    rejected: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]", label: "Từ chối" },
  };

  const config = configs[status];

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[11px] font-semibold",
      config.bg,
      config.text
    )}>
      {config.label}
    </span>
  );
}
