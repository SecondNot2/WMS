"use client";

import React from "react";
import Link from "next/link";
import { Building2, Eye, Pencil, Trash2, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  taxCode: string;
  address: string;
  receiptCount: number;
  totalValue: number;
  isActive: boolean;
  updatedAt: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    code: "NCC001",
    name: "Công ty TNHH An Phát",
    contactPerson: "Nguyễn Hoàng Nam",
    phone: "0901 234 567",
    email: "contact@anphat.vn",
    taxCode: "0101234567",
    address: "Hà Nội",
    receiptCount: 42,
    totalValue: 568000000,
    isActive: true,
    updatedAt: "17/05/2024 14:32",
  },
  {
    id: "2",
    code: "NCC002",
    name: "Samsung Vina",
    contactPerson: "Trần Minh Anh",
    phone: "0912 456 789",
    email: "sales@samsungvina.vn",
    taxCode: "0309876543",
    address: "TP. Hồ Chí Minh",
    receiptCount: 28,
    totalValue: 1280000000,
    isActive: true,
    updatedAt: "16/05/2024 10:15",
  },
  {
    id: "3",
    code: "NCC003",
    name: "Logitech VN",
    contactPerson: "Lê Quốc Huy",
    phone: "0988 111 222",
    email: "partner@logitech.vn",
    taxCode: "0312345678",
    address: "Đà Nẵng",
    receiptCount: 16,
    totalValue: 245000000,
    isActive: true,
    updatedAt: "15/05/2024 09:45",
  },
  {
    id: "4",
    code: "NCC004",
    name: "Dell Global",
    contactPerson: "Phạm Thùy Linh",
    phone: "0977 333 444",
    email: "logistics@dellglobal.vn",
    taxCode: "0105558888",
    address: "Hải Phòng",
    receiptCount: 9,
    totalValue: 740000000,
    isActive: false,
    updatedAt: "12/05/2024 11:10",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export function SupplierTable() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const suppliers = mockSuppliers;

  const toggleSelectAll = () => {
    if (selectedIds.length === suppliers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(suppliers.map((supplier) => supplier.id));
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
    console.log("Deleting supplier:", deleteId);
    setDeleteId(null);
  };

  const isAllSelected = suppliers.length > 0 && selectedIds.length === suppliers.length;

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    className="rounded border-border-ui accent-accent"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Nhà cung cấp</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Liên hệ</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Mã số thuế</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">Phiếu nhập</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">Giá trị nhập</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Cập nhật</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => {
                  const isSelected = selectedIds.includes(supplier.id);

                  return (
                    <tr
                      key={supplier.id}
                      className={cn(
                        "hover:bg-background-app/30 transition-colors group",
                        isSelected && "bg-accent/5",
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-border-ui accent-accent"
                          checked={isSelected}
                          onChange={() => toggleSelect(supplier.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <Link href={`/suppliers/${supplier.id}`} className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1">
                              {supplier.name}
                            </Link>
                            <p className="text-[11px] text-text-secondary font-mono">{supplier.code} · {supplier.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-semibold text-text-primary">{supplier.contactPerson}</p>
                        <p className="text-[11px] text-text-secondary">{supplier.phone}</p>
                        <p className="text-[11px] text-accent">{supplier.email}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-primary">{supplier.taxCode}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[13px] font-bold text-text-primary bg-background-app px-2 py-1 rounded-md">{supplier.receiptCount}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-[12px] font-bold text-text-primary">{formatCurrency(supplier.totalValue)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                            supplier.isActive ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {supplier.isActive ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-text-secondary">{supplier.updatedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/suppliers/${supplier.id}`} className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/suppliers/${supplier.id}/edit`} className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors" title="Chỉnh sửa">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDeleteClick(supplier.id)} className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">Không tìm thấy nhà cung cấp nào</p>
                      <p className="text-xs text-text-secondary mb-6">Thử thay đổi bộ lọc hoặc thêm nhà cung cấp mới</p>
                      <Link href="/suppliers/new" className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors">
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
          currentPage={currentPage}
          totalPages={8}
          pageSize={pageSize}
          totalItems={76}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa nhà cung cấp"
        message="Bạn có chắc chắn muốn xóa nhà cung cấp này? Nhà cung cấp có phiếu nhập phát sinh sẽ được chuyển sang trạng thái tạm dừng."
        confirmLabel="Xóa nhà cung cấp"
        variant="danger"
      />
    </div>
  );
}
