"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="px-4 py-3 border-t border-border-ui bg-background-app/20 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-text-secondary">Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-card-white border border-border-ui rounded px-2 py-1 text-[12px] outline-none focus:border-accent transition-colors cursor-pointer"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} dòng
              </option>
            ))}
          </select>
        </div>
        <span className="text-[12px] text-text-secondary hidden sm:inline">
          Tổng số{" "}
          <span className="font-semibold text-text-primary">{totalItems}</span>{" "}
          bản ghi
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-border-ui text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, i) => (
            <React.Fragment key={i}>
              {page === "..." ? (
                <span className="px-2 text-text-secondary text-xs">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(Number(page))}
                  className={cn(
                    "w-7 h-7 rounded text-[12px] font-medium transition-all",
                    currentPage === page
                      ? "bg-accent text-white shadow-sm"
                      : "hover:bg-border-ui text-text-secondary",
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-border-ui text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
