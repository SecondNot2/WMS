import type { Request, Response, NextFunction } from 'express'
import * as service from '../services/users.service'
import { AppError } from '../lib/errors'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getUsers(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await service.getUserById(req.params.id)
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await service.createUser(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const user = await service.updateUser(req.params.id, req.body, req.user.id)
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const toggleActive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const user = await service.toggleUserActive(
      req.params.id,
      req.body.isActive,
      req.user.id,
    )
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    await service.deleteUser(req.params.id, req.user.id)
    res.json({ success: true, data: { message: 'Đã xóa người dùng' } })
  } catch (error) {
    next(error)
  }
}
