// Shared TypeScript types for WMS (frontend + backend).
// TODO: Bổ sung interfaces khi build từng module (User, Product, GoodsReceipt...).

export type Role = "ADMIN" | "WAREHOUSE_STAFF" | "ACCOUNTANT";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: Role;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isActive: boolean;
  roleId: string;
  role: { id: string; name: Role };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
}

// ─────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────

export type RolePermissions = Record<string, string[]>;

export interface RoleEntity {
  id: string;
  name: string;
  permissions: RolePermissions;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleDetail extends RoleEntity {
  users: { id: string; name: string; email: string; avatar: string | null }[];
}

export interface CreateRoleInput {
  name: string;
  permissions: RolePermissions;
}

export interface UpdateRoleInput {
  name?: string;
  permissions?: RolePermissions;
}

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryProductSummary {
  id: string;
  sku: string;
  name: string;
  unit: string;
  currentStock: number;
}

export interface CategoryDetail extends Category {
  products: CategoryProductSummary[];
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  isActive?: boolean;
}

export interface GetCategoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ImportCategoriesResult {
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

// ─────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  image: string | null;
  unit: string;
  categoryId: string;
  category: ProductCategory;
  minStock: number;
  currentStock: number;
  costPrice: number | null;
  salePrice: number | null;
  taxRate: number | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Product {
  recentStockHistory: StockHistory[];
}

export type StockHistoryType = "IN" | "OUT" | "ADJUST";

export interface StockHistory {
  id: string;
  productId: string;
  type: StockHistoryType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  refId: string | null;
  refCode: string | null;
  note: string | null;
  createdById: string | null;
  createdAt: string;
}

export interface CreateProductInput {
  sku: string;
  barcode?: string | null;
  name: string;
  brand?: string | null;
  model?: string | null;
  description?: string | null;
  image?: string | null;
  unit: string;
  categoryId: string;
  minStock?: number;
  costPrice?: number | null;
  salePrice?: number | null;
  taxRate?: number | null;
  location?: string | null;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  isActive?: boolean;
}

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  lowStock?: boolean;
}

export interface AdjustStockInput {
  quantity: number;
  note?: string;
}

export interface ImportProductsResult {
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}
