"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import type {
  GetReportsStatsQuery,
  InventoryReportQuery,
  ReceiptIssueReportQuery,
  TopProductsReportQuery,
} from "@wms/types";

export const REPORT_KEYS = {
  all: ["reports"] as const,
  stats: (params: GetReportsStatsQuery) =>
    [...REPORT_KEYS.all, "stats", params] as const,
  receiptIssue: (params: ReceiptIssueReportQuery) =>
    [...REPORT_KEYS.all, "receipt-issue", params] as const,
  inventory: (params: InventoryReportQuery) =>
    [...REPORT_KEYS.all, "inventory", params] as const,
  topProducts: (params: TopProductsReportQuery) =>
    [...REPORT_KEYS.all, "top-products", params] as const,
};

export function useReportStats(params: GetReportsStatsQuery = {}) {
  return useQuery({
    queryKey: REPORT_KEYS.stats(params),
    queryFn: () => reportsApi.getStats(params),
  });
}

export function useReceiptIssueReport(params: ReceiptIssueReportQuery = {}) {
  return useQuery({
    queryKey: REPORT_KEYS.receiptIssue(params),
    queryFn: () => reportsApi.getReceiptIssue(params),
  });
}

export function useInventoryReport(params: InventoryReportQuery = {}) {
  return useQuery({
    queryKey: REPORT_KEYS.inventory(params),
    queryFn: () => reportsApi.getInventory(params),
  });
}

export function useTopProductsReport(params: TopProductsReportQuery = {}) {
  return useQuery({
    queryKey: REPORT_KEYS.topProducts(params),
    queryFn: () => reportsApi.getTopProducts(params),
  });
}
