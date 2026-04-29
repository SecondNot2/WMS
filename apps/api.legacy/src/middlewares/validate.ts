import type { RequestHandler } from 'express'
import { ZodSchema } from 'zod'

export const validate =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) return next(result.error)
    // Ghi đè dữ liệu đã parse (đã transform/coerce)
    ;(req as unknown as Record<string, unknown>)[source] = result.data
    next()
  }
