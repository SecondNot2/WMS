/**
 * Route Handler helpers — thay thế Express middleware chain.
 *
 * Pattern:
 *   export const GET = handle(async (req) => { ... })
 *   export const POST = handle({ roles: ['ADMIN'] }, async (req, ctx) => { ... })
 *
 * - `handle()` tự catch error → JSON response chuẩn
 * - Khi truyền options.roles → tự authenticate + authorize
 * - Truyền `user` và `params` qua context cho handler
 */
import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import {
  hasStoredPermission,
  type PermissionAction,
} from "@/lib/permission-core";

export interface AuthUser {
  id: string;
  role: string;
}

export interface RouteContext<P = Record<string, string>> {
  user: AuthUser | null;
  params: P;
  req: NextRequest;
}

interface HandleOptions {
  /** Danh sách role được phép. Truyền `[]` hoặc undefined = public. */
  roles?: string[];
  /** Bắt buộc phải đăng nhập nhưng không check role cụ thể. */
  authenticated?: boolean;
}

const MODULE_BY_SEGMENT: Record<string, string> = {
  products: "product",
  categories: "category",
  inbound: "receipt",
  outbound: "issue",
  inventory: "stock",
  alerts: "stock",
  suppliers: "supplier",
  recipients: "recipient",
  reports: "report",
  statistics: "report",
  users: "user",
  roles: "role",
  "activity-log": "activityLog",
};

type Handler<P> = (
  req: NextRequest,
  ctx: RouteContext<P>,
) => Promise<Response | NextResponse> | Response | NextResponse;

/**
 * Next.js 15+ truyền `params` dưới dạng Promise. Wrapper unwrap giúp handler.
 */
type RouteSecondArg<P> = { params: Promise<P> } | undefined;

export function handle<
  P extends Record<string, string> = Record<string, string>,
>(optionsOrHandler: HandleOptions | Handler<P>, maybeHandler?: Handler<P>) {
  const options: HandleOptions =
    typeof optionsOrHandler === "function" ? {} : optionsOrHandler;
  const handler: Handler<P> =
    typeof optionsOrHandler === "function" ? optionsOrHandler : maybeHandler!;

  return async (req: NextRequest, second?: RouteSecondArg<P>) => {
    try {
      const params = second?.params ? await second.params : ({} as P);

      let user: AuthUser | null = null;
      const needsAuth =
        options.authenticated === true ||
        (options.roles !== undefined && options.roles.length > 0);

      if (needsAuth) {
        user = authenticate(req);
        if (
          options.roles &&
          options.roles.length > 0 &&
          !options.roles.includes(user.role) &&
          !(await canAccessByStoredPermission(user.id, req))
        ) {
          throw new AppError(
            "FORBIDDEN",
            "Không có quyền thực hiện thao tác này",
          );
        }
      } else {
        // Cố gắng parse user nếu có (cho endpoint optional auth)
        try {
          user = authenticate(req);
        } catch {
          user = null;
        }
      }

      const result = await handler(req, { user, params, req });
      return result;
    } catch (err) {
      return errorResponse(err);
    }
  };
}

/**
 * Parse JWT từ Authorization header, throw AppError nếu thiếu/sai.
 */
export function authenticate(req: NextRequest): AuthUser {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("UNAUTHORIZED", "Chưa đăng nhập");
  }
  const token = header.slice("Bearer ".length).trim();
  const payload = verifyAccessToken(token);
  return { id: payload.sub, role: payload.role };
}

function permissionActionFromRequest(
  req: NextRequest,
): PermissionAction | null {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const apiIndex = segments.indexOf("api");
  const resource = segments[apiIndex + 1];
  if (!resource) return null;
  const permissionResource = MODULE_BY_SEGMENT[resource];
  if (!permissionResource) return null;
  const subPath = segments.slice(apiIndex + 2);
  let action: string;
  if (subPath.includes("approve") || subPath.includes("reject")) {
    action = "approve";
  } else if (
    subPath.includes("export") ||
    req.nextUrl.searchParams.has("export")
  ) {
    action = "export";
  } else if (req.method === "GET") {
    action = "view";
  } else if (req.method === "DELETE") {
    action = "delete";
  } else {
    action = "create";
  }
  if (req.method === "PATCH" || req.method === "PUT") action = "update";
  const key = `${permissionResource}.${action}`;
  return key as PermissionAction;
}

async function canAccessByStoredPermission(
  userId: string,
  req: NextRequest,
): Promise<boolean> {
  const action = permissionActionFromRequest(req);
  if (!action) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true, role: { select: { permissions: true } } },
  });
  if (!user?.isActive) return false;
  return hasStoredPermission(
    (user.role.permissions ?? {}) as Record<string, string[]>,
    action,
  );
}

/**
 * Validate body với Zod schema, throw ZodError nếu sai (sẽ được errorResponse map thành 422).
 */
export async function parseBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new AppError("VALIDATION_ERROR", "Body không phải JSON hợp lệ");
  }
  return schema.parse(raw);
}

/**
 * Validate query string với Zod schema.
 */
export function parseQuery<T>(req: NextRequest, schema: ZodSchema<T>): T {
  const obj = Object.fromEntries(req.nextUrl.searchParams.entries());
  return schema.parse(obj);
}

/**
 * Map mọi loại error → JSON response chuẩn.
 */
export function errorResponse(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return NextResponse.json(
      { success: false, error: { code: err.code, message: err.message } },
      { status: err.statusCode },
    );
  }

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Dữ liệu không hợp lệ",
          details: err.issues,
        },
      },
      { status: 422 },
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "CONFLICT", message: "Dữ liệu đã tồn tại" },
        },
        { status: 409 },
      );
    }
    if (err.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Bản ghi không tồn tại" },
        },
        { status: 404 },
      );
    }
  }

  logger.error(err as Error);
  return NextResponse.json(
    {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Lỗi server" },
    },
    { status: 500 },
  );
}

/**
 * Wrapper trả về JSON success — ngắn gọn cho Route Handler.
 */
export function ok<T>(data: T, init?: ResponseInit & { meta?: unknown }) {
  const { meta, ...rest } = init ?? {};
  return NextResponse.json(
    meta !== undefined
      ? { success: true, data, meta }
      : { success: true, data },
    rest,
  );
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

/**
 * Trả về file Excel binary với headers đúng để browser download.
 */
export function excelResponse(buffer: Buffer | Uint8Array, filename: string) {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
