"use client";

import React from "react";
import Link from "next/link";
import { Plus, FileUp } from "lucide-react";
import { CategoryTableConnected } from "./_components/CategoryTableConnected";
import {
  CategoryFiltersConnected,
  defaultCategoryFiltersValue,
  type CategoryFiltersValue,
} from "./_components/CategoryFiltersConnected";
import { Can } from "@/components/Can";
import type { GetCategoriesQuery } from "@wms/types";

function toQueryFilters(
  value: CategoryFiltersValue,
  debouncedSearch: string,
): Pick<GetCategoriesQuery, "search" | "isActive"> {
  const filters: Pick<GetCategoriesQuery, "search" | "isActive"> = {};
  const trimmed = debouncedSearch.trim();
  if (trimmed.length > 0) filters.search = trimmed;
  if (value.status === "active") filters.isActive = true;
  if (value.status === "inactive") filters.isActive = false;
  return filters;
}

export default function CategoriesPage() {
  const [filters, setFilters] = React.useState<CategoryFiltersValue>(
    defaultCategoryFiltersValue,
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
            Danh sách danh mục
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý và phân loại nhóm hàng hóa trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Can action="category.create">
            <Link
              href="/categories/import"
              className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <FileUp className="w-4 h-4" /> Nhập Excel
            </Link>
          </Can>
          <Can action="category.create">
            <Link
              href="/categories/new"
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4" /> Thêm danh mục
            </Link>
          </Can>
        </div>
      </div>

      <div className="space-y-5">
        <CategoryFiltersConnected value={filters} onChange={setFilters} />
        <CategoryTableConnected filters={queryFilters} />
      </div>
    </div>
  );
}
