"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import type {
  CreateCategoryInput,
  GetCategoriesQuery,
  UpdateCategoryInput,
} from "@wms/types";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (params: GetCategoriesQuery) =>
    [...CATEGORY_KEYS.lists(), params] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

export function useCategories(params: GetCategoriesQuery = {}) {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: () => categoriesApi.getAll(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoriesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryInput) => categoriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(id) });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });
}

export function useImportCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => categoriesApi.import(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });
}
