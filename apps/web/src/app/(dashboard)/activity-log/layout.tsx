"use client";

import { PageGuard } from "@/components/PermissionDenied";

export default function ActivityLogSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageGuard action="activityLog.view">{children}</PageGuard>;
}
