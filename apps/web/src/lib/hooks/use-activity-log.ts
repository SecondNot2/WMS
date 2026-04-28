"use client";

import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log";
import type { GetActivityLogsQuery } from "@wms/types";

export const ACTIVITY_LOG_KEYS = {
  all: ["activity-log"] as const,
  lists: () => [...ACTIVITY_LOG_KEYS.all, "list"] as const,
  list: (params: GetActivityLogsQuery) =>
    [...ACTIVITY_LOG_KEYS.lists(), params] as const,
};

export function useActivityLogs(params: GetActivityLogsQuery = {}) {
  return useQuery({
    queryKey: ACTIVITY_LOG_KEYS.list(params),
    queryFn: () => activityLogApi.getAll(params),
  });
}
