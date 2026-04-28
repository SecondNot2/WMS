import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  ExportReportQuery,
  GetReportsStatsQuery,
  InventoryReportData,
  InventoryReportQuery,
  ReceiptIssueReportData,
  ReceiptIssueReportQuery,
  ReportStatCard,
  TopProductsReportData,
  TopProductsReportQuery,
} from "@wms/types";

export const reportsApi = {
  getStats: (params?: GetReportsStatsQuery) =>
    apiClient
      .get<ApiSuccessResponse<ReportStatCard[]>>("/reports/stats", { params })
      .then((r) => r.data.data),

  getReceiptIssue: (params?: ReceiptIssueReportQuery) =>
    apiClient
      .get<
        ApiSuccessResponse<ReceiptIssueReportData>
      >("/reports/receipt-issue", { params })
      .then((r) => r.data.data),

  getInventory: (params?: InventoryReportQuery) =>
    apiClient
      .get<ApiSuccessResponse<InventoryReportData>>("/reports/inventory", {
        params,
      })
      .then((r) => r.data.data),

  getTopProducts: (params?: TopProductsReportQuery) =>
    apiClient
      .get<
        ApiSuccessResponse<TopProductsReportData>
      >("/reports/top-products", { params })
      .then((r) => r.data.data),

  exportExcel: (params: ExportReportQuery) =>
    apiClient
      .get<Blob>("/reports/export", { params, responseType: "blob" })
      .then((r) => r.data),
};
