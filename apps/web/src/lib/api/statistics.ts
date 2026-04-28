import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  EfficiencyData,
  GetStatisticsQuery,
  PerformanceData,
} from "@wms/types";

export const statisticsApi = {
  getEfficiency: (params?: GetStatisticsQuery) =>
    apiClient
      .get<ApiSuccessResponse<EfficiencyData>>("/statistics/efficiency", {
        params,
      })
      .then((r) => r.data.data),

  getPerformance: (params?: GetStatisticsQuery) =>
    apiClient
      .get<ApiSuccessResponse<PerformanceData>>("/statistics/performance", {
        params,
      })
      .then((r) => r.data.data),

  exportExcel: (params?: GetStatisticsQuery) =>
    apiClient
      .get<Blob>("/statistics/export", { params, responseType: "blob" })
      .then((r) => r.data),
};
