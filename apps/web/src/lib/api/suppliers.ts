import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  CreateSupplierInput,
  GetSuppliersQuery,
  PaginationMeta,
  Supplier,
  SupplierDetail,
  UpdateSupplierInput,
} from "@wms/types";

export const suppliersApi = {
  getAll: (params?: GetSuppliersQuery) =>
    apiClient
      .get<ApiSuccessResponse<Supplier[]> & { meta: PaginationMeta }>(
        "/suppliers",
        { params },
      )
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<SupplierDetail>>(`/suppliers/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateSupplierInput) =>
    apiClient
      .post<ApiSuccessResponse<Supplier>>("/suppliers", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateSupplierInput) =>
    apiClient
      .patch<ApiSuccessResponse<Supplier>>(`/suppliers/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/suppliers/${id}`)
      .then((r) => r.data.data),
};
