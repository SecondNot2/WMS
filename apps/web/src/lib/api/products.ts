import { apiClient } from "./client";
import type {
  AdjustStockInput,
  ApiSuccessResponse,
  CreateProductInput,
  GetProductsQuery,
  ImportProductsResult,
  PaginationMeta,
  Product,
  ProductDetail,
  StockHistory,
  UpdateProductInput,
} from "@wms/types";

export const productsApi = {
  getAll: (params?: GetProductsQuery) =>
    apiClient
      .get<ApiSuccessResponse<Product[]> & { meta: PaginationMeta }>(
        "/products",
        { params },
      )
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<ProductDetail>>(`/products/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateProductInput) =>
    apiClient
      .post<ApiSuccessResponse<Product>>("/products", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateProductInput) =>
    apiClient
      .patch<ApiSuccessResponse<Product>>(`/products/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/products/${id}`)
      .then((r) => r.data.data),

  getStockHistory: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<StockHistory[]>>(`/products/${id}/stock-history`)
      .then((r) => r.data.data),

  adjustStock: (id: string, data: AdjustStockInput) =>
    apiClient
      .post<ApiSuccessResponse<Product>>(`/products/${id}/adjust-stock`, data)
      .then((r) => r.data.data),

  import: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<ApiSuccessResponse<ImportProductsResult>>("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },
};
