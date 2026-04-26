"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUpRight, History, Package } from "lucide-react";
import { Pagination } from "@/components/Pagination";

interface StockRow {
  id: string;
  sku: string;
  name: string;
  image: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPrice: number;
}

const mockStock: StockRow[] = [
  {
    id: "1",
    sku: "SP000123",
    name: "Tai nghe Bluetooth Sony WH-1000XM4",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=sony",
    category: "Điện tử",
    unit: "Cái",
    currentStock: 3,
    minStock: 10,
    costPrice: 4500000,
  },
  {
    id: "2",
    sku: "SP000124",
    name: "Chuột không dây Logitech M331",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=logi",
    category: "Phụ kiện",
    unit: "Cái",
    currentStock: 156,
    minStock: 20,
    costPrice: 350000,
  },
  {
    id: "3",
    sku: "SP000125",
    name: "Bàn phím cơ Keychron K2",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=key",
    category: "Phụ kiện",
    unit: "Cái",
    currentStock: 0,
    minStock: 5,
    costPrice: 1200000,
  },
  {
    id: "4",
    sku: "SP000126",
    name: "Màn hình Dell UltraSharp U2419H",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=dell",
    category: "Màn hình",
    unit: "Cái",
    currentStock: 12,
    minStock: 5,
    costPrice: 5500000,
  },
  {
    id: "5",
    sku: "SP000127",
    name: "Loa Bluetooth JBL Flip 5",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=jbl",
    category: "Điện tử",
    unit: "Cái",
    currentStock: 8,
    minStock: 15,
    costPrice: 2100000,
  },
];

export function InventoryTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const stock = mockStock;

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
            {stock.length > 0 ? (
              stock.map((row) => {
                const isLow = row.currentStock <= row.minStock && row.currentStock > 0;
                const isOut = row.currentStock <= 0;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-background-app/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background-app border border-border-ui overflow-hidden p-1 shrink-0">
                          <img
                            src={row.image}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <Link
                            href={`/products/${row.id}`}
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
                        {row.category}
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
                          row.costPrice * row.currentStock,
                        )}{" "}
                        đ
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Giá nhập:{" "}
                        {new Intl.NumberFormat("vi-VN").format(row.costPrice)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 hover:bg-accent/10 text-accent rounded-md transition-colors"
                          title="Lịch sử tồn kho"
                        >
                          <History className="w-4 h-4" />
                        </button>
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
        currentPage={currentPage}
        totalPages={6}
        pageSize={pageSize}
        totalItems={56}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
