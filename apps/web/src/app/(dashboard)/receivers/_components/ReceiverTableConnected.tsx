"use client";

import React from "react";
import Link from "next/link";
import { Building2, Eye, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Pagination } from "@/components/Pagination";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useDeleteRecipient,
  useRecipientsList,
} from "@/lib/hooks/use-recipients";
import { cn } from "@/lib/utils";
import type { GetRecipientsQuery } from "@wms/types";

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

export interface ReceiverTableConnectedProps {
  filters?: Pick<GetRecipientsQuery, "search" | "isActive">;
}

export function ReceiverTableConnected({
  filters,
}: ReceiverTableConnectedProps = {}) {
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

  const { data, isLoading, error } = useRecipientsList({
    page: currentPage,
    limit: pageSize,
    ...filters,
  });
  const deleteMutation = useDeleteRecipient();
  const recipients = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Đã xóa ${deleteTarget.name}`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa đơn vị nhận"));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải danh sách đơn vị nhận...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không thể tải danh sách đơn vị nhận")}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-220">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Đơn vị nhận
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Phiếu xuất
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Giá trị xuất
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
              {recipients.length > 0 ? (
                recipients.map((receiver) => (
                  <tr
                    key={receiver.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/receivers/${receiver.id}`}
                            className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1"
                          >
                            {receiver.name}
                          </Link>
                          {receiver.address && (
                            <p className="text-[11px] text-text-secondary line-clamp-1">
                              {receiver.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {receiver.phone && (
                        <p className="text-[11px] text-text-secondary">
                          {receiver.phone}
                        </p>
                      )}
                      {receiver.email && (
                        <p className="text-[11px] text-accent">
                          {receiver.email}
                        </p>
                      )}
                      {!receiver.phone && !receiver.email && (
                        <span className="text-[11px] text-text-secondary">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[13px] font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">
                        {receiver.outboundCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] font-bold text-text-primary">
                      {formatCurrency(receiver.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                          receiver.isActive
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning",
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {receiver.isActive ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-secondary">
                      {formatDate(receiver.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/receivers/${receiver.id}`}
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/receivers/${receiver.id}/edit`}
                          className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: receiver.id,
                              name: receiver.name,
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
                  <td colSpan={7} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">
                        Không tìm thấy đơn vị nhận nào
                      </p>
                      <p className="text-xs text-text-secondary mb-6">
                        Thử thay đổi bộ lọc hoặc thêm đơn vị nhận mới
                      </p>
                      <Link
                        href="/receivers/new"
                        className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Thêm đơn vị nhận
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-border-ui">
          {recipients.length > 0 ? (
            recipients.map((receiver) => (
              <div key={receiver.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/receivers/${receiver.id}`}
                      className="text-sm font-bold text-text-primary hover:text-accent transition-colors line-clamp-2"
                    >
                      {receiver.name}
                    </Link>
                    <p className="text-[11px] text-text-secondary line-clamp-2">
                      {receiver.address || "Chưa có địa chỉ"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-background-app p-2">
                    <p className="text-text-secondary">Phiếu xuất</p>
                    <p className="font-bold text-text-primary">
                      {receiver.outboundCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background-app p-2">
                    <p className="text-text-secondary">Giá trị xuất</p>
                    <p className="font-bold text-text-primary">
                      {formatCurrency(receiver.totalAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background-app p-2 col-span-2">
                    <p className="text-text-secondary">Trạng thái</p>
                    <span
                      className={cn(
                        "mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                        receiver.isActive
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning",
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {receiver.isActive ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-text-secondary">
                  <p className="truncate">
                    Điện thoại: {receiver.phone || "—"}
                  </p>
                  <p className="truncate">Email: {receiver.email || "—"}</p>
                  <p>Cập nhật: {formatDate(receiver.updatedAt)}</p>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/receivers/${receiver.id}`}
                    className="p-2 bg-accent/10 text-accent rounded-lg"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/receivers/${receiver.id}/edit`}
                    className="p-2 bg-warning/10 text-warning rounded-lg"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        id: receiver.id,
                        name: receiver.name,
                      })
                    }
                    className="p-2 bg-danger/10 text-danger rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-background-app flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-text-secondary" />
                </div>
                <p className="text-sm font-bold text-text-primary mb-1">
                  Không tìm thấy đơn vị nhận nào
                </p>
                <p className="text-xs text-text-secondary mb-5">
                  Thử thay đổi bộ lọc hoặc thêm đơn vị nhận mới
                </p>
                <Link
                  href="/receivers/new"
                  className="w-full px-4 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Thêm đơn vị nhận
                </Link>
              </div>
            </div>
          )}
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
        title="Xóa đơn vị nhận?"
        message={
          deleteTarget && (
            <>
              <strong className="text-text-primary">{deleteTarget.name}</strong>{" "}
              sẽ được chuyển sang trạng thái tạm dừng. Lịch sử phiếu xuất vẫn
              được giữ lại.
            </>
          )
        }
        confirmLabel="Xóa đơn vị"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
