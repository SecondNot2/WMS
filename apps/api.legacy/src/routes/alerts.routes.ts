import { Router } from 'express'
import { getAlertsQuerySchema } from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/alerts.controller'

const router = Router()

router.use(authenticate)

router.get(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(getAlertsQuerySchema, 'query'),
  ctrl.getAll,
)
router.get('/stats', authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']), ctrl.getStats)

export default router
