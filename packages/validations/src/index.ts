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
