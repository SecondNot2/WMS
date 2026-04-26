import React from "react";

export default function RolesLoading() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-border-ui rounded-lg" />
          <div className="h-4 w-80 bg-border-ui/50 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-border-ui rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => <div key={item} className="h-24 bg-card-white border border-border-ui rounded-xl" />)}
      </div>
      <div className="bg-card-white border border-border-ui rounded-xl overflow-hidden">
        <div className="h-12 bg-background-app border-b border-border-ui" />
        {[1, 2, 3].map((item) => <div key={item} className="h-16 border-b border-border-ui last:border-0" />)}
      </div>
      <div className="h-100 bg-card-white border border-border-ui rounded-xl" />
    </div>
  );
}
