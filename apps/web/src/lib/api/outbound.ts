import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  CreateOutboundInput,
  GetOutboundsQuery,
  OutboundDetail,
  OutboundListItem,
  OutboundStatsData,
  PaginationMeta,
  RejectOutboundInput,
  UpdateOutboundInput,
} from "@wms/types";

export const outboundApi = {
  getAll: (params?: GetOutboundsQuery) =>
    apiClient
      .get<
        ApiSuccessResponse<OutboundListItem[]> & { meta: PaginationMeta }
      >("/outbound", { params })
      .then((r) => r.data),

  getStats: () =>
    apiClient
      .get<ApiSuccessResponse<OutboundStatsData>>("/outbound/stats")
      .then((r) => r.data.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<OutboundDetail>>(`/outbound/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateOutboundInput) =>
    apiClient
      .post<ApiSuccessResponse<OutboundListItem>>("/outbound", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateOutboundInput) =>
    apiClient
      .patch<ApiSuccessResponse<OutboundListItem>>(`/outbound/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/outbound/${id}`)
      .then((r) => r.data.data),

  approve: (id: string) =>
    apiClient
      .post<ApiSuccessResponse<OutboundDetail>>(`/outbound/${id}/approve`)
      .then((r) => r.data.data),

  reject: (id: string, data: RejectOutboundInput) =>
    apiClient
      .post<ApiSuccessResponse<OutboundDetail>>(`/outbound/${id}/reject`, data)
      .then((r) => r.data.data),

  exportExcel: (params?: GetOutboundsQuery) =>
    apiClient
      .get<Blob>("/outbound/export", { params, responseType: "blob" })
      .then((r) => r.data),
};
