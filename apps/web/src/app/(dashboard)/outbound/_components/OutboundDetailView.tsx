"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Building,
  Calendar,
  FileText,
  Package,
  Truck,
  Phone,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  useOutbound,
  useApproveOutbound,
  useRejectOutbound,
  useDeleteOutbound,
} from "@/lib/hooks/use-outbound";
import { getApiErrorMessage } from "@/lib/api/client";
import { ConfirmDialog, PromptDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Can } from "@/components/Can";
import type { OutboundStatus } from "@wms/types";

interface OutboundDetailViewProps {
  id: string;
}

const STATUS_CONFIG: Record<
  OutboundStatus,
  { label: string; cls: string; icon: typeof Clock }
> = {
  PENDING: {
    label: "Chờ duyệt xuất",
    cls: "bg-warning/10 text-warning",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã xuất kho",
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

export function OutboundDetailView({ id }: OutboundDetailViewProps) {
  const router = useRouter();
  const { data: issue, isLoading, isError, error } = useOutbound(id);

  const approveMutation = useApproveOutbound(id);
  const rejectMutation = useRejectOutbound(id);
  const deleteMutation = useDeleteOutbound();
  const toast = useToast();

  const [confirmType, setConfirmType] = React.useState<
    null | "approve" | "delete" | "reject"
  >(null);

  const closeConfirm = () => setConfirmType(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-secondary">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        <span className="text-sm">Đang tải phiếu xuất...</span>
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-danger">
        <p className="text-sm font-bold mb-1">Không thể tải phiếu xuất</p>
        <p className="text-xs text-text-secondary">
          {getApiErrorMessage(error)}
        </p>
      </div>
    );
  }

  const currentStatus = STATUS_CONFIG[issue.status];

  const handleConfirmApprove = async () => {
    try {
      await approveMutation.mutateAsync();
      toast.success(`Đã duyệt phiếu ${issue.code}`);
      closeConfirm();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể duyệt phiếu"));
    }
  };

  const handleConfirmReject = async (reason: string) => {
    try {
      await rejectMutation.mutateAsync({ reason });
      toast.success(`Đã từ chối phiếu ${issue.code}`);
      closeConfirm();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể từ chối phiếu"));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Đã xóa phiếu ${issue.code}`);
      router.push("/outbound");
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
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Mã phiếu: {issue.code}
            </p>
            <p className="text-[11px] text-text-secondary">
              Ngày tạo: {formatDateTime(issue.createdAt)}
            </p>
          </div>
        </div>

        {issue.status === "PENDING" && (
          <div className="flex items-center gap-2 flex-wrap">
            <Can action="issue.approve">
              <button
                type="button"
                onClick={() => setConfirmType("approve")}
                disabled={isPending}
                className="flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white text-sm font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex-1 sm:flex-initial"
              >
                <CheckCircle2 className="w-4 h-4" /> Duyệt
              </button>
            </Can>
            <Can action="issue.reject">
              <button
                type="button"
                onClick={() => setConfirmType("reject")}
                disabled={isPending}
                className="flex items-center justify-center gap-2 bg-danger hover:bg-danger/90 text-white text-sm font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex-1 sm:flex-initial"
              >
                <XCircle className="w-4 h-4" /> Từ chối
              </button>
            </Can>
            <div className="hidden sm:block w-px h-8 bg-border-ui mx-1" />
            <Can action="issue.update">
              <button
                type="button"
                onClick={() => router.push(`/outbound/${id}/edit`)}
                disabled={isPending}
                className="flex items-center justify-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Sửa</span>
              </button>
            </Can>
            <Can action="issue.delete">
              <button
                type="button"
                onClick={() => setConfirmType("delete")}
                disabled={isPending}
                className="flex items-center justify-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa</span>
              </button>
            </Can>
          </div>
        )}
      </div>

      {issue.status === "REJECTED" && issue.rejectedReason && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4">
          <p className="text-xs font-bold text-danger uppercase tracking-wider mb-1">
            Lý do từ chối
          </p>
          <p className="text-sm text-text-primary">{issue.rejectedReason}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              <h3 className="text-base font-bold text-text-primary">
                Thông tin vận chuyển
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <Building className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                      Đơn vị nhận
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {issue.recipient.name}
                    </p>
                    {issue.recipient.address && (
                      <p className="text-[12px] text-text-secondary mt-1">
                        {issue.recipient.address}
                      </p>
                    )}
                  </div>
                </div>
                {issue.recipient.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-background-app rounded-lg">
                      <Phone className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                        Liên hệ
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {issue.recipient.phone}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                      Lý do xuất
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      {issue.purpose ?? "(không có)"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                      Ghi chú
                    </p>
                    <p className="text-sm text-text-primary leading-relaxed italic">
                      {issue.note ? `"${issue.note}"` : "(không có)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">
                  Danh mục hàng hóa xuất
                </h3>
              </div>
              <span className="text-xs font-bold text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                {issue.items.length} MẶT HÀNG
              </span>
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
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
                      Thuế (%)
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Tiền thuế
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {issue.items.map((item) => (
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
                      <td className="px-6 py-4 text-sm text-text-secondary text-right">
                        {item.taxRate}%
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary text-right">
                        {formatNumber(item.taxAmount)} đ
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                        {formatNumber(item.totalPrice)} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-background-app/30">
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-3 text-sm text-text-secondary text-right border-t border-border-ui"
                    >
                      Tạm tính (chưa thuế):
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-text-primary text-right border-t border-border-ui">
                      {formatNumber(issue.subtotalAmount)} đ
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-3 text-sm text-text-secondary text-right"
                    >
                      Tổng VAT:
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-text-primary text-right">
                      {formatNumber(issue.taxTotalAmount)} đ
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td
                      colSpan={6}
                      className="px-6 py-5 text-sm text-text-primary text-right border-t border-border-ui"
                    >
                      Tổng giá trị phiếu xuất:
                    </td>
                    <td className="px-6 py-5 text-lg text-accent text-right border-t border-border-ui tracking-tight">
                      {formatCurrency(issue.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile card view for items */}
            <div className="sm:hidden divide-y divide-border-ui">
              {issue.items.map((item) => (
                <div key={item.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-text-secondary font-mono">
                        {item.product.sku}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-accent whitespace-nowrap">
                      {formatNumber(item.totalPrice)} đ
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-background-app p-1.5">
                      <p className="text-[10px] text-text-secondary">SL</p>
                      <p className="text-xs font-bold text-text-primary">
                        {item.quantity} {item.product.unit}
                      </p>
                    </div>
                    <div className="rounded-lg bg-background-app p-1.5">
                      <p className="text-[10px] text-text-secondary">Đơn giá</p>
                      <p className="text-xs font-bold text-text-primary">
                        {formatNumber(item.unitPrice)}đ
                      </p>
                    </div>
                    <div className="rounded-lg bg-background-app p-1.5">
                      <p className="text-[10px] text-text-secondary">Thuế</p>
                      <p className="text-xs font-bold text-text-primary">
                        {item.taxRate}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 space-y-2 bg-background-app/30">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tạm tính:</span>
                  <span className="font-medium text-text-primary">
                    {formatNumber(issue.subtotalAmount)} đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tổng VAT:</span>
                  <span className="font-medium text-text-primary">
                    {formatNumber(issue.taxTotalAmount)} đ
                  </span>
                </div>
                <hr className="border-border-ui" />
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-text-primary">
                    Tổng cộng:
                  </span>
                  <span className="text-lg font-bold text-accent">
                    {formatCurrency(issue.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  {issue.createdBy.name}
                </p>
              </div>

              {issue.approvedBy && (
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                    {issue.status === "APPROVED"
                      ? "Người duyệt xuất"
                      : "Người xử lý"}
                  </p>
                  <p className="text-sm font-bold text-text-primary mt-1">
                    {issue.approvedBy.name}
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
                      {formatDateTime(issue.createdAt)}
                    </p>
                  </div>
                </div>

                {issue.status === "APPROVED" && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold">
                        Ngày xuất kho
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDateTime(issue.issuedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-warning/5 rounded-xl border border-warning/10 p-6">
            <h4 className="text-xs font-bold text-warning uppercase tracking-widest mb-3 text-center">
              QUY TRÌNH PHÊ DUYỆT
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[11px] text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" />
                Phiếu sau khi lập sẽ ở trạng thái chờ duyệt.
              </li>
              <li className="flex items-start gap-2 text-[11px] text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" />
                Hệ thống kiểm tra tồn kho tại thời điểm Duyệt.
              </li>
              <li className="flex items-start gap-2 text-[11px] text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1" />
                Sau khi duyệt, tồn kho sẽ tự động bị trừ.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmType === "approve"}
        onClose={() => !approveMutation.isPending && closeConfirm()}
        title="Duyệt phiếu xuất?"
        message={
          <>
            Sau khi duyệt phiếu{" "}
            <strong className="text-text-primary">{issue.code}</strong>, tồn kho
            của các sản phẩm sẽ tự động bị trừ tương ứng.
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
        title="Từ chối phiếu xuất?"
        message={
          <>
            Vui lòng nhập lý do từ chối phiếu{" "}
            <strong className="text-text-primary">{issue.code}</strong>.
          </>
        }
        variant="danger"
        inputLabel="Lý do từ chối"
        placeholder="VD: Sai thông tin đơn vị nhận, tồn kho không đủ..."
        confirmLabel="Từ chối"
        required
        loading={rejectMutation.isPending}
        onConfirm={handleConfirmReject}
      />

      <ConfirmDialog
        open={confirmType === "delete"}
        onClose={() => !deleteMutation.isPending && closeConfirm()}
        title="Xóa phiếu xuất?"
        message={
          <>
            Bạn sắp xóa phiếu{" "}
            <strong className="text-text-primary">{issue.code}</strong>. Hành
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
