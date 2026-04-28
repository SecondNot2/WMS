import { Prisma } from "@prisma/client";
import type {
  InventoryReportData,
  InventoryReportItem,
  ReceiptIssueChartPoint,
  ReceiptIssueReportData,
  ReceiptIssueReportItem,
  ReportStatCard,
  TopProductsReportData,
  TopProductsReportItem,
} from "@wms/types";
import type {
  GetInventoryReportQuerySchemaInput,
  GetReceiptIssueReportQuerySchemaInput,
  GetReportsStatsQuerySchemaInput,
  GetTopProductsReportQuerySchemaInput,
} from "@wms/validations";
import { prisma } from "../lib/prisma";

interface DateRange {
  from: Date;
  to: Date;
}

function resolveRange(from?: string, to?: string): DateRange {
  const end = to ? new Date(to) : new Date();
  const start = from ? new Date(from) : new Date(end);
  if (!from) start.setDate(start.getDate() - 30);
  return { from: start, to: end };
}

function formatDateLabel(d: Date): string {
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

function formatDisplayDate(d: Date): string {
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

function trendFromRate(rate: number): "UP" | "DOWN" | "STABLE" {
  if (rate >= 70) return "UP";
  if (rate <= 30) return "DOWN";
  return "STABLE";
}

export async function getStats(
  query: GetReportsStatsQuerySchemaInput,
): Promise<ReportStatCard[]> {
  if (query.type === "inventory") {
    const data = await getInventory({ categoryId: query.categoryId, page: 1, limit: 1 });
    return [
      { label: "Tổng giá trị tồn", value: data.summary.totalValue },
      { label: "SKU hiện có", value: data.summary.skuCount },
      { label: "Đã hết hàng", value: data.summary.outOfStock },
      { label: "Tỉ lệ lấp đầy", value: data.summary.fillRate },
    ];
  }

  const data = await getReceiptIssue({
    from: query.from,
    to: query.to,
    page: 1,
    limit: 1,
  });
  return [
    { label: "Tổng nhập kho", value: data.summary.inboundAmount },
    { label: "Tổng xuất kho", value: data.summary.outboundAmount },
    {
      label: "Biến động ròng",
      value: data.summary.inboundAmount - data.summary.outboundAmount,
    },
    {
      label: "Số lượng phiếu",
      value: data.summary.totalInbound + data.summary.totalOutbound,
    },
  ];
}

export async function getReceiptIssue(
  query: GetReceiptIssueReportQuerySchemaInput,
): Promise<ReceiptIssueReportData> {
  const range = resolveRange(query.from, query.to);
  const skip = (query.page - 1) * query.limit;

  const [receiptAgg, issueAgg, chartRows, itemRows] = await Promise.all([
    prisma.goodsReceipt.aggregate({
      _count: true,
      _sum: { totalAmount: true },
      where: {
        status: "APPROVED",
        createdAt: { gte: range.from, lte: range.to },
        ...(query.supplierId && { supplierId: query.supplierId }),
      },
    }),
    prisma.goodsIssue.aggregate({
      _count: true,
      _sum: { totalAmount: true },
      where: {
        status: "APPROVED",
        createdAt: { gte: range.from, lte: range.to },
        ...(query.recipientId && { recipientId: query.recipientId }),
      },
    }),
    prisma.$queryRaw<{ bucket: Date; inbound: number; outbound: number }[]>`
      SELECT bucket,
        COALESCE(SUM(inbound), 0)::int AS inbound,
        COALESCE(SUM(outbound), 0)::int AS outbound
      FROM (
        SELECT DATE_TRUNC('day', gr."createdAt") AS bucket, COUNT(*)::int AS inbound, 0::int AS outbound
        FROM goods_receipts gr
        WHERE gr.status = 'APPROVED' AND gr."createdAt" BETWEEN ${range.from} AND ${range.to}
        GROUP BY bucket
        UNION ALL
        SELECT DATE_TRUNC('day', gi."createdAt") AS bucket, 0::int AS inbound, COUNT(*)::int AS outbound
        FROM goods_issues gi
        WHERE gi.status = 'APPROVED' AND gi."createdAt" BETWEEN ${range.from} AND ${range.to}
        GROUP BY bucket
      ) t
      GROUP BY bucket
      ORDER BY bucket ASC
    `,
    prisma.$queryRaw<
      { id: string; createdAt: Date; type: string; code: string; item: string; qty: number; value: number }[]
    >`
      SELECT * FROM (
        SELECT gri.id, gr."createdAt", 'NHẬP' AS type, gr.code, p.name AS item,
          gri.quantity::int AS qty, gri."totalPrice"::float AS value
        FROM goods_receipt_items gri
        JOIN goods_receipts gr ON gr.id = gri."goodsReceiptId"
        JOIN products p ON p.id = gri."productId"
        WHERE gr.status = 'APPROVED' AND gr."createdAt" BETWEEN ${range.from} AND ${range.to}
          ${query.supplierId ? Prisma.sql`AND gr."supplierId" = ${query.supplierId}` : Prisma.empty}
        UNION ALL
        SELECT gii.id, gi."createdAt", 'XUẤT' AS type, gi.code, p.name AS item,
          gii.quantity::int AS qty, gii."totalPrice"::float AS value
        FROM goods_issue_items gii
        JOIN goods_issues gi ON gi.id = gii."goodsIssueId"
        JOIN products p ON p.id = gii."productId"
        WHERE gi.status = 'APPROVED' AND gi."createdAt" BETWEEN ${range.from} AND ${range.to}
          ${query.recipientId ? Prisma.sql`AND gi."recipientId" = ${query.recipientId}` : Prisma.empty}
      ) t
      ORDER BY "createdAt" DESC
      LIMIT ${query.limit} OFFSET ${skip}
    `,
  ]);

  const chart: ReceiptIssueChartPoint[] = chartRows.map((r) => {
    const date = new Date(r.bucket);
    return {
      date: date.toISOString(),
      label: formatDateLabel(date),
      inbound: Number(r.inbound),
      outbound: Number(r.outbound),
    };
  });

  const items: ReceiptIssueReportItem[] = itemRows.map((r) => ({
    id: r.id,
    date: formatDisplayDate(new Date(r.createdAt)),
    type: r.type === "NHẬP" ? "NHẬP" : "XUẤT",
    code: r.code,
    item: r.item,
    qty: Number(r.qty),
    value: Number(r.value),
  }));

  return {
    summary: {
      totalInbound: receiptAgg._count,
      totalOutbound: issueAgg._count,
      inboundAmount: Number(receiptAgg._sum.totalAmount ?? 0),
      outboundAmount: Number(issueAgg._sum.totalAmount ?? 0),
    },
    chart,
    items,
  };
}

export async function getInventory(
  query: GetInventoryReportQuerySchemaInput,
): Promise<InventoryReportData> {
  const skip = (query.page - 1) * query.limit;
  const where = {
    isActive: true,
    ...(query.categoryId && { categoryId: query.categoryId }),
  };

  const [products, totalProducts, outOfStock, valueRows, chartRows] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: query.limit,
      include: { category: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where }),
    prisma.product.count({ where: { ...where, currentStock: { lte: 0 } } }),
    prisma.$queryRaw<{ value: number }[]>`
      SELECT COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0)::float AS value
      FROM products p
      WHERE p."isActive" = true
        ${query.categoryId ? Prisma.sql`AND p."categoryId" = ${query.categoryId}` : Prisma.empty}
    `,
    prisma.$queryRaw<{ name: string; value: number }[]>`
      SELECT c.name, COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0)::float AS value
      FROM categories c
      LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
      WHERE c."isActive" = true
        ${query.categoryId ? Prisma.sql`AND c.id = ${query.categoryId}` : Prisma.empty}
      GROUP BY c.id, c.name
      HAVING COALESCE(SUM(p."currentStock" * COALESCE(p."costPrice", 0)), 0) > 0
      ORDER BY value DESC
    `,
  ]);

  const items: InventoryReportItem[] = products.map((p) => {
    const avgPrice = Number(p.costPrice ?? 0);
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category.name,
      stock: p.currentStock,
      unit: p.unit,
      avgPrice,
      totalValue: p.currentStock * avgPrice,
    };
  });

  return {
    summary: {
      totalValue: Number(valueRows[0]?.value ?? 0),
      skuCount: totalProducts,
      outOfStock,
      fillRate: totalProducts ? Math.round(((totalProducts - outOfStock) / totalProducts) * 100) : 0,
    },
    chart: chartRows.map((r) => ({ name: r.name, value: Number(r.value) })),
    items,
  };
}

export async function getTopProducts(
  query: GetTopProductsReportQuerySchemaInput,
): Promise<TopProductsReportData> {
  const range = resolveRange(query.from, query.to);
  const rows = await prisma.$queryRaw<
    {
      productId: string;
      sku: string;
      name: string;
      category: string;
      inboundQty: number;
      outboundQty: number;
      stock: number;
    }[]
  >`
    SELECT p.id AS "productId", p.sku, p.name, c.name AS category,
      COALESCE(SUM(CASE WHEN sh.type = 'IN' THEN sh.quantity ELSE 0 END), 0)::int AS "inboundQty",
      COALESCE(SUM(CASE WHEN sh.type = 'OUT' THEN sh.quantity ELSE 0 END), 0)::int AS "outboundQty",
      p."currentStock"::int AS stock
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    LEFT JOIN stock_histories sh ON sh."productId" = p.id
      AND sh."createdAt" BETWEEN ${range.from} AND ${range.to}
      AND sh.type IN ('IN', 'OUT')
    WHERE p."isActive" = true
    GROUP BY p.id, p.sku, p.name, c.name, p."currentStock"
    ORDER BY ${query.type === "OUT" ? Prisma.sql`"outboundQty"` : Prisma.sql`"inboundQty"`} DESC
    LIMIT ${query.limit}
  `;

  const items: TopProductsReportItem[] = rows.map((r, index) => {
    const inboundQty = Number(r.inboundQty);
    const outboundQty = Number(r.outboundQty);
    const turnoverRate = inboundQty > 0 ? Math.round((outboundQty / inboundQty) * 100) : 0;
    return {
      rank: index + 1,
      productId: r.productId,
      sku: r.sku,
      name: r.name,
      category: r.category,
      inboundQty,
      outboundQty,
      turnoverRate,
      stock: Number(r.stock),
      trend: trendFromRate(turnoverRate),
    };
  });

  const averageTurnoverRate = items.length
    ? Math.round(items.reduce((sum, item) => sum + item.turnoverRate, 0) / items.length)
    : 0;

  return {
    summary: {
      analyzedProducts: items.length,
      highTurnover: items.filter((item) => item.turnoverRate >= 70).length,
      lowTurnover: items.filter((item) => item.turnoverRate <= 30).length,
      averageTurnoverRate,
    },
    items,
  };
}
