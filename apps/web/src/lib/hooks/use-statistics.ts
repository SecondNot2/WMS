"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "@/lib/api/statistics";
import type { GetStatisticsQuery } from "@wms/types";

export const STATISTICS_KEYS = {
  all: ["statistics"] as const,
  efficiency: (params: GetStatisticsQuery) =>
    [...STATISTICS_KEYS.all, "efficiency", params] as const,
  performance: (params: GetStatisticsQuery) =>
    [...STATISTICS_KEYS.all, "performance", params] as const,
};

export function useEfficiency(params: GetStatisticsQuery = {}) {
  return useQuery({
    queryKey: STATISTICS_KEYS.efficiency(params),
    queryFn: () => statisticsApi.getEfficiency(params),
  });
}

export function usePerformance(params: GetStatisticsQuery = {}) {
  return useQuery({
    queryKey: STATISTICS_KEYS.performance(params),
    queryFn: () => statisticsApi.getPerformance(params),
  });
}
