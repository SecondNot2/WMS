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
