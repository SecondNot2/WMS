import { Router } from 'express'
import {
  createSupplierSchema,
  getSuppliersQuerySchema,
  supplierIdParamsSchema,
  updateSupplierSchema,
} from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/suppliers.controller'

const router = Router()

router.use(authenticate)

router.get(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(getSuppliersQuerySchema, 'query'),
  ctrl.getAll,
)
router.post(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  validate(createSupplierSchema),
  ctrl.create,
)
router.get(
  '/:id',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(supplierIdParamsSchema, 'params'),
  ctrl.getById,
)
router.patch(
  '/:id',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  validate(supplierIdParamsSchema, 'params'),
  validate(updateSupplierSchema),
  ctrl.update,
)
router.delete(
  '/:id',
  authorize(['ADMIN']),
  validate(supplierIdParamsSchema, 'params'),
  ctrl.remove,
)

export default router
