"use client";

import type { RecipientSummary } from "@wms/types";

/**
 * Placeholder hook — module `/receivers` (Recipient) chưa được build.
 *
 * Khi build module receivers:
 *   1. Tạo `apps/web/src/lib/api/recipients.ts` (axios wrapper).
 *   2. Thay implementation bên dưới bằng `useQuery` gọi `recipientsApi.getAll()`.
 *   3. Export thêm `useCreateRecipient`, `useUpdateRecipient`, `useDeleteRecipient` tương tự `use-suppliers.ts`.
 *
 * Hiện tại trả về list rỗng để OutboundForm/Filters compile được.
 */
export function useRecipients() {
  return {
    data: [] as RecipientSummary[],
    isLoading: false,
    isError: false as boolean,
  };
}
