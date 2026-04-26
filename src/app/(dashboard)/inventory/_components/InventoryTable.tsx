"use client";

import React from "react";
import { DashboardTable } from "@/components/DashboardTable";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUpRight, History } from "lucide-react";
import Link from "next/link";

export function InventoryTable() {
  // TODO: Replace with useQuery -> GET /stock
  const mockStock = [
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

  const columns = [
    {
      header: "Sản phẩm",
      accessor: "name",
      render: (val: unknown, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-background-app border border-border-ui overflow-hidden p-1 shrink-0">
            <img src={row.image} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-text-secondary uppercase tracking-tighter">{row.sku}</span>
            <Link href={`/products/${row.id}`} className="text-sm font-bold text-text-primary hover:text-accent transition-colors truncate max-w-50">
              {val as string}
            </Link>
          </div>
        </div>
      ),
    },
    {
      header: "Danh mục",
      accessor: "category",
      render: (val: unknown) => (
        <span className="px-2.5 py-1 bg-background-app rounded-lg text-xs text-text-secondary border border-border-ui/50">
          {val as string}
        </span>
      )
    },
    {
      header: "Tồn kho hiện tại",
      accessor: "currentStock",
      render: (val: unknown, row: any) => {
        const stock = val as number;
        const isLow = stock <= row.minStock && stock > 0;
        const isOut = stock <= 0;
        
        return (
          <div className="flex flex-col gap-1.5 min-w-30">
            <div className="flex justify-between items-end">
              <span className={cn(
                "text-base font-black tracking-tight",
                isOut ? "text-danger" : isLow ? "text-warning" : "text-text-primary"
              )}>
                {stock} <span className="text-[10px] font-medium text-text-secondary uppercase">{row.unit}</span>
              </span>
              <span className="text-[10px] text-text-secondary font-bold">Ngưỡng: {row.minStock}</span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-background-app rounded-full overflow-hidden border border-border-ui/30">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isOut ? "w-0" : isLow ? "bg-warning w-[30%]" : "bg-success w-[80%]"
                )}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Trạng thái",
      accessor: "id",
      render: (_: unknown, row: any) => {
        const isLow = row.currentStock <= row.minStock && row.currentStock > 0;
        const isOut = row.currentStock <= 0;
        
        if (isOut) return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-danger/10 text-danger rounded-full text-[10px] font-black uppercase tracking-widest border border-danger/20">
            <AlertCircle className="w-3 h-3" /> Hết hàng
          </span>
        );
        
        if (isLow) return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-warning/10 text-warning rounded-full text-[10px] font-black uppercase tracking-widest border border-warning/20">
            <AlertCircle className="w-3 h-3" /> Sắp hết
          </span>
        );
        
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/10 text-success rounded-full text-[10px] font-black uppercase tracking-widest border border-success/20">
            An toàn
          </span>
        );
      }
    },
    {
      header: "Thành tiền tồn",
      accessor: "costPrice",
      render: (val: unknown, row: any) => (
        <div className="text-right">
          <p className="text-sm font-bold text-text-primary">
            {new Intl.NumberFormat("vi-VN").format((val as number) * row.currentStock)} đ
          </p>
          <p className="text-[10px] text-text-secondary">Giá nhập: {new Intl.NumberFormat("vi-VN").format(val as number)}</p>
        </div>
      )
    },
    {
      header: "",
      accessor: "id",
      render: (val: unknown) => (
        <div className="flex justify-end gap-2">
          <button className="p-2 hover:bg-background-app rounded-lg text-text-secondary hover:text-accent transition-all group" title="Lịch sử tồn kho">
            <History className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-background-app rounded-lg text-text-secondary hover:text-accent transition-all flex items-center gap-1 text-[11px] font-bold" title="Lập phiếu nhập">
            Nhập <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardTable 
      title=""
      columns={columns}
      data={mockStock}
    />
  );
}
