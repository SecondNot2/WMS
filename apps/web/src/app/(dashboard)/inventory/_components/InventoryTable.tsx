"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpRight,
  History,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { useInventory } from "@/lib/hooks/use-inventory";
import { getApiErrorMessage } from "@/lib/api/client";
import type { GetInventoryQuery, InventoryItem } from "@wms/types";

interface InventoryTableProps {
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  onAdjust?: (item: InventoryItem) => void;
}

export function InventoryTable({
  search,
  categoryId,
  lowStock,
  onAdjust,
}: InventoryTableProps) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const filterKey = `${search ?? ""}|${categoryId ?? ""}|${lowStock ? 1 : 0}|${limit}`;
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const queryParams = React.useMemo<GetInventoryQuery>(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(lowStock ? { lowStock: true } : {}),
    }),
    [page, limit, search, categoryId, lowStock],
  );

  const { data, isLoading, isError, error } = useInventory(queryParams);
  const stock = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-background-app/50 border-b border-border-ui">
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Tồn kho hiện tại
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Thành tiền tồn
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ui">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-sm text-text-secondary"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-sm text-danger"
                >
                  {getApiErrorMessage(error, "Không thể tải dữ liệu tồn kho")}
                </td>
              </tr>
            ) : stock.length > 0 ? (
              stock.map((row) => {
                const isLow =
                  row.currentStock <= row.minStock && row.currentStock > 0;
                const isOut = row.currentStock <= 0;
                return (
                  <tr
                    key={row.productId}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background-app border border-border-ui flex items-center justify-center shrink-0 text-text-secondary">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <Link
                            href={`/products/${row.productId}`}
                            className="text-[13px] font-semibold text-text-primary hover:text-accent transition-colors truncate max-w-50"
                          >
                            {row.name}
                          </Link>
                          <span className="text-[11px] text-text-secondary font-mono">
                            {row.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] px-2 py-0.5 rounded bg-accent/5 text-accent border border-accent/10">
                        {row.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5 min-w-30">
                        <div className="flex justify-between items-end">
                          <span
                            className={cn(
                              "text-base font-bold tracking-tight",
                              isOut
                                ? "text-danger"
                                : isLow
                                  ? "text-warning"
                                  : "text-text-primary",
                            )}
                          >
                            {row.currentStock}{" "}
                            <span className="text-[10px] font-medium text-text-secondary uppercase">
                              {row.unit}
                            </span>
                          </span>
                          <span className="text-[10px] text-text-secondary font-bold">
                            Ngưỡng: {row.minStock}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-background-app rounded-full overflow-hidden border border-border-ui/30">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              isOut
                                ? "w-0"
                                : isLow
                                  ? "bg-warning w-[30%]"
                                  : "bg-success w-[80%]",
                            )}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-danger/10 text-danger rounded-full text-[11px] font-medium">
                          <AlertCircle className="w-3 h-3" /> Hết hàng
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-warning/10 text-warning rounded-full text-[11px] font-medium">
                          <AlertCircle className="w-3 h-3" /> Sắp hết
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success/10 text-success rounded-full text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          An toàn
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-[13px] font-bold text-text-primary">
                        {new Intl.NumberFormat("vi-VN").format(
                          Math.round(row.stockValue),
                        )}{" "}
                        đ
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Giá nhập:{" "}
                        {row.costPrice !== null
                          ? new Intl.NumberFormat("vi-VN").format(row.costPrice)
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onAdjust && (
                          <button
                            type="button"
                            onClick={() => onAdjust(row)}
                            className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                            title="Điều chỉnh tồn kho"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={`/products/${row.productId}`}
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Lịch sử tồn kho"
                        >
                          <History className="w-4 h-4" />
                        </Link>
                        <Link
                          href="/inbound/new"
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors flex items-center gap-1 text-[11px] font-bold"
                          title="Lập phiếu nhập"
                        >
                          Nhập <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-background-app flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-text-secondary" />
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      Không có dữ liệu tồn kho
                    </p>
                    <p className="text-xs text-text-secondary">
                      Thử thay đổi bộ lọc hoặc nhập kho thêm
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={meta?.page ?? page}
        totalPages={meta?.totalPages ?? 1}
        pageSize={limit}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => setLimit(size)}
      />
    </div>
  );
}
