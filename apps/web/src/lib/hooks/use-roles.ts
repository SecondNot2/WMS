"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/lib/api/roles";
import type { CreateRoleInput, UpdateRoleInput } from "@wms/types";

export const ROLE_KEYS = {
  all: ["roles"] as const,
  lists: () => [...ROLE_KEYS.all, "list"] as const,
  details: () => [...ROLE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ROLE_KEYS.details(), id] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: ROLE_KEYS.lists(),
    queryFn: () => rolesApi.getAll(),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn: () => rolesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleInput) => rolesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
}

export function useUpdateRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoleInput) => rolesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
      qc.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rolesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
}
