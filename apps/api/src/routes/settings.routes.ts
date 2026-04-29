import { Router, type RequestHandler } from 'express'
import {
  settingsKeyParamsSchema,
  updateAlertSettingsSchema,
  updateGeneralSettingsSchema,
  updateIntegrationSettingsSchema,
  updateSecuritySettingsSchema,
  type SettingsKeyInput,
} from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/settings.controller'

const router = Router()

router.use(authenticate)

// Chọn schema body validate theo :key
const validateBodyByKey: RequestHandler = (req, _res, next) => {
  const key = req.params.key as SettingsKeyInput
  const schema = {
    general: updateGeneralSettingsSchema,
    alerts: updateAlertSettingsSchema,
    security: updateSecuritySettingsSchema,
    integrations: updateIntegrationSettingsSchema,
  }[key]
  if (!schema) return next()
  const result = schema.safeParse(req.body)
  if (!result.success) return next(result.error)
  req.body = result.data
  next()
}

router.get(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  ctrl.getAll,
)

router.post('/reset', authorize(['ADMIN']), ctrl.reset)

router.get(
  '/:key',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(settingsKeyParamsSchema, 'params'),
  ctrl.getByKey,
)

router.patch(
  '/:key',
  authorize(['ADMIN']),
  validate(settingsKeyParamsSchema, 'params'),
  validateBodyByKey,
  ctrl.update,
)

export default router
