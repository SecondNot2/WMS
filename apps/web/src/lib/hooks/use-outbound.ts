"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { outboundApi } from "@/lib/api/outbound";
import { PRODUCT_KEYS } from "@/lib/hooks/use-products";
import type {
  CreateOutboundInput,
  GetOutboundsQuery,
  RejectOutboundInput,
  UpdateOutboundInput,
} from "@wms/types";

export const OUTBOUND_KEYS = {
  all: ["outbound"] as const,
  lists: () => [...OUTBOUND_KEYS.all, "list"] as const,
  list: (params: GetOutboundsQuery) =>
    [...OUTBOUND_KEYS.lists(), params] as const,
  details: () => [...OUTBOUND_KEYS.all, "detail"] as const,
  detail: (id: string) => [...OUTBOUND_KEYS.details(), id] as const,
  stats: () => [...OUTBOUND_KEYS.all, "stats"] as const,
};

export function useOutbounds(params: GetOutboundsQuery = {}) {
  return useQuery({
    queryKey: OUTBOUND_KEYS.list(params),
    queryFn: () => outboundApi.getAll(params),
  });
}

export function useOutboundStats() {
  return useQuery({
    queryKey: OUTBOUND_KEYS.stats(),
    queryFn: () => outboundApi.getStats(),
  });
}

export function useOutbound(id: string) {
  return useQuery({
    queryKey: OUTBOUND_KEYS.detail(id),
    queryFn: () => outboundApi.getById(id),
    enabled: !!id,
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: OUTBOUND_KEYS.lists() });
  qc.invalidateQueries({ queryKey: OUTBOUND_KEYS.stats() });
}

export function useCreateOutbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOutboundInput) => outboundApi.create(data),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdateOutbound(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOutboundInput) => outboundApi.update(id, data),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: OUTBOUND_KEYS.detail(id) });
    },
  });
}

export function useDeleteOutbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => outboundApi.remove(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useApproveOutbound(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => outboundApi.approve(id),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: OUTBOUND_KEYS.detail(id) });
      // Approve thay đổi tồn kho → invalidate products
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useRejectOutbound(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RejectOutboundInput) => outboundApi.reject(id, data),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: OUTBOUND_KEYS.detail(id) });
    },
  });
}
