"use client";

import React from "react";
import {
  Pencil,
  Trash2,
  Search,
  Filter,
  FileDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CategoryDetailViewProps {
  id: string;
}

export function CategoryDetailView({ id }: CategoryDetailViewProps) {
  const router = useRouter();

  // TODO: Replace with useQuery
  const mockCategory = {
    id: id,
    name: "Thiết bị văn phòng",
    code: "DM001",
    status: "ACTIVE",
    parentId: null,
    description: "Các thiết bị, dụng cụ sử dụng trong văn phòng",
    productCount: 210,
    createdAt: "15/01/2024 10:30",
    updatedAt: "24/05/2024 14:22",
    createdBy: {
      name: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    updatedBy: {
      name: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
  };

  const mockProducts = [
    {
      stt: 1,
      sku: "SP000145",
      name: "Chuột không dây Logitech M331",
      unit: "Cái",
      stock: 120,
      status: "in_stock",
      createdAt: "15/01/2024 10:30",
    },
    {
      stt: 2,
      sku: "SP000457",
      name: "Bàn phím cơ Keychron K2",
      unit: "Cái",
      stock: 45,
      status: "in_stock",
      createdAt: "15/01/2024 10:30",
    },
    {
      stt: 3,
      sku: "SP000201",
      name: "Máy in HP DeskJet Ink P2476M",
      unit: "Cái",
      stock: 8,
      status: "low_stock",
      createdAt: "16/01/2024 09:15",
    },
    {
      stt: 4,
      sku: "SP000302",
      name: "Laptop Dell Inspiron 15 3530",
      unit: "Cái",
      stock: 0,
      status: "out_of_stock",
      createdAt: "16/01/2024 10:05",
    },
    {
      stt: 5,
      sku: "SP000125",
      name: "Giá đỡ màn hình North Bayou F80",
      unit: "Cái",
      stock: 32,
      status: "in_stock",
      createdAt: "17/01/2024 11:00",
    },
  ];

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
        <button className="flex items-center gap-2 bg-card-white border border-danger/20 text-danger hover:bg-danger/5 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Trash2 className="w-4 h-4" />
          Xóa danh mục
        </button>
      </div>

      {/* Category Info Card */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image */}
          <div className="w-full lg:w-72 h-72 shrink-0 rounded-xl overflow-hidden border border-border-ui shadow-sm">
            <img
              src={mockCategory.image}
              alt={mockCategory.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary">
                  Tên danh mục
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {mockCategory.name}
                </span>
              </div>
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary">
                  Mã danh mục
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-text-primary font-mono">
                    {mockCategory.code}
                  </span>
                  <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded">
                    Đang sử dụng
                  </span>
                </div>
              </div>
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary">
                  Danh mục cha
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {mockCategory.parentId || "Không có"}
                </span>
              </div>
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary shrink-0">
                  Mô tả
                </span>
                <span className="text-sm font-medium text-text-primary leading-relaxed">
                  {mockCategory.description}
                </span>
              </div>
            </div>

            <div className="space-y-6 border-l border-border-ui/50 pl-12">
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary">
                  Số sản phẩm
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {mockCategory.productCount} sản phẩm
                </span>
              </div>
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary">
                  Ngày tạo
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {mockCategory.createdAt}
                </span>
              </div>
              <div className="flex gap-10">
                <span className="w-32 text-sm text-text-secondary">
                  Ngày cập nhật
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {mockCategory.updatedAt}
                </span>
              </div>
              <div className="flex gap-10 items-center">
                <span className="w-32 text-sm text-text-secondary">
                  Người tạo
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src={mockCategory.createdBy.avatar}
                    className="w-6 h-6 rounded-full border border-border-ui"
                    alt=""
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {mockCategory.createdBy.name}
                  </span>
                </div>
              </div>
              <div className="flex gap-10 items-center">
                <span className="w-32 text-sm text-text-secondary shrink-0">
                  Cập nhật lần cuối bởi
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src={mockCategory.updatedBy.avatar}
                    className="w-6 h-6 rounded-full border border-border-ui"
                    alt=""
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {mockCategory.updatedBy.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products List Table */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border-ui flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-text-primary">
            Danh sách sản phẩm thuộc danh mục ({mockCategory.productCount})
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 bg-background-app/50 border border-border-ui rounded-lg text-sm focus:bg-card-white focus:border-accent outline-none transition-all w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-card-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm">
              <Filter className="w-4 h-4" />
              Lọc
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-card-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm">
              <FileDown className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-app/50 border-b border-border-ui">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {mockProducts.map((product) => (
                <tr
                  key={product.sku}
                  className="hover:bg-background-app/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {product.stt}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary font-mono">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {product.unit}
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 text-sm font-bold",
                      product.stock === 0
                        ? "text-danger"
                        : product.stock < 10
                          ? "text-warning"
                          : "text-success",
                    )}
                  >
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          product.status === "in_stock"
                            ? "bg-success"
                            : product.status === "low_stock"
                              ? "bg-warning"
                              : "bg-danger",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[12px] font-bold",
                          product.status === "in_stock"
                            ? "text-success"
                            : product.status === "low_stock"
                              ? "text-warning"
                              : "text-danger",
                        )}
                      >
                        {product.status === "in_stock"
                          ? "Còn hàng"
                          : product.status === "low_stock"
                            ? "Sắp hết"
                            : "Hết hàng"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {product.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border-ui flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Hiển thị</span>
            <select className="bg-card-white border border-border-ui rounded-lg px-2 py-1 text-sm outline-none">
              <option>10 dòng</option>
              <option>20 dòng</option>
              <option>50 dòng</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-border-ui rounded-lg hover:bg-background-app text-text-secondary disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 21].map((page, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                    page === 1
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-text-secondary hover:bg-background-app",
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="p-2 border border-border-ui rounded-lg hover:bg-background-app text-text-secondary">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-text-secondary">
            1 - 10 của <span className="font-bold text-text-primary">210</span>
          </div>
        </div>
      </div>
    </div>
  );
}
