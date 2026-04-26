"use client";

import React from "react";
import Link from "next/link";
import { Building2, Eye, Pencil, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Receiver {
  id: string;
  code: string;
  name: string;
  type: "BRANCH" | "WAREHOUSE" | "CUSTOMER";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  issueCount: number;
  totalValue: number;
  isActive: boolean;
  updatedAt: string;
}

const mockReceivers: Receiver[] = [
  {
    id: "1",
    code: "DVN001",
    name: "Chi nhánh Lạng Sơn",
    type: "BRANCH",
    contactPerson: "Hoàng Văn Bình",
    phone: "0902 345 678",
    email: "langson@wms.vn",
    address: "Lạng Sơn",
    issueCount: 35,
    totalValue: 452000000,
    isActive: true,
    updatedAt: "18/05/2024 10:30",
  },
  {
    id: "2",
    code: "DVN002",
    name: "Kho trung chuyển Hà Nội",
    type: "WAREHOUSE",
    contactPerson: "Đỗ Minh Đức",
    phone: "0913 222 333",
    email: "warehouse.hn@wms.vn",
    address: "Hà Nội",
    issueCount: 58,
    totalValue: 980000000,
    isActive: true,
    updatedAt: "17/05/2024 15:45",
  },
  {
    id: "3",
    code: "DVN003",
    name: "Cửa hàng Outlet",
    type: "CUSTOMER",
    contactPerson: "Nguyễn Thu Hà",
    phone: "0987 444 555",
    email: "outlet@wms.vn",
    address: "TP. Hồ Chí Minh",
    issueCount: 14,
    totalValue: 126000000,
    isActive: true,
    updatedAt: "16/05/2024 09:15",
  },
  {
    id: "4",
    code: "DVN004",
    name: "Đại lý Quảng Ninh",
    type: "CUSTOMER",
    contactPerson: "Phạm Quốc Khánh",
    phone: "0976 777 888",
    email: "quangninh@wms.vn",
    address: "Quảng Ninh",
    issueCount: 7,
    totalValue: 84000000,
    isActive: false,
    updatedAt: "12/05/2024 11:20",
  },
];

const TYPE_LABELS = {
  BRANCH: "Chi nhánh",
  WAREHOUSE: "Kho trung chuyển",
  CUSTOMER: "Khách hàng",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export function ReceiverTable() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const receivers = mockReceivers;

  const toggleSelectAll = () => {
    if (selectedIds.length === receivers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(receivers.map((receiver) => receiver.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting receiver:", deleteId);
    setDeleteId(null);
  };

  const isAllSelected = receivers.length > 0 && selectedIds.length === receivers.length;

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider w-10">
                  <input type="checkbox" className="rounded border-border-ui accent-accent" checked={isAllSelected} onChange={toggleSelectAll} />
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Đơn vị nhận</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Liên hệ</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Loại đơn vị</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">Phiếu xuất</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">Giá trị xuất</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Cập nhật</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {receivers.map((receiver) => {
                const isSelected = selectedIds.includes(receiver.id);

                return (
                  <tr key={receiver.id} className={cn("hover:bg-background-app/30 transition-colors group", isSelected && "bg-accent/5")}>
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-border-ui accent-accent" checked={isSelected} onChange={() => toggleSelect(receiver.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <Link href={`/receivers/${receiver.id}`} className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1">
                            {receiver.name}
                          </Link>
                          <p className="text-[11px] text-text-secondary font-mono">{receiver.code} · {receiver.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-semibold text-text-primary">{receiver.contactPerson}</p>
                      <p className="text-[11px] text-text-secondary">{receiver.phone}</p>
                      <p className="text-[11px] text-accent">{receiver.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-info/10 text-info uppercase tracking-wider">{TYPE_LABELS[receiver.type]}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[13px] font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">{receiver.issueCount}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] font-bold text-text-primary">{formatCurrency(receiver.totalValue)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit", receiver.isActive ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {receiver.isActive ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-secondary">{receiver.updatedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/receivers/${receiver.id}`} className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors" title="Xem chi tiết"><Eye className="w-4 h-4" /></Link>
                        <Link href={`/receivers/${receiver.id}/edit`} className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors" title="Chỉnh sửa"><Pencil className="w-4 h-4" /></Link>
                        <button onClick={() => handleDeleteClick(receiver.id)} className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={6} pageSize={pageSize} totalItems={54} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa đơn vị nhận hàng"
        message="Bạn có chắc chắn muốn xóa đơn vị nhận hàng này? Đơn vị có phiếu xuất phát sinh sẽ được chuyển sang trạng thái tạm dừng."
        confirmLabel="Xóa đơn vị"
        variant="danger"
      />
    </div>
  );
}
