import { Prisma } from '@prisma/client'
import type { Alert, AlertLevel, AlertStatsData } from '@wms/types'
import type { GetAlertsQuerySchemaInput } from '@wms/validations'
import { prisma } from '../lib/prisma'

const alertProductSelect = {
  id: true,
  sku: true,
  name: true,
  currentStock: true,
  minStock: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
} satisfies Prisma.ProductSelect

type AlertProduct = Prisma.ProductGetPayload<{ select: typeof alertProductSelect }>

function getAlertLevel(product: Pick<AlertProduct, 'currentStock'>): AlertLevel {
  return product.currentStock <= 0 ? 'CRITICAL' : 'WARNING'
}

function toAlert(product: AlertProduct): Alert {
  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    currentStock: product.currentStock,
    minStock: product.minStock,
    level: getAlertLevel(product),
    lastUpdated: product.updatedAt.toISOString(),
  }
}

function buildAlertsWhere(query: GetAlertsQuerySchemaInput): Prisma.ProductWhereInput {
  const { search, categoryId, level } = query

  return {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(level === 'CRITICAL' && { currentStock: { lte: 0 } }),
    ...(level === 'WARNING' && {
      currentStock: { gt: 0, lte: prisma.product.fields.minStock },
    }),
    ...(!level && { currentStock: { lte: prisma.product.fields.minStock } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  }
}

export async function getAlerts(query: GetAlertsQuerySchemaInput) {
  const { page, limit } = query
  const where = buildAlertsWhere(query)

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: alertProductSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ currentStock: 'asc' }, { updatedAt: 'desc' }],
    }),
    prisma.product.count({ where }),
  ])

  return {
    data: products.map(toAlert),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  }
}

export async function getAlertStats(): Promise<AlertStatsData> {
  const lowStockWhere: Prisma.ProductWhereInput = {
    isActive: true,
    currentStock: { lte: prisma.product.fields.minStock },
  }

  const [criticalCount, warningCount, affectedCategories] = await Promise.all([
    prisma.product.count({
      where: { isActive: true, currentStock: { lte: 0 } },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        currentStock: { gt: 0, lte: prisma.product.fields.minStock },
      },
    }),
    prisma.product.findMany({
      where: lowStockWhere,
      distinct: ['categoryId'],
      select: { categoryId: true },
    }),
  ])

  return {
    totalAlerts: criticalCount + warningCount,
    criticalCount,
    warningCount,
    affectedCategories: affectedCategories.length,
  }
}
