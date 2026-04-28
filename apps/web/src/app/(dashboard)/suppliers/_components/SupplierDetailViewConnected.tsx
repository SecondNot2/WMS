"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileDown,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
  Truck,
} from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { useDeleteSupplier, useSupplier } from "@/lib/hooks/use-suppliers";

interface SupplierDetailViewConnectedProps {
  id: string;
}

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

const statusLabel: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Chờ duyệt", cls: "bg-warning/10 text-warning" },
  APPROVED: { label: "Đã duyệt", cls: "bg-success/10 text-success" },
  REJECTED: { label: "Từ chối", cls: "bg-danger/10 text-danger" },
};

export function SupplierDetailViewConnected({
  id,
}: SupplierDetailViewConnectedProps) {
  const router = useRouter();
  const { data: supplier, isLoading, error } = useSupplier(id);
  const deleteMutation = useDeleteSupplier();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = async () => {
    if (!supplier) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Đã xóa ${supplier.name}`);
      router.push("/suppliers");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa nhà cung cấp"));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin nhà cung cấp...
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không tìm thấy nhà cung cấp")}
      </div>
    );
  }

  const pendingCount = supplier.recentInbounds.filter(
    (r) => r.status === "PENDING",
  ).length;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <Link
          href={`/suppliers/${id}/edit`}
          className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Pencil className="w-4 h-4" /> Chỉnh sửa
        </Link>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={
                        supplier.isActive
                          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider"
                          : "px-2 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning uppercase tracking-wider"
                      }
                    >
                      {supplier.isActive ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {supplier.name}
                  </h2>
                  {supplier.taxCode && (
                    <p className="text-sm text-text-secondary mt-1">
                      MST:{" "}
                      <span className="font-semibold text-text-primary">
                        {supplier.taxCode}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 pt-6 border-t border-border-ui">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Điện thoại
                  </p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {supplier.phone ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-accent mt-1">
                    {supplier.email ?? "—"}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold">
                    Địa chỉ
                  </p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {supplier.address ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border-ui flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">
                  Phiếu nhập gần đây
                </h3>
              </div>
              <Link
                href={`/inbound?supplierId=${supplier.id}`}
                className="text-xs font-bold text-accent hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-app/50 border-b border-border-ui">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Mã phiếu
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Ngày lập
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {supplier.recentInbounds.length > 0 ? (
                    supplier.recentInbounds.map((receipt) => {
                      const status =
                        statusLabel[receipt.status] ?? statusLabel.PENDING;
                      return (
                        <tr
                          key={receipt.id}
                          className="hover:bg-background-app/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={`/inbound/${receipt.id}`}
                              className="text-sm font-bold text-accent hover:underline"
                            >
                              {receipt.code}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {formatDate(receipt.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                            {formatCurrency(receipt.totalAmount)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status.cls}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-sm text-text-secondary"
                      >
                        Chưa có phiếu nhập nào từ nhà cung cấp này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
              <p className="text-xs text-text-secondary uppercase font-bold">
                Tổng phiếu nhập
              </p>
              <p className="text-2xl font-bold text-text-primary mt-2">
                {supplier.stats.totalInbound}
              </p>
            </div>
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
              <p className="text-xs text-text-secondary uppercase font-bold">
                Đang chờ duyệt
              </p>
              <p className="text-2xl font-bold text-warning mt-2">
                {pendingCount}
              </p>
            </div>
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5">
              <p className="text-xs text-text-secondary uppercase font-bold">
                Tổng giá trị nhập
              </p>
              <p className="text-2xl font-bold text-accent mt-2">
                {formatCurrency(supplier.stats.totalAmount)}
              </p>
            </div>
          </div>

          <Link
            href={`/inbound/new?supplierId=${supplier.id}`}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-lg shadow-accent/20 transition-colors"
          >
            <FileDown className="w-4 h-4" /> Lập phiếu nhập từ nhà cung cấp này
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => !deleteMutation.isPending && setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Xóa nhà cung cấp?"
        message={
          <>
            <strong className="text-text-primary">{supplier.name}</strong> sẽ
            được chuyển sang trạng thái tạm dừng. Lịch sử phiếu nhập vẫn được
            giữ lại.
          </>
        }
        confirmLabel="Xóa nhà cung cấp"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
