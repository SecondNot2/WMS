"use client";

import { useParams } from "next/navigation";
import { ReceiverDetailView } from "../_components/ReceiverDetailView";

export default function ReceiverIdPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <ReceiverDetailView id={id} />
    </div>
  );
}
