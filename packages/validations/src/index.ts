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
  limit: z.coerce.number().int().positive().max(100).default(20),
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
