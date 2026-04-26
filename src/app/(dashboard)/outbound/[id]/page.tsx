"use client";

import React from "react";
import { useParams } from "next/navigation";
import { OutboundDetailView } from "../_components/OutboundDetailView";

export default function OutboundDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 w-full">
      <OutboundDetailView id={id} />
    </div>
  );
}
