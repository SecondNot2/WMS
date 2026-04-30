/**
 * OpenAPI 3.1 document for WMS API.
 *
 * Strategy: cover the 4 most important business flows (auth, products,
 * inbound, outbound) end-to-end as a representative sample. Other endpoints
 * follow the same patterns and can be added incrementally.
 *
 * Schemas come from @wms/validations (the same ones used at runtime), so the
 * docs stay in sync with the actual validation logic.
 */
import { createDocument } from "zod-openapi";
import { z } from "zod";
import {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  paginationQuerySchema,
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
  adjustStockSchema,
  productIdParamsSchema,
  createInboundSchema,
  getInboundsQuerySchema,
  rejectInboundSchema,
  inboundIdParamsSchema,
  createOutboundSchema,
} from "@wms/validations";

// ─────────────────────────────────────────────────────────────────────────
// Reusable response envelopes
// ─────────────────────────────────────────────────────────────────────────

const successResponse = <T extends z.ZodType>(data: T) =>
  z.object({
    success: z.literal(true),
    data,
  });

const paginatedResponse = <T extends z.ZodType>(item: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(item),
    meta: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      total: z.number().int(),
      totalPages: z.number().int(),
    }),
  });

const errorResponse = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.string().describe("Machine-readable error code"),
      message: z.string().describe("Human-readable error message (Vietnamese)"),
    }),
  })
  .meta({ id: "ErrorResponse" });

// ─────────────────────────────────────────────────────────────────────────
// Domain entity schemas (response shapes)
// ─────────────────────────────────────────────────────────────────────────

const userResponseSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
    role: z.enum(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
  })
  .meta({ id: "User" });

const productResponseSchema = z
  .object({
    id: z.string().uuid(),
    sku: z.string(),
    name: z.string(),
    unit: z.string(),
    currentStock: z.number().int(),
    minStock: z.number().int(),
    categoryId: z.string().uuid().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .meta({ id: "Product" });

const inboundResponseSchema = z
  .object({
    id: z.string().uuid(),
    code: z.string().describe("Auto-generated PNK-YYYY-XXXX"),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    supplierId: z.string().uuid().nullable(),
    note: z.string().nullable(),
    createdAt: z.string().datetime(),
    approvedAt: z.string().datetime().nullable(),
  })
  .meta({ id: "GoodsReceipt" });

// Common error responses block
const errorResponses = {
  "401": {
    description: "Chưa đăng nhập hoặc token hết hạn",
    content: { "application/json": { schema: errorResponse } },
  },
  "403": {
    description: "Không có quyền truy cập (RBAC)",
    content: { "application/json": { schema: errorResponse } },
  },
  "404": {
    description: "Resource không tồn tại",
    content: { "application/json": { schema: errorResponse } },
  },
  "422": {
    description: "Dữ liệu không hợp lệ (Zod validation failed)",
    content: { "application/json": { schema: errorResponse } },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────
// Build the document
// ─────────────────────────────────────────────────────────────────────────

export const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Warehouse Management System API",
    version: "1.0.0",
    description:
      "REST API cho hệ thống quản lý kho WMS. Tất cả endpoints (trừ `/auth/login` và `/auth/refresh`) yêu cầu JWT access token trong header `Authorization: Bearer <token>`. Phân quyền dựa trên RBAC 3 roles: `ADMIN`, `WAREHOUSE_STAFF`, `ACCOUNTANT`.",
    contact: {
      name: "WMS",
      url: "https://github.com/SecondNot2/WMS",
    },
    license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  },
  servers: [{ url: "/api", description: "Same-origin (production / dev)" }],
  tags: [
    { name: "Auth", description: "Đăng nhập, refresh token, đổi mật khẩu" },
    { name: "Products", description: "CRUD sản phẩm + adjust stock" },
    {
      name: "Inbound",
      description: "Phiếu nhập kho (PNK) — tạo, duyệt, từ chối",
    },
    {
      name: "Outbound",
      description: "Phiếu xuất kho (PXK) — tạo, duyệt, từ chối",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT access token (15 phút). Lấy từ `POST /auth/login`.",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ── Auth ──────────────────────────────────────────────────────────
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Đăng nhập bằng email + password",
        security: [],
        requestBody: {
          content: { "application/json": { schema: loginSchema } },
        },
        responses: {
          "200": {
            description: "Đăng nhập thành công",
            content: {
              "application/json": {
                schema: successResponse(
                  z.object({
                    user: userResponseSchema,
                    accessToken: z.string(),
                    refreshToken: z.string(),
                  }),
                ),
              },
            },
          },
          "401": errorResponses["401"],
          "422": errorResponses["422"],
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        security: [],
        requestBody: {
          content: { "application/json": { schema: refreshTokenSchema } },
        },
        responses: {
          "200": {
            description: "Token mới",
            content: {
              "application/json": {
                schema: successResponse(
                  z.object({
                    accessToken: z.string(),
                    refreshToken: z.string(),
                  }),
                ),
              },
            },
          },
          "401": errorResponses["401"],
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Thông tin user hiện tại",
        responses: {
          "200": {
            description: "User đang đăng nhập",
            content: {
              "application/json": {
                schema: successResponse(userResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
        },
      },
    },
    "/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Đổi mật khẩu (yêu cầu mật khẩu hiện tại)",
        requestBody: {
          content: { "application/json": { schema: changePasswordSchema } },
        },
        responses: {
          "200": {
            description: "Đã đổi mật khẩu",
            content: {
              "application/json": {
                schema: z.object({ success: z.literal(true) }),
              },
            },
          },
          "401": errorResponses["401"],
          "422": errorResponses["422"],
        },
      },
    },

    // ── Products ──────────────────────────────────────────────────────
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Danh sách sản phẩm (phân trang + search)",
        requestParams: { query: getProductsQuerySchema },
        responses: {
          "200": {
            description: "Danh sách sản phẩm",
            content: {
              "application/json": {
                schema: paginatedResponse(productResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
        },
      },
      post: {
        tags: ["Products"],
        summary: "Tạo sản phẩm mới (ADMIN, WAREHOUSE_STAFF)",
        requestBody: {
          content: { "application/json": { schema: createProductSchema } },
        },
        responses: {
          "201": {
            description: "Đã tạo",
            content: {
              "application/json": {
                schema: successResponse(productResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "422": errorResponses["422"],
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Chi tiết sản phẩm",
        requestParams: { path: productIdParamsSchema },
        responses: {
          "200": {
            description: "Chi tiết",
            content: {
              "application/json": {
                schema: successResponse(productResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
          "404": errorResponses["404"],
        },
      },
      patch: {
        tags: ["Products"],
        summary: "Cập nhật sản phẩm (ADMIN, WAREHOUSE_STAFF)",
        requestParams: { path: productIdParamsSchema },
        requestBody: {
          content: { "application/json": { schema: updateProductSchema } },
        },
        responses: {
          "200": {
            description: "Đã cập nhật",
            content: {
              "application/json": {
                schema: successResponse(productResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "404": errorResponses["404"],
          "422": errorResponses["422"],
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Xoá mềm sản phẩm (ADMIN)",
        requestParams: { path: productIdParamsSchema },
        responses: {
          "200": {
            description: "Đã xoá",
            content: {
              "application/json": {
                schema: z.object({ success: z.literal(true) }),
              },
            },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "404": errorResponses["404"],
        },
      },
    },
    "/products/{id}/adjust-stock": {
      post: {
        tags: ["Products"],
        summary: "Điều chỉnh tồn kho (ghi StockHistory)",
        requestParams: { path: productIdParamsSchema },
        requestBody: {
          content: { "application/json": { schema: adjustStockSchema } },
        },
        responses: {
          "200": {
            description: "Đã điều chỉnh",
            content: {
              "application/json": {
                schema: successResponse(productResponseSchema),
              },
            },
          },
          "400": {
            description: "Tồn kho không đủ để giảm",
            content: { "application/json": { schema: errorResponse } },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "404": errorResponses["404"],
          "422": errorResponses["422"],
        },
      },
    },

    // ── Inbound (phiếu nhập) ─────────────────────────────────────────
    "/inbound": {
      get: {
        tags: ["Inbound"],
        summary: "Danh sách phiếu nhập",
        requestParams: { query: getInboundsQuerySchema },
        responses: {
          "200": {
            description: "Danh sách",
            content: {
              "application/json": {
                schema: paginatedResponse(inboundResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
        },
      },
      post: {
        tags: ["Inbound"],
        summary: "Tạo phiếu nhập (status = PENDING)",
        requestBody: {
          content: { "application/json": { schema: createInboundSchema } },
        },
        responses: {
          "201": {
            description: "Đã tạo phiếu (auto-gen mã PNK-YYYY-XXXX)",
            content: {
              "application/json": {
                schema: successResponse(inboundResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "422": errorResponses["422"],
        },
      },
    },
    "/inbound/{id}/approve": {
      post: {
        tags: ["Inbound"],
        summary:
          "Duyệt phiếu nhập — transaction increment stock + StockHistory + emit realtime",
        requestParams: { path: inboundIdParamsSchema },
        responses: {
          "200": {
            description: "Đã duyệt",
            content: {
              "application/json": {
                schema: successResponse(inboundResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "404": errorResponses["404"],
          "409": {
            description: "Phiếu đã được xử lý trước đó",
            content: { "application/json": { schema: errorResponse } },
          },
        },
      },
    },
    "/inbound/{id}/reject": {
      post: {
        tags: ["Inbound"],
        summary: "Từ chối phiếu nhập (yêu cầu lý do)",
        requestParams: { path: inboundIdParamsSchema },
        requestBody: {
          content: { "application/json": { schema: rejectInboundSchema } },
        },
        responses: {
          "200": {
            description: "Đã từ chối",
            content: {
              "application/json": {
                schema: successResponse(inboundResponseSchema),
              },
            },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "404": errorResponses["404"],
          "409": {
            description: "Phiếu đã được xử lý trước đó",
            content: { "application/json": { schema: errorResponse } },
          },
          "422": errorResponses["422"],
        },
      },
    },

    // ── Outbound (phiếu xuất) ────────────────────────────────────────
    "/outbound": {
      get: {
        tags: ["Outbound"],
        summary: "Danh sách phiếu xuất",
        requestParams: { query: paginationQuerySchema },
        responses: {
          "200": {
            description: "Danh sách",
            content: {
              "application/json": {
                schema: paginatedResponse(
                  inboundResponseSchema.meta({ id: "GoodsIssue" }),
                ),
              },
            },
          },
          "401": errorResponses["401"],
        },
      },
      post: {
        tags: ["Outbound"],
        summary: "Tạo phiếu xuất (validate stock đủ trước approve)",
        requestBody: {
          content: { "application/json": { schema: createOutboundSchema } },
        },
        responses: {
          "201": {
            description: "Đã tạo phiếu (auto-gen mã PXK-YYYY-XXXX)",
            content: {
              "application/json": {
                schema: successResponse(inboundResponseSchema),
              },
            },
          },
          "400": {
            description: "INSUFFICIENT_STOCK — sản phẩm không đủ tồn",
            content: { "application/json": { schema: errorResponse } },
          },
          "401": errorResponses["401"],
          "403": errorResponses["403"],
          "422": errorResponses["422"],
        },
      },
    },
  },
});
