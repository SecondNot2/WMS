"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Eye,
  Pencil,
  Trash2,
  Package,
  XCircle,
  FolderOpen
} from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  productCount: number;
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
}

// TODO: Replace with useQuery → GET /categories (API_ENDPOINTS.md)
const mockCategories: Category[] = [
  {
    id: "1",
    code: "CAT001",
    name: "Thiết bị ngoại vi",
    description: "Chuột, bàn phím, tai nghe, webcam...",
    productCount: 145,
    status: "ACTIVE",
    updatedAt: "17/05/2024 14:32",
  },
  {
    id: "2",
    code: "CAT002",
    name: "Màn hình",
    description: "Màn hình máy tính, màn hình ghép, màn hình tương tác...",
    productCount: 56,
    status: "ACTIVE",
    updatedAt: "16/05/2024 10:15",
  },
  {
    id: "3",
    code: "CAT003",
    name: "Laptop",
    description: "Máy tính xách tay các hãng Dell, HP, Lenovo, Asus...",
    productCount: 120,
    status: "ACTIVE",
    updatedAt: "15/05/2024 09:45",
  },
  {
    id: "4",
    code: "CAT004",
    name: "Linh kiện PC",
    description: "CPU, Mainboard, RAM, VGA, Nguồn, Tản nhiệt...",
    productCount: 350,
    status: "INACTIVE",
    updatedAt: "14/05/2024 16:20",
  },
  {
    id: "5",
    code: "CAT005",
    name: "Thiết bị mạng",
    description: "Router, Switch, Access Point, Cáp mạng...",
    productCount: 85,
    status: "ACTIVE",
    updatedAt: "12/05/2024 11:10",
  },
];

const STATUS_STYLES = {
  ACTIVE: { label: "Hoạt động", cls: "bg-success/10 text-success" },
  INACTIVE: { label: "Tạm dừng", cls: "bg-warning/10 text-warning" },
};

export function CategoryTable() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const categories = mockCategories;

  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = categories.length > 0 && selectedIds.length === categories.length;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting category:", deleteId);
    // TODO: Connect to API
    setDeleteId(null);
  };

  return (
    <div className="relative">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
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
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Mã DM
                </th>
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
                  const isSelected = selectedIds.includes(category.id);
                  return (
                    <tr
                      key={category.id}
                      className={cn(
                        "hover:bg-background-app/30 transition-colors group",
                        isSelected && "bg-accent/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-border-ui accent-accent"
                          checked={isSelected}
                          onChange={() => toggleSelect(category.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-medium text-text-primary">
                          {category.code}
                        </span>
                      </td>
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
                        <span className="text-[12px] text-text-secondary line-clamp-1 max-w-62.5" title={category.description}>
                          {category.description}
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
                            STATUS_STYLES[category.status].cls
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {STATUS_STYLES[category.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-text-secondary">
                        {category.updatedAt}
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
                            onClick={() => handleDeleteClick(category.id)}
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
                  <td colSpan={8} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">Không tìm thấy danh mục nào</p>
                      <p className="text-xs text-text-secondary mb-6">Thử thay đổi bộ lọc hoặc thêm danh mục mới</p>
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
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={5}
          pageSize={pageSize}
          totalItems={45}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50 border border-white/10">
          <div className="flex items-center gap-3 border-r border-white/20 pr-6">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold">
              {selectedIds.length}
            </div>
            <span className="text-xs font-semibold">Đã chọn</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors text-danger hover:text-danger/110"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa hàng loạt
            </button>
          </div>

          <button
            onClick={() => setSelectedIds([])}
            className="p-1 hover:bg-white/10 rounded-full transition-colors ml-4"
          >
            <XCircle className="w-5 h-5 text-white/50 hover:text-white" />
          </button>
        </div>
      )}

      {/* Global Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={deleteId ? "Xóa danh mục?" : "Xóa nhiều danh mục?"}
        message={
          deleteId
            ? "Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm thuộc danh mục."
            : `Bạn có chắc chắn muốn xóa ${selectedIds.length} danh mục đã chọn?`
        }
        confirmLabel="Xóa ngay"
        variant="danger"
      />
    </div>
  );
}
