"use client";

import React from "react";

export default function ReportsLoading() {
  return (
    <div className="p-6 w-full space-y-6 animate-pulse">
      <div className="space-y-3 mb-10">
        <div className="h-8 w-64 bg-border-ui rounded-lg" />
        <div className="h-4 w-48 bg-border-ui/50 rounded-lg" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white border border-border-ui rounded-xl shadow-sm" />
        ))}
      </div>

      <div className="h-14 w-full bg-background-app border border-border-ui rounded-lg" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white border border-border-ui rounded-xl h-100" />
        <div className="col-span-2 bg-white border border-border-ui rounded-xl h-100" />
      </div>
    </div>
  );
}
