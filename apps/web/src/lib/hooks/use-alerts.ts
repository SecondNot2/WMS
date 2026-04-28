"use client";

import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "@/lib/api/alerts";
import type { GetAlertsQuery } from "@wms/types";

export const ALERT_KEYS = {
  all: ["alerts"] as const,
  lists: () => [...ALERT_KEYS.all, "list"] as const,
  list: (params: GetAlertsQuery) => [...ALERT_KEYS.lists(), params] as const,
  stats: () => [...ALERT_KEYS.all, "stats"] as const,
};

export function useAlerts(params: GetAlertsQuery = {}) {
  return useQuery({
    queryKey: ALERT_KEYS.list(params),
    queryFn: () => alertsApi.getAll(params),
  });
}

export function useAlertStats() {
  return useQuery({
    queryKey: ALERT_KEYS.stats(),
    queryFn: () => alertsApi.getStats(),
  });
}
