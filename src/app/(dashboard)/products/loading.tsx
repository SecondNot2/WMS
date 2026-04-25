import React from "react";

export default function ProductsLoading() {
  return (
    <div className="p-5 w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-border-ui rounded-lg" />
          <div className="h-4 w-64 bg-border-ui/50 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-border-ui rounded-lg" />
          <div className="h-10 w-32 bg-border-ui rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 space-y-6">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-card-white border border-border-ui rounded-xl" />
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-card-white border border-border-ui rounded-xl overflow-hidden">
            <div className="h-12 bg-background-app border-b border-border-ui" />
            <div className="p-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 border-b border-border-ui last:border-0" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="h-64 bg-card-white border border-border-ui rounded-xl" />
          <div className="h-48 bg-card-white border border-border-ui rounded-xl" />
        </div>
      </div>
    </div>
  );
}
