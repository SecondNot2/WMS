import { apiClient } from "./client";
import type {
  AdjustStockInput,
  ApiSuccessResponse,
  GetInventoryQuery,
  InventoryItem,
  InventorySummaryData,
  PaginationMeta,
} from "@wms/types";

export const inventoryApi = {
  getAll: (params?: GetInventoryQuery) =>
    apiClient
      .get<ApiSuccessResponse<InventoryItem[]> & { meta: PaginationMeta }>(
        "/inventory",
        { params },
      )
      .then((r) => r.data),

  getSummary: () =>
    apiClient
      .get<ApiSuccessResponse<InventorySummaryData>>("/inventory/summary")
      .then((r) => r.data.data),

  adjustStock: (productId: string, data: AdjustStockInput) =>
    apiClient
      .post<ApiSuccessResponse<InventoryItem>>(
        `/inventory/${productId}/adjust`,
        data,
      )
      .then((r) => r.data.data),
};
