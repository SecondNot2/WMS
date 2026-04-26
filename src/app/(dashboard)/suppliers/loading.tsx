import React from "react";

export default function SuppliersLoading() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-border-ui rounded-lg" />
          <div className="h-4 w-72 bg-border-ui/50 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-border-ui rounded-lg" />
          <div className="h-10 w-44 bg-border-ui rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-10 space-y-5">
          <div className="h-20 bg-card-white border border-border-ui rounded-xl" />
          <div className="bg-card-white border border-border-ui rounded-xl overflow-hidden">
            <div className="h-12 bg-background-app border-b border-border-ui" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 border-b border-border-ui last:border-0"
              />
            ))}
          </div>
        </div>
        <div className="xl:col-span-2 space-y-5">
          <div className="h-64 bg-card-white border border-border-ui rounded-xl" />
        </div>
      </div>
    </div>
  );
}
