"use client";

import React from "react";
import Link from "next/link";
import { Building2, Eye, Pencil, Trash2, Truck } from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Pagination } from "@/components/Pagination";
import { getApiErrorMessage } from "@/lib/api/client";
import { useDeleteSupplier, useSuppliers } from "@/lib/hooks/use-suppliers";
import { cn } from "@/lib/utils";
import type { GetSuppliersQuery } from "@wms/types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export interface SupplierTableConnectedProps {
  filters?: Pick<GetSuppliersQuery, "search" | "isActive">;
}

export function SupplierTableConnected({
  filters,
}: SupplierTableConnectedProps = {}) {
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

  const { data, isLoading, error } = useSuppliers({
    page: currentPage,
    limit: pageSize,
    ...filters,
  });
  const deleteMutation = useDeleteSupplier();
  const suppliers = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Đã xóa ${deleteTarget.name}`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa nhà cung cấp"));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải danh sách nhà cung cấp...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không thể tải danh sách nhà cung cấp")}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-220">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Nhà cung cấp
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Mã số thuế
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Phiếu nhập
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Giá trị nhập
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
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/suppliers/${supplier.id}`}
                            className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1"
                          >
                            {supplier.name}
                          </Link>
                          {supplier.address && (
                            <p className="text-[11px] text-text-secondary line-clamp-1">
                              {supplier.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {supplier.phone && (
                        <p className="text-[11px] text-text-secondary">
                          {supplier.phone}
                        </p>
                      )}
                      {supplier.email && (
                        <p className="text-[11px] text-accent">
                          {supplier.email}
                        </p>
                      )}
                      {!supplier.phone && !supplier.email && (
                        <span className="text-[11px] text-text-secondary">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-primary">
                      {supplier.taxCode ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[13px] font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">
                        {supplier.inboundCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] font-bold text-text-primary">
                      {formatCurrency(supplier.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                          supplier.isActive
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {supplier.isActive ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-secondary">
                      {formatDate(supplier.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/suppliers/${supplier.id}/edit`}
                          className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: supplier.id,
                              name: supplier.name,
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">
                        Không tìm thấy nhà cung cấp nào
                      </p>
                      <p className="text-xs text-text-secondary mb-6">
                        Thử thay đổi bộ lọc hoặc thêm nhà cung cấp mới
                      </p>
                      <Link
                        href="/suppliers/new"
                        className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Thêm nhà cung cấp
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
        title="Xóa nhà cung cấp?"
        message={
          deleteTarget && (
            <>
              <strong className="text-text-primary">{deleteTarget.name}</strong>{" "}
              sẽ được chuyển sang trạng thái tạm dừng. Lịch sử phiếu nhập vẫn
              được giữ lại.
            </>
          )
        }
        confirmLabel="Xóa nhà cung cấp"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
