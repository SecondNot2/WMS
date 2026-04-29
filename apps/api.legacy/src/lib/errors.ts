export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INSUFFICIENT_STOCK'
  | 'INTERNAL_ERROR'

const DEFAULT_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  CONFLICT: 409,
  INSUFFICIENT_STOCK: 400,
  INTERNAL_ERROR: 500,
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number

  constructor(code: ErrorCode, message: string, statusCode?: number) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode ?? DEFAULT_STATUS[code]
  }
}
