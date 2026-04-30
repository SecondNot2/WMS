"use client";

import React from "react";
import Link from "next/link";
import { Eye, FolderOpen, Package, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Pagination } from "@/components/Pagination";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories";
import { cn } from "@/lib/utils";
import type { GetCategoriesQuery } from "@wms/types";

const statusStyles = {
  active: { label: "Hoạt động", cls: "bg-success/10 text-success" },
  inactive: { label: "Đã ngưng", cls: "bg-warning/10 text-warning" },
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export interface CategoryTableConnectedProps {
  filters?: Pick<GetCategoriesQuery, "search" | "isActive">;
}

export function CategoryTableConnected({
  filters,
}: CategoryTableConnectedProps = {}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const toast = useToast();

  const filtersKey = JSON.stringify(filters ?? {});
  const [prevFiltersKey, setPrevFiltersKey] = React.useState(filtersKey);
  if (prevFiltersKey !== filtersKey) {
    setPrevFiltersKey(filtersKey);
    setCurrentPage(1);
  }

  const { data, isLoading, error } = useCategories({
    page: currentPage,
    limit: pageSize,
    ...filters,
  });
  const deleteMutation = useDeleteCategory();
  const categories = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Đã xóa ${deleteTarget.name}`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa danh mục"));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải danh sách danh mục...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không thể tải danh sách danh mục")}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Tên danh mục
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Cập nhật
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const statusKey = category.isActive ? "active" : "inactive";
                  const status = statusStyles[statusKey];
                  return (
                    <tr
                      key={category.id}
                      className="hover:bg-background-app/30 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/categories/${category.id}`}
                          className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors flex items-center gap-2"
                        >
                          <FolderOpen className="w-4 h-4 text-accent/70" />
                          {category.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[12px] text-text-secondary line-clamp-1 max-w-80"
                          title={category.description ?? ""}
                        >
                          {category.description ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[13px] font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">
                          {category.productCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                            status.cls,
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-text-secondary">
                        {formatDate(category.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/categories/${category.id}`}
                            className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/categories/${category.id}/edit`}
                            className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: category.id,
                                name: category.name,
                              })
                            }
                            className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">
                        Không tìm thấy danh mục nào
                      </p>
                      <p className="text-xs text-text-secondary mb-6">
                        Thử thay đổi bộ lọc hoặc thêm danh mục mới
                      </p>
                      <Link
                        href="/categories/new"
                        className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Thêm danh mục mới
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={meta?.page ?? currentPage}
          totalPages={meta?.totalPages ?? 1}
          pageSize={pageSize}
          totalItems={meta?.total ?? 0}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục?"
        message={
          deleteTarget && (
            <>
              <strong className="text-text-primary">{deleteTarget.name}</strong>{" "}
              sẽ được chuyển sang trạng thái không hoạt động. Chỉ có thể xóa khi
              không còn sản phẩm thuộc danh mục.
            </>
          )
        }
        confirmLabel="Xóa"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
