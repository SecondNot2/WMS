import { apiClient } from "./client";
import type {
  ActivityLog,
  ApiSuccessResponse,
  GetActivityLogsQuery,
  PaginationMeta,
} from "@wms/types";

export const activityLogApi = {
  getAll: (params?: GetActivityLogsQuery) =>
    apiClient
      .get<ApiSuccessResponse<ActivityLog[]> & { meta: PaginationMeta }>(
        "/activity-log",
        { params },
      )
      .then((r) => r.data),
};
