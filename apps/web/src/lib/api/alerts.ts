import { apiClient } from "./client";
import type {
  Alert,
  AlertStatsData,
  ApiSuccessResponse,
  GetAlertsQuery,
  PaginationMeta,
} from "@wms/types";

export const alertsApi = {
  getAll: (params?: GetAlertsQuery) =>
    apiClient
      .get<ApiSuccessResponse<Alert[]> & { meta: PaginationMeta }>("/alerts", {
        params,
      })
      .then((r) => r.data),

  getStats: () =>
    apiClient
      .get<ApiSuccessResponse<AlertStatsData>>("/alerts/stats")
      .then((r) => r.data.data),
};
