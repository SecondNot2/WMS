"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api/inventory";
import { ALERT_KEYS } from "@/lib/hooks/use-alerts";
import { PRODUCT_KEYS } from "@/lib/hooks/use-products";
import type { AdjustStockInput, GetInventoryQuery } from "@wms/types";

export const INVENTORY_KEYS = {
  all: ["inventory"] as const,
  lists: () => [...INVENTORY_KEYS.all, "list"] as const,
  list: (params: GetInventoryQuery) =>
    [...INVENTORY_KEYS.lists(), params] as const,
  summary: () => [...INVENTORY_KEYS.all, "summary"] as const,
};

export function useInventory(params: GetInventoryQuery = {}) {
  return useQuery({
    queryKey: INVENTORY_KEYS.list(params),
    queryFn: () => inventoryApi.getAll(params),
  });
}

export function useInventorySummary() {
  return useQuery({
    queryKey: INVENTORY_KEYS.summary(),
    queryFn: () => inventoryApi.getSummary(),
  });
}

export function useAdjustInventoryStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: AdjustStockInput;
    }) => inventoryApi.adjustStock(productId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
      qc.invalidateQueries({ queryKey: ALERT_KEYS.all });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      qc.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(variables.productId),
      });
      qc.invalidateQueries({
        queryKey: PRODUCT_KEYS.stockHistory(variables.productId),
      });
    },
  });
}
