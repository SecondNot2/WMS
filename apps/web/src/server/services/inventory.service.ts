import { Prisma } from "@prisma/client";
import type {
  InventoryAlertLevel,
  InventoryItem,
  InventorySummaryData,
} from "@wms/types";
import type {
  AdjustStockSchemaInput,
  GetInventoryQuerySchemaInput,
} from "@wms/validations";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { emitStockUpdated } from "../lib/websocket";

const inventoryProductSelect = {
  id: true,
  sku: true,
  name: true,
  unit: true,
  currentStock: true,
  minStock: true,
  costPrice: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
} satisfies Prisma.ProductSelect;

type InventoryProduct = Prisma.ProductGetPayload<{
  select: typeof inventoryProductSelect;
}>;

function getAlertLevel(
  product: Pick<InventoryProduct, "currentStock" | "minStock">,
): InventoryAlertLevel {
  if (product.currentStock <= 0) return "CRITICAL";
  if (product.currentStock <= product.minStock) return "WARNING";
  return "OK";
}

function toInventoryItem(product: InventoryProduct): InventoryItem {
  const costPrice =
    product.costPrice === null ? null : Number(product.costPrice);
  const stockValue = product.currentStock * (costPrice ?? 0);

  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    unit: product.unit,
    category: product.category,
    currentStock: product.currentStock,
    minStock: product.minStock,
    costPrice,
    stockValue,
    alertLevel: getAlertLevel(product),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function buildInventoryWhere(
  query: GetInventoryQuerySchemaInput,
): Prisma.ProductWhereInput {
  const { search, categoryId, lowStock } = query;

  return {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(lowStock && { currentStock: { lte: prisma.product.fields.minStock } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };
}

export async function getInventory(query: GetInventoryQuerySchemaInput) {
  const { page, limit } = query;
  const where = buildInventoryWhere(query);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: inventoryProductSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ currentStock: "asc" }, { name: "asc" }],
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map(toInventoryItem),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getInventorySummary(): Promise<InventorySummaryData> {
  const baseWhere: Prisma.ProductWhereInput = { isActive: true };

  const [totals, criticalCount, warningCount, valueRow, byCategoryRows] =
    await Promise.all([
      prisma.product.aggregate({
        where: baseWhere,
        _count: { _all: true },
        _sum: { currentStock: true },
      }),
      prisma.product.count({
        where: { ...baseWhere, currentStock: { lte: 0 } },
      }),
      prisma.product.count({
        where: {
          ...baseWhere,
          currentStock: { gt: 0, lte: prisma.product.fields.minStock },
        },
      }),
      prisma.$queryRaw<{ value: number }[]>`
        SELECT COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0)::float AS value
        FROM products p
        WHERE p."isActive" = true
      `,
      prisma.$queryRaw<
        { categoryId: string; name: string; stock: number; value: number }[]
      >`
        SELECT
          c.id   AS "categoryId",
          c.name AS name,
          COALESCE(SUM(p."currentStock"), 0)::int AS stock,
          COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0)::float AS value
        FROM categories c
        LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
        WHERE c."isActive" = true
        GROUP BY c.id, c.name
        ORDER BY value DESC, stock DESC
      `,
    ]);

  return {
    totalProducts: totals._count._all,
    totalStock: Number(totals._sum.currentStock ?? 0),
    totalValue: Number(valueRow[0]?.value ?? 0),
    lowStockCount: criticalCount + warningCount,
    criticalCount,
    byCategory: byCategoryRows.map((r) => ({
      categoryId: r.categoryId,
      name: r.name,
      stock: Number(r.stock),
      value: Number(r.value),
    })),
  };
}

export async function adjustInventoryStock(
  productId: string,
  input: AdjustStockSchemaInput,
  actorId: string,
): Promise<InventoryItem> {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new AppError("NOT_FOUND", "Sản phẩm không tồn tại");
  }

  const stockAfter = product.currentStock + input.quantity;
  if (stockAfter < 0) {
    throw new AppError("INSUFFICIENT_STOCK", "Tồn kho không đủ để điều chỉnh");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.product.update({
      where: { id: productId },
      data: { currentStock: stockAfter },
      select: inventoryProductSelect,
    });

    await tx.stockHistory.create({
      data: {
        productId,
        type: "ADJUST",
        quantity: input.quantity,
        stockBefore: product.currentStock,
        stockAfter,
        note: input.note,
        createdById: actorId,
      },
    });

    return next;
  });

  emitStockUpdated([productId]);

  return toInventoryItem(updated);
}
