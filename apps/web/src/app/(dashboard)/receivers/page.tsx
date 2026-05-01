"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  ReceiverFiltersConnected,
  defaultReceiverFiltersValue,
  type ReceiverFiltersValue,
} from "./_components/ReceiverFiltersConnected";
import { ReceiverStatsSidebarConnected } from "./_components/ReceiverStatsSidebarConnected";
import { ReceiverTableConnected } from "./_components/ReceiverTableConnected";
import { Can } from "@/components/Can";
import { PageHeader } from "@/components/PageHeader";
import type { GetRecipientsQuery } from "@wms/types";

function toQueryFilters(
  value: ReceiverFiltersValue,
  debouncedSearch: string,
): Pick<GetRecipientsQuery, "search" | "isActive"> {
  const filters: Pick<GetRecipientsQuery, "search" | "isActive"> = {};
  const trimmed = debouncedSearch.trim();
  if (trimmed.length > 0) filters.search = trimmed;
  if (value.status === "active") filters.isActive = true;
  if (value.status === "inactive") filters.isActive = false;
  return filters;
}

export default function ReceiversPage() {
  const [filters, setFilters] = React.useState<ReceiverFiltersValue>(
    defaultReceiverFiltersValue,
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
      <PageHeader
        title="Đơn vị nhận hàng"
        description="Quản lý các chi nhánh, kho trung chuyển và đối tác nhận hàng"
        actions={
          <Can action="recipient.create">
            <Link
              href="/receivers/new"
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4" /> Thêm đơn vị
            </Link>
          </Can>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-9 space-y-5">
          <ReceiverFiltersConnected value={filters} onChange={setFilters} />
          <ReceiverTableConnected filters={queryFilters} />
        </div>
        <div className="xl:col-span-3 h-full">
          <ReceiverStatsSidebarConnected className="h-full" />
        </div>
      </div>
    </div>
  );
}
