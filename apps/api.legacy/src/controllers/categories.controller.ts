import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'
import * as service from '../services/categories.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getCategories(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.getCategoryById(req.params.id)
    res.json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.createCategory(req.body)
    res.status(201).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.updateCategory(req.params.id, req.body)
    res.json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteCategory(req.params.id)
    res.json({ success: true, data: { message: 'Đã xóa danh mục' } })
  } catch (error) {
    next(error)
  }
}

export const importCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file)
      throw new AppError('VALIDATION_ERROR', 'Vui lòng chọn file Excel')
    const result = await service.importCategories(req.file.buffer)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
