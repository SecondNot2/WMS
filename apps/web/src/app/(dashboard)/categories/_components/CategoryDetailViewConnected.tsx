"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCategory, useDeleteCategory } from "@/lib/hooks/use-categories";
import { cn } from "@/lib/utils";

interface CategoryDetailViewConnectedProps {
  id: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function CategoryDetailViewConnected({
  id,
}: CategoryDetailViewConnectedProps) {
  const router = useRouter();
  const { data: category, isLoading, error } = useCategory(id);
  const deleteMutation = useDeleteCategory();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = async () => {
    if (!category) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Đã xóa danh mục ${category.name}`);
      router.push("/categories");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa danh mục"));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải thông tin danh mục...
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không tìm thấy danh mục")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push(`/categories/${id}/edit`)}
          className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Pencil className="w-4 h-4" />
          Chỉnh sửa
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Xóa danh mục
        </button>
      </div>

      {/* Category Info Card */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sm text-text-secondary mt-2 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold w-fit flex items-center",
              category.isActive
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning",
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
            {category.isActive ? "Đang hoạt động" : "Tạm dừng"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-ui/50">
          <div>
            <p className="text-xs text-text-secondary mb-1">Số sản phẩm</p>
            <p className="text-base font-bold text-text-primary">
              {category.productCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Ngày tạo</p>
            <p className="text-sm font-medium text-text-primary">
              {formatDate(category.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">
              Cập nhật lần cuối
            </p>
            <p className="text-sm font-medium text-text-primary">
              {formatDate(category.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border-ui">
          <h3 className="text-base font-bold text-text-primary">
            Sản phẩm thuộc danh mục ({category.productCount})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-app/50 border-b border-border-ui">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-center">
                  Tồn kho
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {category.products.length > 0 ? (
                category.products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-background-app/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-text-primary font-mono">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      <Link
                        href={`/products/${product.id}`}
                        className="hover:text-accent transition-colors"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-text-primary text-center">
                      {product.currentStock}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    Danh mục chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => !deleteMutation.isPending && setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục?"
        message={
          <>
            <strong className="text-text-primary">{category.name}</strong> sẽ
            được chuyển sang trạng thái không hoạt động. Chỉ có thể xóa khi
            không còn sản phẩm thuộc danh mục.
          </>
        }
        confirmLabel="Xóa"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
