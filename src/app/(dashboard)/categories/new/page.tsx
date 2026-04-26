"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "@/app/(dashboard)/categories/_components/CategoryForm";


export default function NewCategoryPage() {
  return (
    <div className="p-6 w-full">
      <CategoryForm />
    </div>
  );
}
