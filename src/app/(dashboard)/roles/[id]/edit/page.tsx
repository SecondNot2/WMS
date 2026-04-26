"use client";

import { useParams } from "next/navigation";
import { RoleForm } from "../../_components/RoleForm";

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "ADMIN",
    label: "Quản trị viên",
    description: `Toàn quyền hệ thống, duyệt phiếu và quản lý người dùng. Role ID: ${id}`,
  };

  return (
    <div className="p-6 w-full">
      <RoleForm initialData={mockData} isEdit />
    </div>
  );
}
