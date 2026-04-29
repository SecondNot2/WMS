import type { RequestHandler } from 'express'
import { AppError } from '../lib/errors'
import { verifyAccessToken } from '../lib/jwt'

export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    }
    const token = header.slice('Bearer '.length).trim()
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, role: payload.role }
    next()
  } catch (err) {
    if (err instanceof AppError) return next(err)
    next(new AppError('UNAUTHORIZED', 'Token không hợp lệ hoặc đã hết hạn'))
  }
}
