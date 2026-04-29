import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import * as service from '../services/suppliers.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getSuppliers(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supplier = await service.getSupplierById(req.params.id)
    res.json({ success: true, data: supplier })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const supplier = await service.createSupplier(req.body, req.user.id)
    res.status(201).json({ success: true, data: supplier })
  } catch (error) {
    next(error)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const supplier = await service.updateSupplier(req.params.id, req.body, req.user.id)
    res.json({ success: true, data: supplier })
  } catch (error) {
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    await service.deleteSupplier(req.params.id, req.user.id)
    res.json({ success: true, data: { message: 'Đã xóa nhà cung cấp' } })
  } catch (error) {
    next(error)
  }
}
