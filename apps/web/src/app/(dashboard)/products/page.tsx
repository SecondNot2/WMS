"use client";

import React from "react";
import Link from "next/link";
import { Plus, Download, FileUp } from "lucide-react";
import { ProductTableConnected } from "./_components/ProductTableConnected";
import {
  ProductFilters,
  defaultProductFiltersValue,
  type ProductFiltersValue,
} from "./_components/ProductFilters";
import { ProductStatsSidebar } from "./_components/ProductStatsSidebar";
import { Can } from "@/components/Can";
import type { GetProductsQuery } from "@wms/types";

function toQueryFilters(value: ProductFiltersValue, debouncedSearch: string) {
  const filters: Pick<
    GetProductsQuery,
    "search" | "lowStock" | "isActive" | "categoryId"
  > = {};
  const trimmed = debouncedSearch.trim();
  if (trimmed.length > 0) filters.search = trimmed;
  if (value.stock === "lowStock") filters.lowStock = true;
  if (value.stock === "inactive") filters.isActive = false;
  if (value.categoryId) filters.categoryId = value.categoryId;
  return filters;
}

export default function ProductsPage() {
  const [filters, setFilters] = React.useState<ProductFiltersValue>(
    defaultProductFiltersValue,
  );
  const [debouncedSearch, setDebouncedSearch] = React.useState(filters.search);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [filters.search]);

  const queryFilters = React.useMemo(
    () => toQueryFilters(filters, debouncedSearch),
    [filters, debouncedSearch],
  );

  return (
    <div className="p-5 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Danh sách sản phẩm
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý toàn bộ hàng hóa trong kho
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
          <Can action="product.import">
            <Link
              href="/products/import"
              className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <FileUp className="w-4 h-4" /> Nhập Excel
            </Link>
          </Can>
          <Can action="product.create">
            <Link
              href="/products/new"
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4" /> Thêm sản phẩm
            </Link>
          </Can>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Main Content Area */}
        <div className="xl:col-span-9 space-y-5">
          <ProductFilters value={filters} onChange={setFilters} />
          <ProductTableConnected filters={queryFilters} />
        </div>

        {/* Sidebar Area */}
        <div className="xl:col-span-3 h-full">
          <ProductStatsSidebar className="h-full" />
        </div>
      </div>
    </div>
  );
}
