"use client";

import { useParams } from "next/navigation";
import { SupplierForm } from "../../_components/SupplierForm";

export default function EditSupplierPage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "Công ty TNHH An Phát",
    contactPerson: "Nguyễn Hoàng Nam",
    phone: "0901 234 567",
    email: "contact@anphat.vn",
    taxCode: "0101234567",
    address: "Số 25, đường Logistics, Long Biên, Hà Nội",
    note: `Đang chỉnh sửa nhà cung cấp ${id}`,
    isActive: true,
  };

  return (
    <div className="p-6 w-full">
      <SupplierForm initialData={mockData} isEdit />
    </div>
  );
}
