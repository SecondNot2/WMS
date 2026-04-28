"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipientsApi } from "@/lib/api/recipients";
import type {
  CreateRecipientInput,
  GetRecipientsQuery,
  RecipientSummary,
  UpdateRecipientInput,
} from "@wms/types";

export const RECIPIENT_KEYS = {
  all: ["recipients"] as const,
  lists: () => [...RECIPIENT_KEYS.all, "list"] as const,
  list: (params: GetRecipientsQuery) =>
    [...RECIPIENT_KEYS.lists(), params] as const,
  details: () => [...RECIPIENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...RECIPIENT_KEYS.details(), id] as const,
};

const DEFAULT_LIST_PARAMS: GetRecipientsQuery = { limit: 100 };

/**
 * Backwards-compatible hook trả về danh sách rút gọn (id+name) — dùng cho
 * dropdown trong `OutboundForm`/`OutboundFilters`. Luôn trả về mảng (kể cả
 * khi đang loading) để consumer có thể `.length` an toàn.
 */
export function useRecipients(params: GetRecipientsQuery = DEFAULT_LIST_PARAMS) {
  const query = useQuery({
    queryKey: RECIPIENT_KEYS.list(params),
    queryFn: () => recipientsApi.getAll(params),
    select: (response) =>
      response.data.map<RecipientSummary>((r) => ({
        id: r.id,
        name: r.name,
      })),
  });

  return {
    data: (query.data ?? []) as RecipientSummary[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as unknown,
  };
}

/** Hook đầy đủ (kèm meta) — dùng cho ReceiverTable khi connect sau này. */
export function useRecipientsList(params: GetRecipientsQuery = {}) {
  return useQuery({
    queryKey: RECIPIENT_KEYS.list(params),
    queryFn: () => recipientsApi.getAll(params),
  });
}

export function useRecipient(id: string) {
  return useQuery({
    queryKey: RECIPIENT_KEYS.detail(id),
    queryFn: () => recipientsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRecipient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecipientInput) => recipientsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RECIPIENT_KEYS.lists() });
    },
  });
}

export function useUpdateRecipient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRecipientInput) => recipientsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RECIPIENT_KEYS.lists() });
      qc.invalidateQueries({ queryKey: RECIPIENT_KEYS.detail(id) });
    },
  });
}

export function useDeleteRecipient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipientsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RECIPIENT_KEYS.lists() });
    },
  });
}
