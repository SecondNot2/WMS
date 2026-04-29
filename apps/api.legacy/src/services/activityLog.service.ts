import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { GetActivityLogsQuerySchemaInput } from '@wms/validations'

const activityLogSelect = {
  id: true,
  userId: true,
  action: true,
  targetType: true,
  targetId: true,
  targetCode: true,
  detail: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ActivityLogSelect

export async function getActivityLogs(query: GetActivityLogsQuerySchemaInput) {
  const { page, limit, search, userId, action, targetType, from, to } = query

  const createdAt: Prisma.DateTimeFilter | undefined =
    from || to
      ? {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        }
      : undefined

  const where: Prisma.ActivityLogWhereInput = {
    ...(userId && { userId }),
    ...(action && { action: { contains: action, mode: 'insensitive' } }),
    ...(targetType && { targetType }),
    ...(createdAt && { createdAt }),
    ...(search && {
      OR: [
        { action: { contains: search, mode: 'insensitive' } },
        { targetType: { contains: search, mode: 'insensitive' } },
        { targetCode: { contains: search, mode: 'insensitive' } },
        { detail: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: activityLogSelect,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.activityLog.count({ where }),
  ])

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  }
}
