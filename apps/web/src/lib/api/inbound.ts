import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  CreateInboundInput,
  GetInboundsQuery,
  InboundDetail,
  InboundListItem,
  InboundStatsData,
  PaginationMeta,
  RejectInboundInput,
  UpdateInboundInput,
} from "@wms/types";

export const inboundApi = {
  getAll: (params?: GetInboundsQuery) =>
    apiClient
      .get<
        ApiSuccessResponse<InboundListItem[]> & { meta: PaginationMeta }
      >("/inbound", { params })
      .then((r) => r.data),

  getStats: () =>
    apiClient
      .get<ApiSuccessResponse<InboundStatsData>>("/inbound/stats")
      .then((r) => r.data.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<InboundDetail>>(`/inbound/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateInboundInput) =>
    apiClient
      .post<ApiSuccessResponse<InboundListItem>>("/inbound", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateInboundInput) =>
    apiClient
      .patch<ApiSuccessResponse<InboundListItem>>(`/inbound/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/inbound/${id}`)
      .then((r) => r.data.data),

  approve: (id: string) =>
    apiClient
      .post<ApiSuccessResponse<InboundDetail>>(`/inbound/${id}/approve`)
      .then((r) => r.data.data),

  reject: (id: string, data: RejectInboundInput) =>
    apiClient
      .post<ApiSuccessResponse<InboundDetail>>(`/inbound/${id}/reject`, data)
      .then((r) => r.data.data),

  exportExcel: (params?: GetInboundsQuery) =>
    apiClient
      .get<Blob>("/inbound/export", { params, responseType: "blob" })
      .then((r) => r.data),
};
