import type { Request, Response, NextFunction } from 'express'
import * as service from '../services/roles.service'

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getRoles()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getRoleById(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createRole(req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.updateRole(req.params.id, req.body)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteRole(req.params.id)
    res.json({ success: true, data: { message: 'Đã xóa vai trò' } })
  } catch (error) {
    next(error)
  }
}
