import { Prisma } from "@prisma/client";
import type {
  EfficiencyData,
  PerformanceData,
  StatisticsCategoryDistribution,
  StatisticsFlowPoint,
  StatisticsTopProduct,
} from "@wms/types";
import type { GetStatisticsQuerySchemaInput } from "@wms/validations";
import { prisma } from "../lib/prisma";

interface DateRange {
  from: Date;
  to: Date;
}

function resolveRange(query: GetStatisticsQuerySchemaInput): DateRange {
  const now = new Date();
  const to = query.to ? new Date(query.to) : now;
  if (query.from) {
    return { from: new Date(query.from), to };
  }

  const days = (() => {
    switch (query.range) {
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "3m":
        return 90;
      case "1y":
        return 365;
      default:
        return 30;
    }
  })();

  const from = new Date(to);
  from.setDate(from.getDate() - days);
  return { from, to };
}

function previousRange(range: DateRange): DateRange {
  const span = range.to.getTime() - range.from.getTime();
  return {
    from: new Date(range.from.getTime() - span),
    to: range.from,
  };
}

function trendPercent(current: number, previous: number): number {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function formatDateLabel(d: Date): string {
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

// ─────────────────────────────────────────
// EFFICIENCY
// ─────────────────────────────────────────

export async function getEfficiency(
  query: GetStatisticsQuerySchemaInput,
): Promise<EfficiencyData> {
  const { from, to } = resolveRange(query);
  const dateFilter = { gte: from, lte: to };

  const [
    inApproved,
    inRejected,
    inTotal,
    outApproved,
    outRejected,
    outTotal,
    avgApprovalRow,
    adjustAgg,
    inboundQtyAgg,
    outboundQtyAgg,
    avgStockAgg,
  ] = await Promise.all([
    prisma.goodsReceipt.count({
      where: { status: "APPROVED", createdAt: dateFilter },
    }),
    prisma.goodsReceipt.count({
      where: { status: "REJECTED", createdAt: dateFilter },
    }),
    prisma.goodsReceipt.count({ where: { createdAt: dateFilter } }),
    prisma.goodsIssue.count({
      where: { status: "APPROVED", createdAt: dateFilter },
    }),
    prisma.goodsIssue.count({
      where: { status: "REJECTED", createdAt: dateFilter },
    }),
    prisma.goodsIssue.count({ where: { createdAt: dateFilter } }),
    prisma.$queryRaw<{ avg_hours: number | null }[]>`
      SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 3600.0)::float AS avg_hours
      FROM (
        SELECT "createdAt", "updatedAt" FROM goods_receipts
          WHERE status = 'APPROVED' AND "createdAt" BETWEEN ${from} AND ${to}
        UNION ALL
        SELECT "createdAt", "updatedAt" FROM goods_issues
          WHERE status = 'APPROVED' AND "createdAt" BETWEEN ${from} AND ${to}
      ) t
    `,
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: { type: "ADJUST", createdAt: dateFilter },
    }),
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: { type: "IN", createdAt: dateFilter },
    }),
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: { type: "OUT", createdAt: dateFilter },
    }),
    prisma.product.aggregate({
      _avg: { currentStock: true },
      where: { isActive: true },
    }),
  ]);

  const totalApproved = inApproved + outApproved;
  const totalDecided = totalApproved + inRejected + outRejected;
  const approvalRate = totalDecided
    ? Math.round((totalApproved / totalDecided) * 1000) / 10
    : 0;

  const avgApprovalTime =
    Math.round((avgApprovalRow[0]?.avg_hours ?? 0) * 10) / 10;

  const totalIn = Number(inboundQtyAgg._sum.quantity ?? 0);
  const totalOut = Number(outboundQtyAgg._sum.quantity ?? 0);
  const totalAdjust = Math.abs(Number(adjustAgg._sum.quantity ?? 0));
  const stockAccuracy = totalIn + totalOut === 0
    ? 100
    : Math.max(
        0,
        Math.round(
          (1 - totalAdjust / (totalIn + totalOut + totalAdjust)) * 1000,
        ) / 10,
      );

  const avgStock = Number(avgStockAgg._avg.currentStock ?? 0);
  const turnoverRate = avgStock > 0
    ? Math.round((totalOut / avgStock) * 10) / 10
    : 0;

  const inboundFulfillmentRate = inTotal
    ? Math.round((inApproved / inTotal) * 1000) / 10
    : 0;
  const outboundFulfillmentRate = outTotal
    ? Math.round((outApproved / outTotal) * 1000) / 10
    : 0;

  return {
    approvalRate,
    avgApprovalTime,
    stockAccuracy,
    turnoverRate,
    inboundFulfillmentRate,
    outboundFulfillmentRate,
  };
}

// ─────────────────────────────────────────
// PERFORMANCE
// ─────────────────────────────────────────

interface FlowRow {
  bucket: Date;
  inbound: number;
  outbound: number;
}

async function getFlowSeries(
  range: DateRange,
  categoryId?: string,
): Promise<StatisticsFlowPoint[]> {
  const span = range.to.getTime() - range.from.getTime();
  const days = span / (1000 * 60 * 60 * 24);
  const granularity = days <= 31 ? "day" : days <= 120 ? "week" : "month";

  const productJoin = categoryId
    ? Prisma.sql`JOIN products p ON p.id = sh."productId" AND p."categoryId" = ${categoryId}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<FlowRow[]>`
    SELECT
      DATE_TRUNC(${granularity}, sh."createdAt") AS bucket,
      COALESCE(SUM(CASE WHEN sh.type = 'IN' THEN sh.quantity ELSE 0 END), 0)::int AS inbound,
      COALESCE(SUM(CASE WHEN sh.type = 'OUT' THEN sh.quantity ELSE 0 END), 0)::int AS outbound
    FROM stock_histories sh
    ${productJoin}
    WHERE sh."createdAt" BETWEEN ${range.from} AND ${range.to}
      AND sh.type IN ('IN', 'OUT')
    GROUP BY bucket
    ORDER BY bucket ASC
  `;

  return rows.map((r) => {
    const date = new Date(r.bucket);
    return {
      date: date.toISOString(),
      label: formatDateLabel(date),
      inbound: Number(r.inbound),
      outbound: Number(r.outbound),
    };
  });
}

async function getTopProducts(
  range: DateRange,
  categoryId?: string,
): Promise<StatisticsTopProduct[]> {
  const grouped = await prisma.stockHistory.groupBy({
    by: ["productId"],
    where: {
      createdAt: { gte: range.from, lte: range.to },
      type: { in: ["IN", "OUT"] },
      ...(categoryId && { product: { categoryId } }),
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  if (grouped.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, sku: true, name: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  return grouped
    .map((g): StatisticsTopProduct | null => {
      const p = productMap.get(g.productId);
      if (!p) return null;
      return {
        productId: p.id,
        sku: p.sku,
        name: p.name,
        quantity: Math.abs(Number(g._sum.quantity ?? 0)),
      };
    })
    .filter((x): x is StatisticsTopProduct => x !== null);
}

async function getCategoryDistribution(
  categoryId?: string,
): Promise<StatisticsCategoryDistribution[]> {
  const rows = await prisma.$queryRaw<
    { categoryId: string; name: string; value: number }[]
  >`
    SELECT
      c.id AS "categoryId",
      c.name AS name,
      COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0)::float AS value
    FROM categories c
    LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
    WHERE c."isActive" = true
      ${categoryId ? Prisma.sql`AND c.id = ${categoryId}` : Prisma.empty}
    GROUP BY c.id, c.name
    HAVING COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0) > 0
    ORDER BY value DESC
  `;

  return rows.map((r) => ({
    categoryId: r.categoryId,
    name: r.name,
    value: Number(r.value),
  }));
}

export async function getPerformance(
  query: GetStatisticsQuerySchemaInput,
): Promise<PerformanceData> {
  const range = resolveRange(query);
  const prev = previousRange(range);
  const { categoryId } = query;

  const productWhere: Prisma.ProductWhereInput = {
    ...(categoryId && { categoryId }),
  };

  const [
    inboundCurr,
    inboundPrev,
    outboundCurr,
    outboundPrev,
    inventoryRow,
    activeCurr,
    flowSeries,
    topProducts,
    categoryDistribution,
  ] = await Promise.all([
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: {
        type: "IN",
        createdAt: { gte: range.from, lte: range.to },
        ...(categoryId && { product: { categoryId } }),
      },
    }),
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: {
        type: "IN",
        createdAt: { gte: prev.from, lte: prev.to },
        ...(categoryId && { product: { categoryId } }),
      },
    }),
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: {
        type: "OUT",
        createdAt: { gte: range.from, lte: range.to },
        ...(categoryId && { product: { categoryId } }),
      },
    }),
    prisma.stockHistory.aggregate({
      _sum: { quantity: true },
      where: {
        type: "OUT",
        createdAt: { gte: prev.from, lte: prev.to },
        ...(categoryId && { product: { categoryId } }),
      },
    }),
    prisma.$queryRaw<{ value: number }[]>`
      SELECT COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0)::float AS value
      FROM products p
      WHERE p."isActive" = true
        ${categoryId ? Prisma.sql`AND p."categoryId" = ${categoryId}` : Prisma.empty}
    `,
    prisma.product.count({ where: { isActive: true, ...productWhere } }),
    getFlowSeries(range, categoryId),
    getTopProducts(range, categoryId),
    getCategoryDistribution(categoryId),
  ]);

  const totalInbound = Number(inboundCurr._sum.quantity ?? 0);
  const totalOutbound = Number(outboundCurr._sum.quantity ?? 0);
  const inventoryValue = Number(inventoryRow[0]?.value ?? 0);

  return {
    summary: {
      totalInbound: {
        value: totalInbound,
        trend: trendPercent(
          totalInbound,
          Number(inboundPrev._sum.quantity ?? 0),
        ),
      },
      totalOutbound: {
        value: totalOutbound,
        trend: trendPercent(
          totalOutbound,
          Number(outboundPrev._sum.quantity ?? 0),
        ),
      },
      inventoryValue: { value: inventoryValue, trend: 0 },
      activeProducts: { value: activeCurr, trend: 0 },
    },
    flowSeries,
    topProducts,
    categoryDistribution,
  };
}
