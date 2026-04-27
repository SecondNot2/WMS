import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  AuthUser,
  LoginResponse,
  RefreshResponse,
} from "@wms/types";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient
      .post<ApiSuccessResponse<LoginResponse>>("/auth/login", { email, password })
      .then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<ApiSuccessResponse<RefreshResponse>>("/auth/refresh", { refreshToken })
      .then((r) => r.data.data),

  logout: () =>
    apiClient
      .post<ApiSuccessResponse<{ message: string }>>("/auth/logout")
      .then((r) => r.data.data),

  me: () =>
    apiClient
      .get<ApiSuccessResponse<AuthUser>>("/auth/me")
      .then((r) => r.data.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient
      .patch<ApiSuccessResponse<{ message: string }>>(
        "/auth/change-password",
        data
      )
      .then((r) => r.data.data),
};
