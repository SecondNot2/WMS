import React from "react";

export default function ReportsLoading() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 bg-border-ui rounded-lg" />
        <div className="h-4 w-72 bg-border-ui/50 rounded-md" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 bg-card-white border border-border-ui rounded-2xl"
          />
        ))}
      </div>

      {/* Tip card */}
      <div className="h-24 bg-accent/5 border border-accent/20 rounded-2xl" />
    </div>
  );
}
