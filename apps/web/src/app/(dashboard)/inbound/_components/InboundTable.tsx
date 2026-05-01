"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2, FileText, Loader2 } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { useInbounds, useDeleteInbound } from "@/lib/hooks/use-inbound";
import { getApiErrorMessage } from "@/lib/api/client";
import type { InboundStatus } from "@wms/types";
import type { InboundFilterValues } from "./InboundFilters";

interface InboundTableProps {
  filters: InboundFilterValues;
}

const STATUS_STYLES: Record<InboundStatus, { label: string; cls: string }> = {
  PENDING: { label: "Chờ duyệt", cls: "bg-warning/10 text-warning" },
  APPROVED: { label: "Đã duyệt", cls: "bg-success/10 text-success" },
  REJECTED: { label: "Từ chối", cls: "bg-danger/10 text-danger" },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export function InboundTable({ filters }: InboundTableProps) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // Reset trang khi đổi filter
  const filtersKey = JSON.stringify(filters);
  const [prevFiltersKey, setPrevFiltersKey] = React.useState(filtersKey);
  if (prevFiltersKey !== filtersKey) {
    setPrevFiltersKey(filtersKey);
    setPage(1);
  }

  const query = React.useMemo(
    () => ({
      page,
      limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
      ...(filters.supplierId && { supplierId: filters.supplierId }),
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
    }),
    [page, limit, filters],
  );

  const { data, isLoading, isError, error } = useInbounds(query);
  const deleteMutation = useDeleteInbound();
  const toast = useToast();

  const [pendingDelete, setPendingDelete] = React.useState<{
    id: string;
    code: string;
  } | null>(null);

  const receipts = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success(`Đã xóa phiếu ${pendingDelete.code}`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa phiếu"));
    }
  };

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-background-app/50 border-b border-border-ui">
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Mã phiếu
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Nhà cung cấp
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                Số SP
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Người lập
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Ngày lập
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center text-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin mb-3" />
                    <p className="text-xs">Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center text-danger">
                    <p className="text-sm font-bold mb-1">
                      Không thể tải dữ liệu
                    </p>
                    <p className="text-xs">{getApiErrorMessage(error)}</p>
                  </div>
                </td>
              </tr>
            ) : receipts.length > 0 ? (
              receipts.map((receipt) => {
                const status = STATUS_STYLES[receipt.status];
                return (
                  <tr
                    key={receipt.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/inbound/${receipt.id}`}
                        className="text-[13px] font-semibold text-accent hover:underline"
                      >
                        {receipt.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-primary">
                      {receipt.supplier.name}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-text-primary text-right">
                      {formatCurrency(receipt.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary text-center">
                      {receipt.itemCount}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">
                      {receipt.createdBy.name}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-secondary">
                      {formatDateTime(receipt.createdAt)}
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/inbound/${receipt.id}`}
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {receipt.status === "PENDING" && (
                          <>
                            <Link
                              href={`/inbound/${receipt.id}/edit`}
                              className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingDelete({
                                  id: receipt.id,
                                  code: receipt.code,
                                })
                              }
                              disabled={deleteMutation.isPending}
                              className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors disabled:opacity-50"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-text-secondary" />
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      Chưa có phiếu nhập kho nào
                    </p>
                    <p className="text-xs text-text-secondary mb-6">
                      Thử thay đổi bộ lọc hoặc lập phiếu mới
                    </p>
                    <Link
                      href="/inbound/new"
                      className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Lập phiếu nhập kho
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-border-ui">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin mb-3" />
            <p className="text-xs">Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center text-danger">
            <p className="text-sm font-bold mb-1">Không thể tải dữ liệu</p>
            <p className="text-xs">{getApiErrorMessage(error)}</p>
          </div>
        ) : receipts.length > 0 ? (
          receipts.map((receipt) => {
            const status = STATUS_STYLES[receipt.status];
            return (
              <div key={receipt.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/inbound/${receipt.id}`}
                      className="text-sm font-bold text-accent hover:underline"
                    >
                      {receipt.code}
                    </Link>
                    <p className="mt-1 text-xs font-medium text-text-primary truncate">
                      {receipt.supplier.name}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                      status.cls,
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                    {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-background-app p-2">
                    <p className="text-[10px] text-text-secondary">Tổng tiền</p>
                    <p className="text-xs font-bold text-text-primary truncate">
                      {formatCurrency(receipt.totalAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background-app p-2">
                    <p className="text-[10px] text-text-secondary">Số SP</p>
                    <p className="text-sm font-bold text-text-primary">
                      {receipt.itemCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background-app p-2">
                    <p className="text-[10px] text-text-secondary">Ngày lập</p>
                    <p className="text-[11px] font-bold text-text-primary">
                      {formatDateTime(receipt.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/inbound/${receipt.id}`}
                    className="p-2 bg-accent/10 text-accent rounded-lg"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  {receipt.status === "PENDING" && (
                    <>
                      <Link
                        href={`/inbound/${receipt.id}/edit`}
                        className="p-2 bg-warning/10 text-warning rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingDelete({
                            id: receipt.id,
                            code: receipt.code,
                          })
                        }
                        disabled={deleteMutation.isPending}
                        className="p-2 bg-danger/10 text-danger rounded-lg disabled:opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-sm font-bold text-text-primary mb-1">
              Chưa có phiếu nhập kho nào
            </p>
            <p className="text-xs text-text-secondary mb-6">
              Thử thay đổi bộ lọc hoặc lập phiếu mới
            </p>
            <Link
              href="/inbound/new"
              className="w-full px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors text-center"
            >
              Lập phiếu nhập kho
            </Link>
          </div>
        )}
      </div>

      {meta && meta.total > 0 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          pageSize={limit}
          totalItems={meta.total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => !deleteMutation.isPending && setPendingDelete(null)}
        title="Xóa phiếu nhập?"
        message={
          pendingDelete && (
            <>
              Bạn sắp xóa phiếu{" "}
              <strong className="text-text-primary">
                {pendingDelete.code}
              </strong>
              . Hành động này không thể khôi phục.
            </>
          )
        }
        variant="danger"
        confirmLabel="Xóa phiếu"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
