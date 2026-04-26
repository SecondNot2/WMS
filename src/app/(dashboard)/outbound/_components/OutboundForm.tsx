"use client";

import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  Save,
  Package,
  Building,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const outboundItemSchema = z.object({
  productId: z.string().min(1, "Chọn sản phẩm"),
  sku: z.string(),
  name: z.string(),
  unit: z.string(),
  quantity: z.number().min(1, "Tối thiểu 1"),
  unitPrice: z.number().min(0, "Giá không âm"),
});

const outboundSchema = z.object({
  recipientId: z.string().min(1, "Chọn đơn vị nhận"),
  purpose: z.string().min(1, "Nhập lý do xuất"),
  note: z.string().optional(),
  items: z.array(outboundItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

type OutboundFormValues = z.infer<typeof outboundSchema>;

interface OutboundFormProps {
  initialData?: Partial<OutboundFormValues>;
  isEdit?: boolean;
}

export function OutboundForm({ initialData, isEdit }: OutboundFormProps) {
  const router = useRouter();

  // Mock data
  const recipients = [
    { id: "1", name: "Chi nhánh Lạng Sơn" },
    { id: "2", name: "Kho trung chuyển Hà Nội" },
    { id: "3", name: "Cửa hàng Outlet" },
  ];

  const products = [
    {
      id: "p1",
      sku: "SP001",
      name: "Chuột không dây Logitech M331",
      unit: "Cái",
      price: 550000,
      stock: 45,
    },
    {
      id: "p2",
      sku: "SP002",
      name: "Bàn phím cơ Keychron K2",
      unit: "Cái",
      price: 1500000,
      stock: 12,
    },
    {
      id: "p3",
      sku: "SP003",
      name: "Lót chuột Razer Gigantus V2",
      unit: "Cái",
      price: 450000,
      stock: 120,
    },
    {
      id: "p4",
      sku: "SP004",
      name: "Tai nghe Sony WH-1000XM4",
      unit: "Cái",
      price: 5200000,
      stock: 5,
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OutboundFormValues>({
    resolver: zodResolver(outboundSchema),
    defaultValues: initialData || {
      recipientId: "",
      purpose: "",
      note: "",
      items: [
        {
          productId: "",
          sku: "",
          name: "",
          unit: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
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

  const totalAmount =
    watchItems?.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice || 0);
    }, 0) || 0;

  const onProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.sku`, product.sku);
      setValue(`items.${index}.name`, product.name);
      setValue(`items.${index}.unit`, product.unit);
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const onSubmit = (data: OutboundFormValues) => {
    console.log("Submit Outbound Data:", data);
    // TODO: POST /goods-issues
    router.push("/outbound");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 md:p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Building className="w-5 h-5 text-accent" />
                Thông tin điểm đến
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Đơn vị nhận <span className="text-danger">*</span>
                  </label>
                  <select
                    {...register("recipientId")}
                    className={cn(
                      "w-full px-4 py-2.5 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-all",
                      errors.recipientId ? "border-danger" : "border-border-ui",
                    )}
                  >
                    <option value="">Chọn đơn vị nhận</option>
                    {recipients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {errors.recipientId && (
                    <p className="text-xs text-danger mt-1">
                      {errors.recipientId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Lý do xuất <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register("purpose")}
                    placeholder="VD: Xuất hàng cho chi nhánh..."
                    className={cn(
                      "w-full px-4 py-2.5 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-all",
                      errors.purpose ? "border-danger" : "border-border-ui",
                    )}
                  />
                  {errors.purpose && (
                    <p className="text-xs text-danger mt-1">
                      {errors.purpose.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Ghi chú thêm
                </label>
                <textarea
                  {...register("note")}
                  rows={2}
                  placeholder="Nhập ghi chú thêm nếu có..."
                  className="w-full px-4 py-2.5 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-all resize-none"
                />
              </div>
            </div>

            <hr className="border-border-ui/50" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Danh sách hàng hóa xuất
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      productId: "",
                      sku: "",
                      name: "",
                      unit: "",
                      quantity: 1,
                      unitPrice: 0,
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-card-white border border-accent text-accent rounded-lg font-medium text-xs hover:bg-accent/5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Thêm dòng
                </button>
              </div>

              <div className="overflow-x-auto -mx-6 md:-mx-8">
                <table className="w-full text-left min-w-200">
                  <thead className="bg-background-app/50 border-b border-border-ui">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-12">
                        STT
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                        Sản phẩm / Tồn kho
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-32">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-40">
                        Đơn giá xuất
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider w-40 text-right">
                        Thành tiền
                      </th>
                      <th className="px-6 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-ui">
                    {fields.map((field, index) => {
                      const selectedProduct = products.find(
                        (p) => p.id === watchItems?.[index]?.productId,
                      );
                      const isOverStock =
                        selectedProduct &&
                        (watchItems?.[index]?.quantity || 0) >
                          selectedProduct.stock;

                      return (
                        <tr key={field.id} className="group">
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              {...register(`items.${index}.productId` as const)}
                              onChange={(e) =>
                                onProductChange(index, e.target.value)
                              }
                              className={cn(
                                "w-full px-3 py-2 text-sm bg-card-white border rounded-lg outline-none focus:border-accent transition-all",
                                errors.items?.[index]?.productId
                                  ? "border-danger"
                                  : "border-border-ui",
                              )}
                            >
                              <option value="">Tìm sản phẩm...</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.sku} - {p.name}
                                </option>
                              ))}
                            </select>
                            {selectedProduct && (
                              <div
                                className={cn(
                                  "mt-1.5 flex items-center gap-1.5 text-[11px] font-medium",
                                  isOverStock
                                    ? "text-danger"
                                    : "text-text-secondary",
                                )}
                              >
                                {isOverStock ? (
                                  <AlertCircle className="w-3 h-3" />
                                ) : (
                                  <Info className="w-3 h-3" />
                                )}
                                Tồn hiện tại: {selectedProduct.stock}{" "}
                                {selectedProduct.unit}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              {...register(`items.${index}.quantity` as const, {
                                valueAsNumber: true,
                              })}
                              className={cn(
                                "w-full px-3 py-2 text-sm bg-card-white border rounded-lg outline-none focus:border-accent transition-all text-center",
                                isOverStock
                                  ? "border-danger text-danger"
                                  : "border-border-ui",
                              )}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              {...register(
                                `items.${index}.unitPrice` as const,
                                { valueAsNumber: true },
                              )}
                              className="w-full px-3 py-2 text-sm bg-card-white border border-border-ui rounded-lg outline-none focus:border-accent transition-all text-right font-medium"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-text-primary text-right">
                            {new Intl.NumberFormat("vi-VN").format(
                              (watchItems?.[index]?.quantity || 0) *
                                (watchItems?.[index]?.unitPrice || 0),
                            )}{" "}
                            đ
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="w-1 h-3 bg-accent rounded-full" />
              Tổng hợp phiếu xuất
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary font-medium">
                  Số mặt hàng:
                </span>
                <span className="text-text-primary font-bold">
                  {fields.length}
                </span>
              </div>

              <hr className="border-border-ui/50 my-2" />

              <div className="space-y-1">
                <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">
                  Tổng giá trị phiếu
                </p>
                <p className="text-2xl font-black text-accent tracking-tighter">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
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

            <div className="mt-6 p-4 bg-warning/5 rounded-lg border border-warning/10">
              <p className="text-[11px] text-warning leading-relaxed">
                <strong>Lưu ý:</strong> Hệ thống sẽ kiểm tra tồn kho tại thời
                điểm phê duyệt. Nếu số lượng tồn kho không đủ, phiếu xuất sẽ bị
                từ chối tự động.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
