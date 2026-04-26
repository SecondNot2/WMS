"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Package, 
  User, 
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const inboundItemSchema = z.object({
  productId: z.string().min(1, "Chọn sản phẩm"),
  sku: z.string(),
  name: z.string(),
  unit: z.string(),
  quantity: z.number().min(1, "Tối thiểu 1"),
  unitPrice: z.number().min(0, "Giá không âm"),
});

const inboundSchema = z.object({
  supplierId: z.string().min(1, "Chọn nhà cung cấp"),
  note: z.string().optional(),
  items: z.array(inboundItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

type InboundFormValues = z.infer<typeof inboundSchema>;

interface InboundFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function InboundForm({ initialData, isEdit }: InboundFormProps) {
  const router = useRouter();
  
  // Mock data for selectors
  const suppliers = [
    { id: "1", name: "Công ty TNHH An Phát" },
    { id: "2", name: "Hợp tác xã Công nghệ" },
    { id: "3", name: "Tổng kho Logistics" },
  ];

  const products = [
    { id: "p1", sku: "SP001", name: "Chuột không dây Logitech M331", unit: "Cái", costPrice: 450000 },
    { id: "p2", sku: "SP002", name: "Bàn phím cơ Keychron K2", unit: "Cái", costPrice: 1200000 },
    { id: "p3", sku: "SP003", name: "Lót chuột Razer Gigantus V2", unit: "Cái", costPrice: 350000 },
    { id: "p4", sku: "SP004", name: "Tai nghe Sony WH-1000XM4", unit: "Cái", costPrice: 4500000 },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<InboundFormValues>({
    resolver: zodResolver(inboundSchema),
    defaultValues: initialData || {
      supplierId: "",
      note: "",
      items: [{ productId: "", sku: "", name: "", unit: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = useWatch({
    control,
    name: "items",
  });

  const totalAmount = watchItems?.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice || 0);
  }, 0) || 0;

  const onProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.sku`, product.sku);
      setValue(`items.${index}.name`, product.name);
      setValue(`items.${index}.unit`, product.unit);
      setValue(`items.${index}.unitPrice`, product.costPrice);
    }
  };

  const onSubmit = (data: InboundFormValues) => {
    console.log("Submit Inbound Data:", data);
    // TODO: POST /goods-receipts
    router.push("/inbound");
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary mt-2">
              {isEdit ? "Chỉnh sửa phiếu nhập" : "Lập phiếu nhập kho"}
            </h1>
            <p className="text-sm text-text-secondary">
              Điền thông tin nhà cung cấp và danh sách hàng hóa nhập kho
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border-ui shadow-sm p-6 md:p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Thông tin nguồn hàng
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Nhà cung cấp <span className="text-danger">*</span>
                    </label>
                    <select
                      {...register("supplierId")}
                      className={cn(
                        "w-full px-4 py-2.5 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-all",
                        errors.supplierId ? "border-danger" : "border-border-ui"
                      )}
                    >
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    {errors.supplierId && <p className="text-xs text-danger mt-1">{errors.supplierId.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Ghi chú</label>
                    <input
                      {...register("note")}
                      placeholder="Nhập ghi chú thêm nếu có..."
                      className="w-full px-4 py-2.5 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-border-ui/50" />

              {/* Items Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" />
                    Danh sách hàng hóa nhập
                  </h3>
                  <button
                    type="button"
                    onClick={() => append({ productId: "", sku: "", name: "", unit: "", quantity: 1, unitPrice: 0 })}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-accent text-accent rounded-lg font-bold text-xs hover:bg-accent/5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Thêm dòng
                  </button>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-8">
                  <table className="w-full text-left min-w-200">
                    <thead className="bg-[#f8fafc] border-b border-border-ui">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-12">STT</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Sản phẩm</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-32">Số lượng</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-40">Đơn giá nhập</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-40 text-right">Thành tiền</th>
                        <th className="px-6 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-ui">
                      {fields.map((field, index) => (
                        <tr key={field.id} className="group">
                          <td className="px-6 py-4 text-sm text-text-secondary">{index + 1}</td>
                          <td className="px-6 py-4">
                            <select
                              {...register(`items.${index}.productId` as const)}
                              onChange={(e) => onProductChange(index, e.target.value)}
                              className={cn(
                                "w-full px-3 py-2 text-sm bg-white border rounded-lg outline-none focus:border-accent transition-all",
                                errors.items?.[index]?.productId ? "border-danger" : "border-border-ui"
                              )}
                            >
                              <option value="">Tìm sản phẩm...</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                              className="w-full px-3 py-2 text-sm bg-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all text-center"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                              className="w-full px-3 py-2 text-sm bg-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all text-right font-medium"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                            {new Intl.NumberFormat("vi-VN").format((watchItems?.[index]?.quantity || 0) * (watchItems?.[index]?.unitPrice || 0))} đ
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-text-secondary hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {errors.items?.root && (
                    <div className="p-4 bg-danger/5 border-t border-danger/20 flex items-center gap-2 text-danger text-sm">
                      <AlertCircle className="w-4 h-4" /> {errors.items.root.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border-ui shadow-sm p-6 sticky top-24">
              <h3 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-3 bg-accent rounded-full" />
                Tổng hợp phiếu nhập
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary font-medium">Số lượng mặt hàng:</span>
                  <span className="text-text-primary font-bold">{fields.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary font-medium">Tổng số lượng SP:</span>
                  <span className="text-text-primary font-bold">
                    {watchItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                  </span>
                </div>
                
                <hr className="border-border-ui/50 my-2" />
                
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Tổng giá trị phiếu</p>
                  <p className="text-2xl font-black text-accent tracking-tighter">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalAmount)}
                  </p>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full py-2.5 border border-border-ui rounded-lg text-sm font-bold text-text-secondary hover:bg-background-app transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-sm shadow-md shadow-accent/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Lưu phiếu
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-info/5 rounded-lg border border-info/10">
                <p className="text-[11px] text-info leading-relaxed">
                  <strong>Lưu ý:</strong> Sau khi lưu, phiếu sẽ ở trạng thái <strong>Chờ duyệt</strong>. Tồn kho chỉ được cập nhật sau khi quản trị viên phê duyệt phiếu này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
