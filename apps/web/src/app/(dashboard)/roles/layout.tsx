"use client";

import { PageGuard } from "@/components/PermissionDenied";

export default function RolesSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageGuard action="role.view">{children}</PageGuard>;
}
