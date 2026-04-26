"use client";

import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Pencil, 
  Trash2, 
  User, 
  Calendar, 
  Hash, 
  FileText,
  Package,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface InboundDetailViewProps {
  id: string;
}

export function InboundDetailView({ id }: InboundDetailViewProps) {
  const router = useRouter();

  // TODO: Replace with useQuery -> GET /goods-receipts/:id
  const mockReceipt = {
    id: id,
    code: "PNK-2024-0056",
    status: "PENDING",
    supplier: {
      name: "Công ty TNHH An Phát",
      address: "Số 123, Đường ABC, Quận XYZ, Hà Nội",
      phone: "0901 234 567",
      taxCode: "0123456789"
    },
    items: [
      { id: "1", sku: "SP001", name: "Chuột không dây Logitech M331", unit: "Cái", quantity: 100, price: 450000, total: 45000000 },
      { id: "2", sku: "SP002", name: "Bàn phím cơ Keychron K2", unit: "Cái", quantity: 50, price: 1200000, total: 60000000 },
      { id: "3", sku: "SP003", name: "Lót chuột Razer Gigantus V2", unit: "Cái", quantity: 200, price: 350000, total: 70000000 },
    ],
    totalAmount: 175000000,
    note: "Nhập hàng linh kiện máy tính tháng 5/2024",
    createdBy: {
      name: "Trần Thị B",
      role: "Nhân viên kho",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=B"
    },
    createdAt: "17/05/2024 09:00",
    approvedBy: null,
    approvedAt: null,
  };

  const STATUS_CONFIG = {
    PENDING: { label: "Đang chờ duyệt", cls: "bg-warning/10 text-warning", icon: Clock },
    APPROVED: { label: "Đã duyệt", cls: "bg-success/10 text-success", icon: CheckCircle2 },
    REJECTED: { label: "Đã từ chối", cls: "bg-danger/10 text-danger", icon: XCircle },
  };

  const currentStatus = STATUS_CONFIG[mockReceipt.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="w-full space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">Phiếu nhập {mockReceipt.code}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                currentStatus.cls
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {currentStatus.label}
              </span>
            </div>
            <p className="text-sm text-text-secondary">Ngày tạo: {mockReceipt.createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mockReceipt.status === "PENDING" && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/90 text-white rounded-lg font-bold text-sm shadow-md shadow-success/20 transition-all">
                <CheckCircle2 className="w-4 h-4" /> Duyệt phiếu
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg font-bold text-sm shadow-md shadow-danger/20 transition-all">
                <XCircle className="w-4 h-4" /> Từ chối
              </button>
              <div className="w-px h-8 bg-border-ui mx-1" />
              <button 
                onClick={() => router.push(`/inbound/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border-ui rounded-lg text-text-primary hover:bg-background-app transition-colors font-medium text-sm shadow-sm"
              >
                <Pencil className="w-4 h-4" /> Sửa
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-danger/20 rounded-lg text-danger hover:bg-danger/5 transition-colors font-medium text-sm shadow-sm">
                <Trash2 className="w-4 h-4" /> Xóa
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-base font-bold text-text-primary">Thông tin chung</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <User className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Nhà cung cấp</p>
                    <p className="text-sm font-bold text-text-primary">{mockReceipt.supplier.name}</p>
                    <p className="text-[12px] text-text-secondary mt-1">{mockReceipt.supplier.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <Hash className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Mã số thuế</p>
                    <p className="text-sm font-medium text-text-primary">{mockReceipt.supplier.taxCode}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background-app rounded-lg">
                    <FileText className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Ghi chú</p>
                    <p className="text-sm text-text-primary leading-relaxed italic">
                      "{mockReceipt.note}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-ui flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">Danh mục hàng hóa nhập</h3>
              </div>
              <span className="text-xs font-bold text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                {mockReceipt.items.length} SẢN PHẨM
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] border-b border-border-ui">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">Số lượng</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">Đơn giá</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {mockReceipt.items.map((item) => (
                    <tr key={item.id} className="hover:bg-background-app/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-text-secondary">{item.sku}</td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-text-primary text-right font-medium">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-4 text-sm text-text-primary text-right">
                        {new Intl.NumberFormat("vi-VN").format(item.price)} đ
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                        {new Intl.NumberFormat("vi-VN").format(item.total)} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#f8fafc]/50 font-bold">
                  <tr>
                    <td colSpan={4} className="px-6 py-5 text-sm text-text-primary text-right border-t border-border-ui">
                      Tổng giá trị phiếu nhập:
                    </td>
                    <td className="px-6 py-5 text-lg text-accent text-right border-t border-border-ui tracking-tight">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(mockReceipt.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Creator & Status Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border-ui shadow-sm p-6">
            <h3 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
              <span className="w-1 h-3 bg-accent rounded-full" />
              Thông tin hệ thống
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img src={mockReceipt.createdBy.avatar} className="w-12 h-12 rounded-xl border-2 border-border-ui" alt="" />
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Người lập phiếu</p>
                  <p className="text-sm font-bold text-text-primary">{mockReceipt.createdBy.name}</p>
                  <p className="text-xs text-text-secondary">{mockReceipt.createdBy.role}</p>
                </div>
              </div>

              <hr className="border-border-ui/50" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold">Ngày khởi tạo</p>
                    <p className="text-sm font-medium text-text-primary">{mockReceipt.createdAt}</p>
                  </div>
                </div>
                
                {mockReceipt.status !== "PENDING" && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-text-secondary" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold">Ngày phê duyệt</p>
                      <p className="text-sm font-medium text-text-primary">{mockReceipt.approvedAt || "---"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-accent/5 rounded-xl border border-accent/10 p-6">
            <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Thông tin bổ sung</h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Phiếu nhập kho này sau khi được phê duyệt sẽ tự động cập nhật số lượng tồn kho cho từng sản phẩm tương ứng trong hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add simple Clock icon import
function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
