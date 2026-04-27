"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (data: UpdateProfileInput) => authApi.updateProfile(data),
    onSuccess: (user) => {
      setUser(user);
      qc.setQueryData(AUTH_KEYS.me, user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Server hết phiên — vẫn clear local
      }
    },
    onSettled: () => {
      logout();
      qc.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
}
