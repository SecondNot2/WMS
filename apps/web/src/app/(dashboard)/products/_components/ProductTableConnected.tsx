"use client";

import React from "react";
import Link from "next/link";
import {
  Copy,
  Eye,
  Package,
  Pencil,
  Printer,
  Trash2,
  XCircle,
} from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { Pagination } from "@/components/Pagination";
import { getApiErrorMessage } from "@/lib/api/client";
import { useDeleteProduct, useProducts } from "@/lib/hooks/use-products";
import { cn } from "@/lib/utils";
import type { GetProductsQuery, Product } from "@wms/types";

type ProductStatus = "in_stock" | "low_stock" | "out_of_stock";

const statusStyles: Record<ProductStatus, string> = {
  in_stock: "bg-success/10 text-success",
  low_stock: "bg-warning/10 text-warning",
  out_of_stock: "bg-danger/10 text-danger",
};

const statusLabels: Record<ProductStatus, string> = {
  in_stock: "Còn hàng",
  low_stock: "Sắp hết",
  out_of_stock: "Hết hàng",
};

function getStatus(product: Product): ProductStatus {
  if (product.currentStock <= 0) return "out_of_stock";
  if (product.currentStock <= product.minStock) return "low_stock";
  return "in_stock";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export interface ProductTableConnectedProps {
  filters?: Pick<
    GetProductsQuery,
    "search" | "categoryId" | "lowStock" | "isActive"
  >;
}

export function ProductTableConnected({
  filters,
}: ProductTableConnectedProps = {}) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
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
    setSelectedIds([]);
  }

  const { data, isLoading, error } = useProducts({
    page: currentPage,
    limit: pageSize,
    ...filters,
  });
  const deleteMutation = useDeleteProduct();
  const products = data?.data ?? [];
  const meta = data?.meta;

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === products.length
        ? []
        : products.map((product) => product.id),
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không thể tải danh sách sản phẩm")}
      </div>
    );
  }

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
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  SKU / Mã vạch
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Ngưỡng
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
              {products.length > 0 ? (
                products.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const status = getStatus(product);
                  return (
                    <tr
                      key={product.id}
                      className={cn(
                        "hover:bg-background-app/30 transition-colors group",
                        isSelected && "bg-accent/2",
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-border-ui accent-accent"
                          checked={isSelected}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-border-ui bg-background-app flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-text-secondary" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <Link
                            href={`/products/${product.id}`}
                            className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors"
                          >
                            {product.name}
                          </Link>
                          {product.model && (
                            <span className="text-[11px] text-text-secondary">
                              {product.model}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-text-primary">
                            {product.sku}
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            {product.barcode ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] px-2 py-0.5 rounded bg-accent/5 text-accent border border-accent/10">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">
                        {product.unit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "text-[13px] font-bold",
                            product.currentStock <= product.minStock
                              ? "text-danger"
                              : "text-success",
                          )}
                        >
                          {product.currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-[12px] text-text-secondary">
                        {product.minStock}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center w-fit",
                            statusStyles[status],
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {statusLabels[status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-text-secondary">
                        {formatDate(product.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/products/${product.id}`}
                            className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="p-1.5 hover:bg-warning/10 text-warning rounded-md transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: product.id,
                                name: product.name,
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
                  <td colSpan={11} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-1">
                        Không tìm thấy sản phẩm nào
                      </p>
                      <p className="text-xs text-text-secondary mb-6">
                        Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
                      </p>
                      <Link
                        href="/products/new"
                        className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Thêm sản phẩm mới
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

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50 border border-white/10">
          <div className="flex items-center gap-3 border-r border-white/20 pr-6">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold">
              {selectedIds.length}
            </div>
            <span className="text-xs font-semibold">Đã chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">
              <Printer className="w-3.5 h-3.5" /> In mã vạch
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">
              <Copy className="w-3.5 h-3.5" /> Sao chép
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast.success(`Đã xóa ${deleteTarget.name}`);
            setDeleteTarget(null);
          } catch (err) {
            toast.error(getApiErrorMessage(err, "Không thể xóa sản phẩm"));
          }
        }}
        title="Xóa sản phẩm?"
        message={
          deleteTarget && (
            <>
              <strong className="text-text-primary">{deleteTarget.name}</strong>{" "}
              sẽ được chuyển sang trạng thái không hoạt động. Tồn kho và lịch sử
              vẫn được giữ lại.
            </>
          )
        }
        confirmLabel="Xóa sản phẩm"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
