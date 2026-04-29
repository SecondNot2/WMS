"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  User,
  Calendar,
  Hash,
  FileText,
  Package,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  useInbound,
  useApproveInbound,
  useRejectInbound,
  useDeleteInbound,
} from "@/lib/hooks/use-inbound";
import { getApiErrorMessage } from "@/lib/api/client";
import { ConfirmDialog, PromptDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Can } from "@/components/Can";
import type { InboundStatus } from "@wms/types";

interface InboundDetailViewProps {
  id: string;
}

const STATUS_CONFIG: Record<
  InboundStatus,
  { label: string; cls: string; icon: typeof Clock }
> = {
  PENDING: {
    label: "Đang chờ duyệt",
    cls: "bg-warning/10 text-warning",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã duyệt",
    cls: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Đã từ chối",
    cls: "bg-danger/10 text-danger",
    icon: XCircle,
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

const formatDateTime = (iso: string | null) => {
  if (!iso) return "---";
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

export function InboundDetailView({ id }: InboundDetailViewProps) {
  const router = useRouter();
  const { data: receipt, isLoading, isError, error } = useInbound(id);

  const approveMutation = useApproveInbound(id);
  const rejectMutation = useRejectInbound(id);
  const deleteMutation = useDeleteInbound();
  const toast = useToast();

  const [confirmType, setConfirmType] = React.useState<
    null | "approve" | "delete" | "reject"
  >(null);

  const closeConfirm = () => setConfirmType(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-secondary">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        <span className="text-sm">Đang tải phiếu nhập...</span>
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-danger">
        <p className="text-sm font-bold mb-1">Không thể tải phiếu nhập</p>
        <p className="text-xs text-text-secondary">
          {getApiErrorMessage(error)}
        </p>
      </div>
    );
  }

  const currentStatus = STATUS_CONFIG[receipt.status];

  const handleConfirmApprove = async () => {
    try {
      await approveMutation.mutateAsync();
      toast.success(`Đã duyệt phiếu ${receipt.code}`);
      closeConfirm();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể duyệt phiếu"));
    }
  };

  const handleConfirmReject = async (reason: string) => {
    try {
      await rejectMutation.mutateAsync({ reason });
      toast.success(`Đã từ chối phiếu ${receipt.code}`);
      closeConfirm();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể từ chối phiếu"));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Đã xóa phiếu ${receipt.code}`);
      router.push("/inbound");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa phiếu"));
    }
  };

  const isPending =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Status Hero Card */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5",
              currentStatus.cls,
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {currentStatus.label}
          </span>
          <div>
            <p className="text-sm font-bold text-text-primary">
              Mã phiếu: {receipt.code}
            </p>
            <p className="text-[11px] text-text-secondary">
              Ngày tạo: {formatDateTime(receipt.createdAt)}
            </p>
          </div>
        </div>

        {receipt.status === "PENDING" && (
          <div className="flex items-center gap-2 flex-wrap">
            <Can action="receipt.approve">
              <button
                type="button"
                onClick={() => setConfirmType("approve")}
                disabled={isPending}
                className="flex items-center gap-2 bg-success hover:bg-success/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Duyệt phiếu
              </button>
            </Can>
            <Can action="receipt.reject">
              <button
                type="button"
                onClick={() => setConfirmType("reject")}
                disabled={isPending}
                className="flex items-center gap-2 bg-danger hover:bg-danger/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Từ chối
              </button>
            </Can>
            <div className="w-px h-8 bg-border-ui mx-1" />
            <Can action="receipt.update">
              <button
                type="button"
                onClick={() => router.push(`/inbound/${id}/edit`)}
                disabled={isPending}
                className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Pencil className="w-4 h-4" /> Sửa
              </button>
            </Can>
            <Can action="receipt.delete">
              <button
                type="button"
                onClick={() => setConfirmType("delete")}
                disabled={isPending}
                className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Xóa
              </button>
            </Can>
          </div>
        )}
      </div>

      {receipt.status === "REJECTED" && receipt.rejectedReason && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4">
          <p className="text-xs font-bold text-danger uppercase tracking-wider mb-1">
            Lý do từ chối
          </p>
          <p className="text-sm text-text-primary">{receipt.rejectedReason}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-base font-bold text-text-primary">
                Thông tin chung
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <User className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">
                      Nhà cung cấp
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {receipt.supplier.name}
                    </p>
                    {receipt.supplier.address && (
                      <p className="text-[12px] text-text-secondary mt-1">
                        {receipt.supplier.address}
                      </p>
                    )}
                  </div>
                </div>
                {receipt.supplier.taxCode && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-background-app rounded-lg">
                      <Hash className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">
                        Mã số thuế
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {receipt.supplier.taxCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">
                      Ghi chú
                    </p>
                    <p className="text-sm text-text-primary leading-relaxed italic">
                      {receipt.note ? `"${receipt.note}"` : "(không có)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">
                  Danh mục hàng hóa nhập
                </h3>
              </div>
              <span className="text-xs font-bold text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                {receipt.items.length} SẢN PHẨM
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-app/50 border-b border-border-ui">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Đơn giá
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {receipt.items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-background-app/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                        {item.product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary">
                        {item.product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary text-right font-medium">
                        {item.quantity} {item.product.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary text-right">
                        {formatNumber(item.unitPrice)} đ
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                        {formatNumber(item.totalPrice)} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-background-app/30 font-bold">
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-5 text-sm text-text-primary text-right border-t border-border-ui"
                    >
                      Tổng giá trị phiếu nhập:
                    </td>
                    <td className="px-6 py-5 text-lg text-accent text-right border-t border-border-ui tracking-tight">
                      {formatCurrency(receipt.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Creator & Status Info */}
        <div className="space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1 h-3 bg-accent rounded-full" />
              Thông tin hệ thống
            </h3>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                  Người lập phiếu
                </p>
                <p className="text-sm font-bold text-text-primary mt-1">
                  {receipt.createdBy.name}
                </p>
              </div>

              {receipt.approvedBy && (
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                    {receipt.status === "APPROVED"
                      ? "Người duyệt"
                      : "Người xử lý"}
                  </p>
                  <p className="text-sm font-bold text-text-primary mt-1">
                    {receipt.approvedBy.name}
                  </p>
                </div>
              )}

              <hr className="border-border-ui/50" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold">
                      Ngày khởi tạo
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      {formatDateTime(receipt.createdAt)}
                    </p>
                  </div>
                </div>

                {receipt.status === "APPROVED" && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold">
                        Ngày phê duyệt
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDateTime(receipt.receivedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-accent/5 rounded-xl border border-accent/10 p-6">
            <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
              Thông tin bổ sung
            </h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Phiếu nhập kho này sau khi được phê duyệt sẽ tự động cập nhật số
              lượng tồn kho cho từng sản phẩm tương ứng trong hệ thống.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmType === "approve"}
        onClose={() => !approveMutation.isPending && closeConfirm()}
        title="Duyệt phiếu nhập?"
        message={
          <>
            Sau khi duyệt phiếu{" "}
            <strong className="text-text-primary">{receipt.code}</strong>, tồn
            kho của các sản phẩm sẽ được tự động cộng thêm.
          </>
        }
        variant="success"
        confirmLabel="Duyệt phiếu"
        loading={approveMutation.isPending}
        onConfirm={handleConfirmApprove}
      />

      <PromptDialog
        open={confirmType === "reject"}
        onClose={() => !rejectMutation.isPending && closeConfirm()}
        title="Từ chối phiếu nhập?"
        message={
          <>
            Vui lòng nhập lý do từ chối phiếu{" "}
            <strong className="text-text-primary">{receipt.code}</strong>.
          </>
        }
        variant="danger"
        inputLabel="Lý do từ chối"
        placeholder="VD: Sai thông tin nhà cung cấp, số lượng không khớp..."
        confirmLabel="Từ chối"
        required
        loading={rejectMutation.isPending}
        onConfirm={handleConfirmReject}
      />

      <ConfirmDialog
        open={confirmType === "delete"}
        onClose={() => !deleteMutation.isPending && closeConfirm()}
        title="Xóa phiếu nhập?"
        message={
          <>
            Bạn sắp xóa phiếu{" "}
            <strong className="text-text-primary">{receipt.code}</strong>. Hành
            động này không thể khôi phục.
          </>
        }
        variant="danger"
        confirmLabel="Xóa phiếu"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
