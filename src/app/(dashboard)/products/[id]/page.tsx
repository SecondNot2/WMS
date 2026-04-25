"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductDetailView } from "../_components/ProductDetailView";
import { useParams } from "next/navigation";

export default function ProductIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-5 w-full space-y-6">

      <ProductDetailView id={id} />
    </div>
  );
}
