"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  SupplierFiltersConnected,
  defaultSupplierFiltersValue,
  type SupplierFiltersValue,
} from "./_components/SupplierFiltersConnected";
import { SupplierStatsSidebarConnected } from "./_components/SupplierStatsSidebarConnected";
import { SupplierTableConnected } from "./_components/SupplierTableConnected";
import { Can } from "@/components/Can";
import type { GetSuppliersQuery } from "@wms/types";

function toQueryFilters(
  value: SupplierFiltersValue,
  debouncedSearch: string,
): Pick<GetSuppliersQuery, "search" | "isActive"> {
  const filters: Pick<GetSuppliersQuery, "search" | "isActive"> = {};
  const trimmed = debouncedSearch.trim();
  if (trimmed.length > 0) filters.search = trimmed;
  if (value.status === "active") filters.isActive = true;
  if (value.status === "inactive") filters.isActive = false;
  return filters;
}

export default function SuppliersPage() {
  const [filters, setFilters] = React.useState<SupplierFiltersValue>(
    defaultSupplierFiltersValue,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Nhà cung cấp</h1>
          <p className="text-xs text-text-secondary mt-1">
            Quản lý đối tác cung ứng hàng hóa và lịch sử nhập kho
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Can action="supplier.create">
            <Link
              href="/suppliers/new"
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4" /> Thêm nhà cung cấp
            </Link>
          </Can>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-9 space-y-5">
          <SupplierFiltersConnected value={filters} onChange={setFilters} />
          <SupplierTableConnected filters={queryFilters} />
        </div>
        <div className="xl:col-span-3 h-full">
          <SupplierStatsSidebarConnected className="h-full" />
        </div>
      </div>
    </div>
  );
}
