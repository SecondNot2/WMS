import type { Request, Response, NextFunction } from 'express'
import * as service from '../services/alerts.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getAlerts(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await service.getAlertStats()
    res.json({ success: true, data: stats })
  } catch (error) {
    next(error)
  }
}
