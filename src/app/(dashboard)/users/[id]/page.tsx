"use client";

import { useParams } from "next/navigation";
import { UserDetailView } from "../_components/UserDetailView";

export default function UserIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <UserDetailView id={id} />
    </div>
  );
}
