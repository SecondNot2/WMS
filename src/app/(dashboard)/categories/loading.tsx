import React from "react";

export default function CategoriesLoading() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-5 w-48 bg-border-ui rounded" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-card-white border border-border-ui rounded-xl" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-card-white rounded-xl border border-border-ui h-150 p-5 space-y-5">
        <div className="flex justify-between items-center pb-5 border-b border-border-ui">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-border-ui rounded" />
            <div className="h-3 w-64 bg-border-ui/50 rounded" />
          </div>
          <div className="h-9 w-32 bg-border-ui rounded-lg" />
        </div>
        
        <div className="flex gap-4">
          <div className="h-10 flex-1 bg-border-ui rounded-lg" />
          <div className="h-10 w-40 bg-border-ui rounded-lg" />
          <div className="h-10 w-32 bg-border-ui rounded-lg" />
        </div>

        <div className="space-y-4 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-border-ui/30 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
