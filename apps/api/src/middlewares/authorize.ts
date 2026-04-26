import type { RequestHandler } from 'express'
import { AppError } from '../lib/errors'

export const authorize =
  (allowedRoles: string[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new AppError('UNAUTHORIZED', 'Chưa đăng nhập'))
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('FORBIDDEN', 'Không có quyền thực hiện thao tác này'))
    }
    next()
  }
