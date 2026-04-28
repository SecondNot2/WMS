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

// ─────────────────────────────────────────
// SUPPLIERS
// ─────────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  taxCode: string | null;
  isActive: boolean;
  inboundCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierRecentInbound {
  id: string;
  code: string;
  status: InboundStatus;
  totalAmount: number;
  createdAt: string;
}

export interface SupplierDetail extends Supplier {
  stats: { totalInbound: number; totalAmount: number };
  recentInbounds: SupplierRecentInbound[];
}

export interface CreateSupplierInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxCode?: string | null;
}

export interface UpdateSupplierInput extends Partial<CreateSupplierInput> {
  isActive?: boolean;
}

export interface GetSuppliersQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

// ─────────────────────────────────────────
// INBOUND (GoodsReceipt)
// ─────────────────────────────────────────

export type InboundStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface InboundUserSummary {
  id: string;
  name: string;
}

export interface InboundSupplierSummary {
  id: string;
  name: string;
}

export interface InboundListItem {
  id: string;
  code: string;
  supplier: InboundSupplierSummary;
  status: InboundStatus;
  totalAmount: number;
  itemCount: number;
  createdBy: InboundUserSummary;
  createdAt: string;
}

export interface InboundDetailItemProduct {
  id: string;
  sku: string;
  name: string;
  unit: string;
  currentStock: number;
}

export interface InboundDetailItem {
  id: string;
  product: InboundDetailItemProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InboundSupplierDetail extends InboundSupplierSummary {
  phone: string | null;
  email: string | null;
  address: string | null;
  taxCode: string | null;
}

export interface InboundDetail {
  id: string;
  code: string;
  supplier: InboundSupplierDetail;
  status: InboundStatus;
  note: string | null;
  totalAmount: number;
  createdBy: InboundUserSummary;
  approvedBy: InboundUserSummary | null;
  rejectedReason: string | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: InboundDetailItem[];
}

export interface InboundItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInboundInput {
  supplierId: string;
  note?: string | null;
  items: InboundItemInput[];
}

export interface UpdateInboundInput {
  supplierId?: string;
  note?: string | null;
  items?: InboundItemInput[];
}

export interface GetInboundsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: InboundStatus;
  supplierId?: string;
  from?: string;
  to?: string;
}

export interface RejectInboundInput {
  reason: string;
}

export interface InboundStatsData {
  thisMonth: number;
  pending: number;
  approvedToday: number;
  rejected: number;
}

// ─────────────────────────────────────────
// OUTBOUND (GoodsIssue)
// ─────────────────────────────────────────

export type OutboundStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OutboundUserSummary {
  id: string;
  name: string;
}

export interface OutboundRecipientSummary {
  id: string;
  name: string;
}

export interface OutboundListItem {
  id: string;
  code: string;
  recipient: OutboundRecipientSummary;
  status: OutboundStatus;
  purpose: string | null;
  totalAmount: number;
  itemCount: number;
  createdBy: OutboundUserSummary;
  createdAt: string;
}

export interface OutboundDetailItemProduct {
  id: string;
  sku: string;
  name: string;
  unit: string;
  currentStock: number;
}

export interface OutboundDetailItem {
  id: string;
  product: OutboundDetailItemProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OutboundRecipientDetail extends OutboundRecipientSummary {
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface OutboundDetail {
  id: string;
  code: string;
  recipient: OutboundRecipientDetail;
  status: OutboundStatus;
  purpose: string | null;
  note: string | null;
  totalAmount: number;
  createdBy: OutboundUserSummary;
  approvedBy: OutboundUserSummary | null;
  rejectedReason: string | null;
  issuedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OutboundDetailItem[];
}

export interface OutboundItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOutboundInput {
  recipientId: string;
  purpose: string;
  note?: string | null;
  items: OutboundItemInput[];
}

export interface UpdateOutboundInput {
  recipientId?: string;
  purpose?: string;
  note?: string | null;
  items?: OutboundItemInput[];
}

export interface GetOutboundsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: OutboundStatus;
  recipientId?: string;
  from?: string;
  to?: string;
}

export interface RejectOutboundInput {
  reason: string;
}

export interface OutboundStatsData {
  thisMonth: number;
  pending: number;
  approvedToday: number;
  rejected: number;
}

// ─────────────────────────────────────────
// RECIPIENTS (Đơn vị nhận hàng — model Recipient)
// ─────────────────────────────────────────

export interface RecipientSummary {
  id: string;
  name: string;
}

export interface Recipient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
  outboundCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipientRecentOutbound {
  id: string;
  code: string;
  status: OutboundStatus;
  totalAmount: number;
  createdAt: string;
}

export interface RecipientDetail extends Recipient {
  stats: { totalOutbound: number; totalAmount: number };
  recentOutbounds: RecipientRecentOutbound[];
}

export interface CreateRecipientInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface UpdateRecipientInput extends Partial<CreateRecipientInput> {
  isActive?: boolean;
}

export interface GetRecipientsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
