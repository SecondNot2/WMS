"use client";

import React from "react";
import Link from "next/link";
import { Box, Database, History, Package, Pencil } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/client";
import { useProduct } from "@/lib/hooks/use-products";
import { cn } from "@/lib/utils";

interface ProductDetailViewConnectedProps {
  id: string;
}

function formatMoney(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProductDetailViewConnected({ id }: ProductDetailViewConnectedProps) {
  const [activeTab, setActiveTab] = React.useState<"general" | "inventory" | "history">("general");
  const { data: product, isLoading, error } = useProduct(id);

  const tabs = [
    { id: "general", label: "Thông tin chung", icon: Box },
    { id: "inventory", label: "Tồn kho", icon: Database },
    { id: "history", label: "Lịch sử thay đổi", icon: History },
  ] as const;

  if (isLoading) {
    return (
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-8 text-sm text-text-secondary">
        Đang tải chi tiết sản phẩm...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-8 text-sm text-danger">
        {getApiErrorMessage(error, "Không thể tải chi tiết sản phẩm")}
      </div>
    );
  }

  const stockStatus = product.currentStock <= 0
    ? "Hết hàng"
    : product.currentStock <= product.minStock
      ? "Sắp hết"
      : "Còn hàng";

  return (
    <div className="space-y-6">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          <div className="w-full md:w-48 aspect-square rounded-xl border border-border-ui overflow-hidden bg-background-app/30 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-12 h-12 text-text-secondary" />
            )}
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent uppercase tracking-wider">
                    {product.category.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider">
                    {stockStatus}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary">{product.name}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  SKU: <span className="font-semibold text-text-primary">{product.sku}</span> | Mã vạch: <span className="font-semibold text-text-primary">{product.barcode ?? "—"}</span>
                </p>
              </div>
              <Link href={`/products/${id}/edit`} className="px-4 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-sm font-bold transition-all shadow-lg shadow-accent/20 flex items-center gap-2">
                <Pencil className="w-4 h-4" /> Chỉnh sửa
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border-ui/50">
              <Metric label="Giá vốn" value={formatMoney(product.costPrice)} />
              <Metric label="Giá bán" value={formatMoney(product.salePrice)} accent />
              <Metric label="Tồn hiện tại" value={`${product.currentStock} ${product.unit}`} success />
              <Metric label="Tồn tối thiểu" value={`${product.minStock} ${product.unit}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border-ui overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary hover:bg-background-app/50",
            )}
          >
            <tab.icon className="w-4.5 h-4.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Mô tả sản phẩm</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{product.description ?? "Chưa có mô tả"}</p>
          </div>
          <div className="md:col-span-4 bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Thông tin kỹ thuật</h3>
            <Info label="Thương hiệu" value={product.brand ?? "—"} />
            <Info label="Model" value={product.model ?? "—"} />
            <Info label="Đơn vị" value={product.unit} />
            <Info label="Vị trí" value={product.location ?? "—"} />
            <Info label="Ngày tạo" value={formatDate(product.createdAt)} />
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Thông tin tồn kho</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric label="Tồn hiện tại" value={`${product.currentStock} ${product.unit}`} success />
            <Metric label="Ngưỡng cảnh báo" value={`${product.minStock} ${product.unit}`} />
            <Metric label="Trạng thái" value={stockStatus} accent />
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background-app/50 border-b border-border-ui">
                <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">Thời gian</th>
                <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">Loại</th>
                <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">Số lượng</th>
                <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">Tồn kho</th>
                <th className="px-5 py-3 text-[11px] font-bold text-text-secondary uppercase">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {product.recentStockHistory.length > 0 ? product.recentStockHistory.map((row) => (
                <tr key={row.id} className="hover:bg-background-app/20">
                  <td className="px-5 py-4 text-xs text-text-secondary">{formatDate(row.createdAt)}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-accent">{row.type}</td>
                  <td className="px-5 py-4 text-sm font-bold text-text-primary">{row.quantity}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{row.stockBefore} → {row.stockAfter}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{row.note ?? row.refCode ?? "—"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-text-secondary">Chưa có lịch sử tồn kho</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, accent, success }: { label: string; value: string; accent?: boolean; success?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">{label}</p>
      <p className={cn("text-lg font-bold text-text-primary", accent && "text-accent", success && "text-success")}>{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-ui/50 last:border-0">
      <span className="text-xs text-text-secondary font-medium">{label}</span>
      <span className="text-xs text-text-primary font-bold">{value}</span>
    </div>
  );
}
