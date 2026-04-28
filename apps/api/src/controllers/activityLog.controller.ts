import type { Request, Response, NextFunction } from 'express'
import * as service from '../services/activityLog.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getActivityLogs(req.query as never)
    res.json({ success: true, data: result.data, meta: result.meta })
  } catch (error) {
    next(error)
  }
}
