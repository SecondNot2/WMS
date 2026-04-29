"use client";

import { PageGuard } from "@/components/PermissionDenied";

export default function UsersSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageGuard action="user.view">{children}</PageGuard>;
}
