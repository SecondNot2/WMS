import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  actionsClassName?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  contentClassName,
  actionsClassName,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className={cn("min-w-0", contentClassName)}>
        <h1 className="text-xl font-bold text-text-primary leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto",
            actionsClassName,
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
