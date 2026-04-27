import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  CreateUserInput,
  GetUsersQuery,
  PaginationMeta,
  UpdateUserInput,
  User,
} from "@wms/types";

export const usersApi = {
  getAll: (params?: GetUsersQuery) =>
    apiClient
      .get<ApiSuccessResponse<User[]> & { meta: PaginationMeta }>("/users", {
        params,
      })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<User>>(`/users/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateUserInput) =>
    apiClient
      .post<ApiSuccessResponse<User>>("/users", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateUserInput) =>
    apiClient
      .patch<ApiSuccessResponse<User>>(`/users/${id}`, data)
      .then((r) => r.data.data),

  toggleActive: (id: string, isActive: boolean) =>
    apiClient
      .patch<ApiSuccessResponse<User>>(`/users/${id}/toggle-active`, {
        isActive,
      })
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/users/${id}`)
      .then((r) => r.data.data),
};
