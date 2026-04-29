"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/store";

// Sau migration: API là Next.js Route Handlers tại /api (cùng domain)
// Giữ NEXT_PUBLIC_API_URL nếu muốn override (vd: gọi backend riêng), mặc định trỏ /api
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: gắn access token ──
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: auto refresh khi 401 ──
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post<{
    success: true;
    data: { accessToken: string };
  }>(`${API_URL}/auth/refresh`, { refreshToken });
  // ↑ Lưu ý: nếu API_URL là path tương đối ('/api'), axios sẽ resolve theo origin hiện tại

  const newToken = res.data.data.accessToken;
  useAuthStore.getState().setAccessToken(newToken);
  return newToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        refreshPromise = null;
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

const ROLE_LABELS_VI: Record<string, string> = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
};

// Helper extract error message from API
export function getApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi",
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { error?: { message?: string; code?: string } }
      | undefined;

    // 403 — làm giàu message với role hiện tại + gợi ý liên hệ Admin
    if (status === 403 || data?.error?.code === "FORBIDDEN") {
      const role = useAuthStore.getState().user?.role;
      const roleLabel = role ? (ROLE_LABELS_VI[role] ?? role) : null;
      const base =
        data?.error?.message ?? "Bạn không có quyền thực hiện thao tác này";
      const suffix = roleLabel
        ? ` (vai trò ${roleLabel}). Vui lòng liên hệ Quản trị viên nếu bạn cần quyền này.`
        : ". Vui lòng liên hệ Quản trị viên nếu bạn cần quyền này.";
      // Tránh double-suffix nếu backend đã trả message dài
      return base.endsWith(".") || base.length > 60 ? base : base + suffix;
    }

    return data?.error?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
