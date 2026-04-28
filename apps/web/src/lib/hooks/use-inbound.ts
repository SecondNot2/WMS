"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inboundApi } from "@/lib/api/inbound";
import { PRODUCT_KEYS } from "@/lib/hooks/use-products";
import type {
  CreateInboundInput,
  GetInboundsQuery,
  RejectInboundInput,
  UpdateInboundInput,
} from "@wms/types";

export const INBOUND_KEYS = {
  all: ["inbound"] as const,
  lists: () => [...INBOUND_KEYS.all, "list"] as const,
  list: (params: GetInboundsQuery) =>
    [...INBOUND_KEYS.lists(), params] as const,
  details: () => [...INBOUND_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INBOUND_KEYS.details(), id] as const,
  stats: () => [...INBOUND_KEYS.all, "stats"] as const,
};

export function useInbounds(params: GetInboundsQuery = {}) {
  return useQuery({
    queryKey: INBOUND_KEYS.list(params),
    queryFn: () => inboundApi.getAll(params),
  });
}

export function useInboundStats() {
  return useQuery({
    queryKey: INBOUND_KEYS.stats(),
    queryFn: () => inboundApi.getStats(),
  });
}

export function useInbound(id: string) {
  return useQuery({
    queryKey: INBOUND_KEYS.detail(id),
    queryFn: () => inboundApi.getById(id),
    enabled: !!id,
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: INBOUND_KEYS.lists() });
  qc.invalidateQueries({ queryKey: INBOUND_KEYS.stats() });
}

export function useCreateInbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInboundInput) => inboundApi.create(data),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdateInbound(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInboundInput) => inboundApi.update(id, data),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: INBOUND_KEYS.detail(id) });
    },
  });
}

export function useDeleteInbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inboundApi.remove(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useApproveInbound(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => inboundApi.approve(id),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: INBOUND_KEYS.detail(id) });
      // Approve thay đổi tồn kho → invalidate products
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useRejectInbound(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RejectInboundInput) => inboundApi.reject(id, data),
    onSuccess: () => {
      invalidateAll(qc);
      qc.invalidateQueries({ queryKey: INBOUND_KEYS.detail(id) });
    },
  });
}
