"use client";

import { useParams } from "next/navigation";
import { ReceiverForm } from "../../_components/ReceiverForm";

export default function EditReceiverPage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "Chi nhánh Lạng Sơn",
    type: "BRANCH" as const,
    contactPerson: "Hoàng Văn Bình",
    phone: "0902 345 678",
    email: "langson@wms.vn",
    address: "Số 12 đường Trần Đăng Ninh, TP. Lạng Sơn",
    note: `Đang chỉnh sửa đơn vị nhận ${id}`,
    isActive: true,
  };

  return (
    <div className="p-6 w-full">
      <ReceiverForm initialData={mockData} isEdit />
    </div>
  );
}
