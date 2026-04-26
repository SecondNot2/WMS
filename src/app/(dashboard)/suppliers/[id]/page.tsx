"use client";

import { useParams } from "next/navigation";
import { SupplierDetailView } from "../_components/SupplierDetailView";

export default function SupplierIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <SupplierDetailView id={id} />
    </div>
  );
}
