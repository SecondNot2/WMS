"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { CategoryDetailView } from "@/app/(dashboard)/categories/_components/CategoryDetailView";

import { useParams } from "next/navigation";

export default function CategoryIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <CategoryDetailView id={id} />
    </div>
  );
}
