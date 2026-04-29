import { Prisma } from '@prisma/client'
import { prisma } from './prisma'
import { logger } from './logger'

export interface LogActivityInput {
  userId: string
  action: string
  targetType?: string | null
  targetId?: string | null
  targetCode?: string | null
  detail?: string | Record<string, unknown> | null
}

/**
 * Ghi nhật ký hoạt động. KHÔNG bao giờ throw — log ra Winston nếu lỗi.
 * Có thể truyền `tx` để dùng trong prisma.$transaction nếu cần atomic.
 */
export async function logActivity(
  input: LogActivityInput,
  tx?: Prisma.TransactionClient,
): Promise<void> {
  const client = tx ?? prisma
  try {
    await client.activityLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        targetCode: input.targetCode ?? null,
        detail:
          typeof input.detail === 'string'
            ? input.detail
            : input.detail
              ? JSON.stringify(input.detail)
              : null,
      },
    })
  } catch (err) {
    logger.warn(
      `[activityLog] failed action=${input.action} target=${input.targetType}:${input.targetId}: ${(err as Error).message}`,
    )
  }
}
