import type { Request, Response, NextFunction } from 'express'
import * as service from '../services/auth.service'
import { AppError } from '../lib/errors'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.login(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.refresh(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Stateless JWT — client tự xóa token. Endpoint chỉ để FE gọi cho đúng quy trình.
    res.json({ success: true, data: { message: 'Đã đăng xuất' } })
  } catch (error) {
    next(error)
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const user = await service.getMe(req.user.id)
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    await service.changePassword(req.user.id, req.body)
    res.json({ success: true, data: { message: 'Đổi mật khẩu thành công' } })
  } catch (error) {
    next(error)
  }
}
