import type { Request, Response, NextFunction } from 'express'
import type { SettingsKeyInput } from '@wms/validations'
import { AppError } from '../lib/errors'
import * as service from '../services/settings.service'

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await service.getAllSettings()
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getByKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const key = req.params.key as SettingsKeyInput
    const data = await service.getSettingsByKey(key)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const key = req.params.key as SettingsKeyInput
    const data = await service.updateSettings(key, req.body, req.user.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const reset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Chưa đăng nhập')
    const data = await service.resetSettings(req.user.id)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
