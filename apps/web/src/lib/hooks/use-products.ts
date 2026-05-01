"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type {
  AdjustStockInput,
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
} from "@wms/types";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params: GetProductsQuery) =>
    [...PRODUCT_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
  stockHistory: (id: string) =>
    [...PRODUCT_KEYS.detail(id), "stock-history"] as const,
};

export function useProducts(
  params: GetProductsQuery = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productsApi.getAll(params),
    enabled: options?.enabled ?? true,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useProductStockHistory(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.stockHistory(id),
    queryFn: () => productsApi.getStockHistory(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductInput) => productsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}

export function useAdjustProductStock(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdjustStockInput) => productsApi.adjustStock(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.stockHistory(id) });
    },
  });
}

export function useImportProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => productsApi.import(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}
