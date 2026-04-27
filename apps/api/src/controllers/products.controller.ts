import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import * as service from '../services/products.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getProducts(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await service.getProductById(req.params.id)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await service.createProduct(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await service.updateProduct(req.params.id, req.body)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteProduct(req.params.id)
    res.json({ success: true, data: { message: 'Đã xóa sản phẩm' } })
  } catch (error) {
    next(error)
  }
}

export const getStockHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await service.getProductStockHistory(req.params.id)
    res.json({ success: true, data: history })
  } catch (error) {
    next(error)
  }
}

export const adjustStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const product = await service.adjustStock(req.params.id, req.body, req.user.id)
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const importProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) throw new AppError('VALIDATION_ERROR', 'Vui lòng chọn file Excel')
    const result = await service.importProducts(req.file.buffer)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
