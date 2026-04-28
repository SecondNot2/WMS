"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { suppliersApi } from "@/lib/api/suppliers";
import type {
  CreateSupplierInput,
  GetSuppliersQuery,
  UpdateSupplierInput,
} from "@wms/types";

export const SUPPLIER_KEYS = {
  all: ["suppliers"] as const,
  lists: () => [...SUPPLIER_KEYS.all, "list"] as const,
  list: (params: GetSuppliersQuery) =>
    [...SUPPLIER_KEYS.lists(), params] as const,
  details: () => [...SUPPLIER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SUPPLIER_KEYS.details(), id] as const,
};

export function useSuppliers(params: GetSuppliersQuery = {}) {
  return useQuery({
    queryKey: SUPPLIER_KEYS.list(params),
    queryFn: () => suppliersApi.getAll(params),
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: SUPPLIER_KEYS.detail(id),
    queryFn: () => suppliersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierInput) => suppliersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.lists() });
    },
  });
}

export function useUpdateSupplier(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSupplierInput) => suppliersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.lists() });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.detail(id) });
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suppliersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.lists() });
    },
  });
}
