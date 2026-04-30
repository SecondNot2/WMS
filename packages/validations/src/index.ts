// Shared Zod schemas for WMS (frontend forms + backend validation).
// TODO: Bổ sung schemas khi build từng module.

import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Thiếu refresh token"),
});
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới tối thiểu 8 ký tự")
      .max(128, "Mật khẩu quá dài"),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path: ["newPassword"],
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100).optional(),
  email: z.string().trim().toLowerCase().email("Email không hợp lệ").optional(),
  avatar: z
    .string()
    .trim()
    .max(500)
    .url("Avatar phải là URL hợp lệ")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(128),
  roleId: z.string().min(1, "Vui lòng chọn vai trò"),
});
export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().toLowerCase().email("Email không hợp lệ").optional(),
  password: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(128)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  roleId: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  roleId: z.string().trim().optional(),
  isActive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
});
export type GetUsersQuerySchemaInput = z.infer<typeof getUsersQuerySchema>;

export const toggleUserActiveSchema = z.object({
  isActive: z.boolean(),
});
export type ToggleUserActiveInput = z.infer<typeof toggleUserActiveSchema>;

// ─────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────

const permissionsSchema = z.record(
  z.string().min(1),
  z.array(z.string().min(1)),
);

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên vai trò tối thiểu 2 ký tự")
    .max(50)
    .regex(/^[A-Z][A-Z0-9_]*$/, "Mã vai trò chỉ gồm chữ in hoa, số và _"),
  permissions: permissionsSchema,
});
export type CreateRoleSchemaInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[A-Z][A-Z0-9_]*$/, "Mã vai trò chỉ gồm chữ in hoa, số và _")
    .optional(),
  permissions: permissionsSchema.optional(),
});
export type UpdateRoleSchemaInput = z.infer<typeof updateRoleSchema>;

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────

const nullableDescription = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(100, "Tên danh mục tối đa 100 ký tự"),
  description: nullableDescription,
});
export type CreateCategorySchemaInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({ isActive: z.boolean().optional() });
export type UpdateCategorySchemaInput = z.infer<typeof updateCategorySchema>;

export const getCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  isActive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
});
export type GetCategoriesQuerySchemaInput = z.infer<
  typeof getCategoriesQuerySchema
>;

export const categoryIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Thiếu mã danh mục"),
});
export type CategoryIdParamsSchemaInput = z.infer<
  typeof categoryIdParamsSchema
>;

// ─────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────

const nullableTrimmedString = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null));

const nullableNonNegativeNumber = z
  .union([z.coerce.number().nonnegative(), z.null()])
  .optional();

export const createProductSchema = z.object({
  sku: z.string().trim().min(1, "Vui lòng nhập mã SKU").max(50),
  barcode: nullableTrimmedString(100),
  name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(200),
  brand: nullableTrimmedString(100),
  model: nullableTrimmedString(100),
  description: nullableTrimmedString(1000),
  image: z
    .string()
    .trim()
    .max(500)
    .url("Hình ảnh phải là URL hợp lệ")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  unit: z.string().trim().min(1, "Vui lòng chọn đơn vị").max(50),
  categoryId: z.string().trim().min(1, "Vui lòng chọn danh mục"),
  minStock: z.coerce.number().int().nonnegative().default(0),
  costPrice: nullableNonNegativeNumber,
  salePrice: nullableNonNegativeNumber,
  taxRate: z.union([z.coerce.number().min(0).max(100), z.null()]).optional(),
  location: nullableTrimmedString(100),
});
export type CreateProductSchemaInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .partial()
  .extend({ isActive: z.boolean().optional() });
export type UpdateProductSchemaInput = z.infer<typeof updateProductSchema>;

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(20),
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  isActive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
  lowStock: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
});
export type GetProductsQuerySchemaInput = z.infer<
  typeof getProductsQuerySchema
>;

export const adjustStockSchema = z.object({
  quantity: z.coerce
    .number()
    .int("Số lượng phải là số nguyên")
    .refine((value) => value !== 0, "Số lượng điều chỉnh phải khác 0"),
  note: z.string().trim().max(500).optional(),
});
export type AdjustStockSchemaInput = z.infer<typeof adjustStockSchema>;

export const productIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Thiếu mã sản phẩm"),
});
export type ProductIdParamsSchemaInput = z.infer<typeof productIdParamsSchema>;

export const getAlertsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  level: z.enum(["CRITICAL", "WARNING"]).optional(),
  categoryId: z.string().trim().optional(),
});
export type GetAlertsQuerySchemaInput = z.infer<typeof getAlertsQuerySchema>;

// ─────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────

export const getInventoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  lowStock: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
});
export type GetInventoryQuerySchemaInput = z.infer<
  typeof getInventoryQuerySchema
>;

export const inventoryProductIdParamsSchema = z.object({
  productId: z.string().trim().min(1, "Thiếu mã sản phẩm"),
});
export type InventoryProductIdParamsSchemaInput = z.infer<
  typeof inventoryProductIdParamsSchema
>;

// ─────────────────────────────────────────
// SUPPLIERS
// ─────────────────────────────────────────

const nullableEmail = z
  .string()
  .trim()
  .max(200)
  .email("Email không hợp lệ")
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

const nullablePhone = z
  .string()
  .trim()
  .max(30)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

const nullableAddress = z
  .string()
  .trim()
  .max(300)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

const nullableTaxCode = z
  .string()
  .trim()
  .max(30)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên nhà cung cấp").max(200),
  phone: nullablePhone,
  email: nullableEmail,
  address: nullableAddress,
  taxCode: nullableTaxCode,
});
export type CreateSupplierSchemaInput = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = createSupplierSchema
  .partial()
  .extend({ isActive: z.boolean().optional() });
export type UpdateSupplierSchemaInput = z.infer<typeof updateSupplierSchema>;

export const getSuppliersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  isActive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
});
export type GetSuppliersQuerySchemaInput = z.infer<
  typeof getSuppliersQuerySchema
>;

export const supplierIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Thiếu mã nhà cung cấp"),
});
export type SupplierIdParamsSchemaInput = z.infer<
  typeof supplierIdParamsSchema
>;

// ─────────────────────────────────────────
// RECIPIENTS
// ─────────────────────────────────────────

export const createRecipientSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên đơn vị nhận").max(200),
  phone: nullablePhone,
  email: nullableEmail,
  address: nullableAddress,
});
export type CreateRecipientSchemaInput = z.infer<typeof createRecipientSchema>;

export const updateRecipientSchema = createRecipientSchema
  .partial()
  .extend({ isActive: z.boolean().optional() });
export type UpdateRecipientSchemaInput = z.infer<typeof updateRecipientSchema>;

export const getRecipientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  isActive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => (typeof v === "boolean" ? v : v === "true"))
    .optional(),
});
export type GetRecipientsQuerySchemaInput = z.infer<
  typeof getRecipientsQuerySchema
>;

export const recipientIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Thiếu mã đơn vị nhận"),
});
export type RecipientIdParamsSchemaInput = z.infer<
  typeof recipientIdParamsSchema
>;

// ─────────────────────────────────────────
// INBOUND (GoodsReceipt)
// ─────────────────────────────────────────

export const inboundItemSchema = z.object({
  productId: z.string().trim().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.coerce
    .number()
    .int("Số lượng phải là số nguyên")
    .positive("Số lượng phải lớn hơn 0"),
  unitPrice: z.coerce.number().nonnegative("Đơn giá không được âm"),
  taxRate: z.coerce
    .number()
    .min(0, "Thuế suất không được âm")
    .max(100, "Thuế suất tối đa 100%")
    .default(0),
});
export type InboundItemSchemaInput = z.infer<typeof inboundItemSchema>;

const nullableInboundNote = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

export const createInboundSchema = z.object({
  supplierId: z.string().trim().min(1, "Vui lòng chọn nhà cung cấp"),
  note: nullableInboundNote,
  items: z
    .array(inboundItemSchema)
    .min(1, "Phiếu nhập phải có ít nhất 1 sản phẩm"),
});
export type CreateInboundSchemaInput = z.infer<typeof createInboundSchema>;

export const updateInboundSchema = z.object({
  supplierId: z.string().trim().min(1).optional(),
  note: nullableInboundNote,
  items: z
    .array(inboundItemSchema)
    .min(1, "Phiếu nhập phải có ít nhất 1 sản phẩm")
    .optional(),
});
export type UpdateInboundSchemaInput = z.infer<typeof updateInboundSchema>;

export const getInboundsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  supplierId: z.string().trim().optional(),
  from: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày bắt đầu không hợp lệ",
    ),
  to: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày kết thúc không hợp lệ",
    ),
});
export type GetInboundsQuerySchemaInput = z.infer<
  typeof getInboundsQuerySchema
>;

export const rejectInboundSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập lý do từ chối")
    .max(500, "Lý do tối đa 500 ký tự"),
});
export type RejectInboundSchemaInput = z.infer<typeof rejectInboundSchema>;

export const inboundIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Thiếu mã phiếu nhập"),
});
export type InboundIdParamsSchemaInput = z.infer<typeof inboundIdParamsSchema>;

// ─────────────────────────────────────────
// OUTBOUND (GoodsIssue)
// ─────────────────────────────────────────

export const outboundItemSchema = z.object({
  productId: z.string().trim().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.coerce
    .number()
    .int("Số lượng phải là số nguyên")
    .positive("Số lượng phải lớn hơn 0"),
  unitPrice: z.coerce.number().nonnegative("Đơn giá không được âm"),
  taxRate: z.coerce
    .number()
    .min(0, "Thuế suất không được âm")
    .max(100, "Thuế suất tối đa 100%")
    .default(0),
});
export type OutboundItemSchemaInput = z.infer<typeof outboundItemSchema>;

const nullableOutboundNote = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

export const createOutboundSchema = z.object({
  recipientId: z.string().trim().min(1, "Vui lòng chọn đơn vị nhận"),
  purpose: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập lý do xuất")
    .max(200, "Lý do tối đa 200 ký tự"),
  note: nullableOutboundNote,
  items: z
    .array(outboundItemSchema)
    .min(1, "Phiếu xuất phải có ít nhất 1 sản phẩm"),
});
export type CreateOutboundSchemaInput = z.infer<typeof createOutboundSchema>;

export const updateOutboundSchema = z.object({
  recipientId: z.string().trim().min(1).optional(),
  purpose: z.string().trim().min(1).max(200).optional(),
  note: nullableOutboundNote,
  items: z
    .array(outboundItemSchema)
    .min(1, "Phiếu xuất phải có ít nhất 1 sản phẩm")
    .optional(),
});
export type UpdateOutboundSchemaInput = z.infer<typeof updateOutboundSchema>;

export const getOutboundsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  recipientId: z.string().trim().optional(),
  from: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày bắt đầu không hợp lệ",
    ),
  to: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày kết thúc không hợp lệ",
    ),
});
export type GetOutboundsQuerySchemaInput = z.infer<
  typeof getOutboundsQuerySchema
>;

export const rejectOutboundSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập lý do từ chối")
    .max(500, "Lý do tối đa 500 ký tự"),
});
export type RejectOutboundSchemaInput = z.infer<typeof rejectOutboundSchema>;

export const outboundIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Thiếu mã phiếu xuất"),
});
export type OutboundIdParamsSchemaInput = z.infer<
  typeof outboundIdParamsSchema
>;

// ─────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────

export const getStatisticsQuerySchema = z.object({
  from: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày bắt đầu không hợp lệ",
    ),
  to: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày kết thúc không hợp lệ",
    ),
  range: z.enum(["7d", "30d", "3m", "1y"]).optional(),
  categoryId: z.string().trim().optional(),
});
export type GetStatisticsQuerySchemaInput = z.infer<
  typeof getStatisticsQuerySchema
>;

const reportDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Ngày không hợp lệ");

export const getReportsStatsQuerySchema = z.object({
  type: z.enum(["inventory", "receipt-issue"]).optional(),
  from: reportDateSchema,
  to: reportDateSchema,
  categoryId: z.string().trim().optional(),
});
export type GetReportsStatsQuerySchemaInput = z.infer<
  typeof getReportsStatsQuerySchema
>;

export const exportReportQuerySchema = z.object({
  type: z.enum(["inventory", "receipt-issue", "top-products"]),
  from: reportDateSchema,
  to: reportDateSchema,
  date: reportDateSchema,
  categoryId: z.string().trim().optional(),
  supplierId: z.string().trim().optional(),
  recipientId: z.string().trim().optional(),
  topType: z.enum(["IN", "OUT"]).default("IN"),
  limit: z.coerce.number().int().positive().max(100).default(100),
});
export type ExportReportQuerySchemaInput = z.infer<
  typeof exportReportQuerySchema
>;

export const getReceiptIssueReportQuerySchema = z.object({
  from: reportDateSchema,
  to: reportDateSchema,
  supplierId: z.string().trim().optional(),
  recipientId: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type GetReceiptIssueReportQuerySchemaInput = z.infer<
  typeof getReceiptIssueReportQuerySchema
>;

export const getInventoryReportQuerySchema = z.object({
  date: reportDateSchema,
  categoryId: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type GetInventoryReportQuerySchemaInput = z.infer<
  typeof getInventoryReportQuerySchema
>;

export const getTopProductsReportQuerySchema = z.object({
  from: reportDateSchema,
  to: reportDateSchema,
  type: z.enum(["IN", "OUT"]).default("IN"),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type GetTopProductsReportQuerySchemaInput = z.infer<
  typeof getTopProductsReportQuerySchema
>;

export const getActivityLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  action: z.string().trim().optional(),
  targetType: z.string().trim().optional(),
  from: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày bắt đầu không hợp lệ",
    ),
  to: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Ngày kết thúc không hợp lệ",
    ),
});
export type GetActivityLogsQuerySchemaInput = z.infer<
  typeof getActivityLogsQuerySchema
>;

// ─────────────────────────────────────────
// SYSTEM SETTINGS
// ─────────────────────────────────────────

export const settingsKeySchema = z.enum([
  "general",
  "alerts",
  "security",
  "integrations",
]);
export type SettingsKeyInput = z.infer<typeof settingsKeySchema>;

export const settingsKeyParamsSchema = z.object({
  key: settingsKeySchema,
});

const optionalNullableUrl = z
  .union([z.string().trim().url("URL không hợp lệ"), z.literal("")])
  .nullable()
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

const optionalNullableEmail = z
  .union([
    z.string().trim().toLowerCase().email("Email không hợp lệ"),
    z.literal(""),
  ])
  .nullable()
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

const optionalNullableString = (max = 255) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v));

export const generalSettingsSchema = z.object({
  systemName: z
    .string()
    .trim()
    .min(1, "Tên hệ thống không được để trống")
    .max(100),
  warehouseCode: z.string().trim().min(1, "Mã kho không được để trống").max(50),
  warehouseName: z
    .string()
    .trim()
    .min(1, "Tên kho không được để trống")
    .max(150),
  adminEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email quản trị không hợp lệ"),
  address: z.string().trim().max(500).default(""),
});
export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;

export const updateGeneralSettingsSchema = generalSettingsSchema.partial();
export type UpdateGeneralSettingsSchemaInput = z.infer<
  typeof updateGeneralSettingsSchema
>;

export const alertSettingsSchema = z.object({
  lowStockPercent: z.coerce
    .number()
    .int("Phải là số nguyên")
    .min(0, "Không được nhỏ hơn 0")
    .max(1000, "Giá trị quá lớn"),
  pendingHours: z.coerce
    .number()
    .int("Phải là số nguyên")
    .min(0)
    .max(720, "Tối đa 720 giờ"),
  summaryFrequency: z.enum(["realtime", "daily", "weekly"]),
  emailLowStock: z.boolean(),
  emailPendingOverdue: z.boolean(),
  emailIssueRejected: z.boolean(),
});
export type AlertSettingsInput = z.infer<typeof alertSettingsSchema>;

export const updateAlertSettingsSchema = alertSettingsSchema.partial();
export type UpdateAlertSettingsSchemaInput = z.infer<
  typeof updateAlertSettingsSchema
>;

export const securitySettingsSchema = z.object({
  accessTokenMinutes: z.coerce
    .number()
    .int()
    .min(1, "Tối thiểu 1 phút")
    .max(1440, "Tối đa 1440 phút"),
  refreshTokenDays: z.coerce
    .number()
    .int()
    .min(1, "Tối thiểu 1 ngày")
    .max(365, "Tối đa 365 ngày"),
  maxFailedLogin: z.coerce
    .number()
    .int()
    .min(1, "Tối thiểu 1 lần")
    .max(20, "Tối đa 20 lần"),
  requirePeriodicReset: z.boolean(),
  autoLockInactive: z.boolean(),
});
export type SecuritySettingsInput = z.infer<typeof securitySettingsSchema>;

export const updateSecuritySettingsSchema = securitySettingsSchema.partial();
export type UpdateSecuritySettingsSchemaInput = z.infer<
  typeof updateSecuritySettingsSchema
>;

export const integrationSettingsSchema = z.object({
  webhookUrl: optionalNullableUrl,
  defaultReportFormat: z.enum(["xlsx", "pdf", "csv"]),
  smtpHost: optionalNullableString(255),
  notificationEmail: optionalNullableEmail,
});
export type IntegrationSettingsInput = z.infer<
  typeof integrationSettingsSchema
>;

export const updateIntegrationSettingsSchema =
  integrationSettingsSchema.partial();
export type UpdateIntegrationSettingsSchemaInput = z.infer<
  typeof updateIntegrationSettingsSchema
>;
