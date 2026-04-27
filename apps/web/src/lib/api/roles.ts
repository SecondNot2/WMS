import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  CreateRoleInput,
  RoleDetail,
  RoleEntity,
  UpdateRoleInput,
} from "@wms/types";

export const rolesApi = {
  getAll: () =>
    apiClient
      .get<ApiSuccessResponse<RoleEntity[]>>("/roles")
      .then((r) => r.data.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<RoleDetail>>(`/roles/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateRoleInput) =>
    apiClient
      .post<ApiSuccessResponse<RoleEntity>>("/roles", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateRoleInput) =>
    apiClient
      .patch<ApiSuccessResponse<RoleEntity>>(`/roles/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/roles/${id}`)
      .then((r) => r.data.data),
};
