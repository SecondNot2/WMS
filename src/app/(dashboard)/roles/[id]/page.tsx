"use client";

import { useParams } from "next/navigation";
import { RoleDetailView } from "../_components/RoleDetailView";

export default function RoleIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <RoleDetailView id={id} />
    </div>
  );
}
