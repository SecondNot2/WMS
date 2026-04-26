"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "@/app/(dashboard)/categories/_components/CategoryForm";

import { useParams } from "next/navigation";

export default function EditCategoryPage() {
  const params = useParams();
  const id = params.id as string;

  // TODO: Replace with useQuery
  const mockData = {
    name: "Thiết bị ngoại vi",
    code: "CAT001",
    description: "Chuột, bàn phím, tai nghe, webcam...",
    status: "ACTIVE" as const,
  };

  return (
    <div className="p-6 w-full">
      <CategoryForm initialData={mockData} isEdit={true} />
    </div>
  );
}
