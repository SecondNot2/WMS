import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  CreateRecipientInput,
  GetRecipientsQuery,
  PaginationMeta,
  Recipient,
  RecipientDetail,
  UpdateRecipientInput,
} from "@wms/types";

export const recipientsApi = {
  getAll: (params?: GetRecipientsQuery) =>
    apiClient
      .get<
        ApiSuccessResponse<Recipient[]> & { meta: PaginationMeta }
      >("/recipients", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<RecipientDetail>>(`/recipients/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateRecipientInput) =>
    apiClient
      .post<ApiSuccessResponse<Recipient>>("/recipients", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateRecipientInput) =>
    apiClient
      .patch<ApiSuccessResponse<Recipient>>(`/recipients/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/recipients/${id}`)
      .then((r) => r.data.data),
};
