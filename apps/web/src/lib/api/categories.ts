import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  Category,
  CategoryDetail,
  CreateCategoryInput,
  GetCategoriesQuery,
  ImportCategoriesResult,
  PaginationMeta,
  UpdateCategoryInput,
} from "@wms/types";

export const categoriesApi = {
  getAll: (params?: GetCategoriesQuery) =>
    apiClient
      .get<ApiSuccessResponse<Category[]> & { meta: PaginationMeta }>(
        "/categories",
        { params },
      )
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccessResponse<CategoryDetail>>(`/categories/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateCategoryInput) =>
    apiClient
      .post<ApiSuccessResponse<Category>>("/categories", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateCategoryInput) =>
    apiClient
      .patch<ApiSuccessResponse<Category>>(`/categories/${id}`, data)
      .then((r) => r.data.data),

  remove: (id: string) =>
    apiClient
      .delete<ApiSuccessResponse<{ message: string }>>(`/categories/${id}`)
      .then((r) => r.data.data),

  import: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<ApiSuccessResponse<ImportCategoriesResult>>(
        "/categories/import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      .then((r) => r.data.data);
  },
};
