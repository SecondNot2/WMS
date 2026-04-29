import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import * as service from '../services/inventory.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getInventory(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}

export const getSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary = await service.getInventorySummary()
    res.json({ success: true, data: summary })
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
    const item = await service.adjustInventoryStock(
      req.params.productId,
      req.body,
      req.user.id,
    )
    res.json({ success: true, data: item })
  } catch (error) {
    next(error)
  }
}
