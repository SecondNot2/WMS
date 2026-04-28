import { Router } from 'express'
import {
  adjustStockSchema,
  getInventoryQuerySchema,
  inventoryProductIdParamsSchema,
} from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/inventory.controller'

const router = Router()

router.use(authenticate)

router.get(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(getInventoryQuerySchema, 'query'),
  ctrl.getAll,
)

router.get(
  '/summary',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  ctrl.getSummary,
)

router.post(
  '/:productId/adjust',
  authorize(['ADMIN']),
  validate(inventoryProductIdParamsSchema, 'params'),
  validate(adjustStockSchema),
  ctrl.adjustStock,
)

export default router
