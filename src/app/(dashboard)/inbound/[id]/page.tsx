"use client";

import React from "react";
import { useParams } from "next/navigation";
import { InboundDetailView } from "../_components/InboundDetailView";

export default function InboundDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <InboundDetailView id={id} />
    </div>
  );
}
