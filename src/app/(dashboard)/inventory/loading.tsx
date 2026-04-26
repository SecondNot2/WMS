"use client";

import React from "react";

export default function InventoryLoading() {
  return (
    <div className="p-6 w-full space-y-6 animate-pulse">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-border-ui rounded-lg" />
          <div className="h-4 w-48 bg-border-ui/50 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-border-ui rounded-lg" />
          <div className="h-10 w-40 bg-border-ui rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white border border-border-ui rounded-xl shadow-sm" />
        ))}
      </div>

      <div className="h-20 bg-warning/5 border border-warning/10 rounded-xl" />

      <div className="bg-white border border-border-ui rounded-xl shadow-sm h-96" />
    </div>
  );
}
