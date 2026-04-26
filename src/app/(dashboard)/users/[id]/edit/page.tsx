"use client";

import { useParams } from "next/navigation";
import { UserForm } from "../../_components/UserForm";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;

  const mockData = {
    name: "Nguyễn Văn A",
    email: "admin@wms.com",
    role: "ADMIN" as const,
    password: "",
    isActive: true,
  };

  return (
    <div className="p-6 w-full">
      <UserForm initialData={{ ...mockData, name: `${mockData.name} #${id}` }} isEdit />
    </div>
  );
}
