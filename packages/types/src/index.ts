// Shared TypeScript types for WMS (frontend + backend).
// TODO: Bổ sung interfaces khi build từng module (User, Product, GoodsReceipt...).

export type Role = 'ADMIN' | 'WAREHOUSE_STAFF' | 'ACCOUNTANT'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  error: { code: string; message: string; details?: unknown }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
