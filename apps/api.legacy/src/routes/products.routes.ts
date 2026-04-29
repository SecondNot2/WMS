import { Router } from 'express'
import multer from 'multer'
import {
  adjustStockSchema,
  createProductSchema,
  getProductsQuerySchema,
  productIdParamsSchema,
  updateProductSchema,
} from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/products.controller'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.use(authenticate)

router.get(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(getProductsQuerySchema, 'query'),
  ctrl.getAll,
)
router.post(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  validate(createProductSchema),
  ctrl.create,
)
router.post(
  '/import',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  upload.single('file'),
  ctrl.importProducts,
)
router.get(
  '/:id',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(productIdParamsSchema, 'params'),
  ctrl.getById,
)
router.patch(
  '/:id',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  validate(productIdParamsSchema, 'params'),
  validate(updateProductSchema),
  ctrl.update,
)
router.delete(
  '/:id',
  authorize(['ADMIN']),
  validate(productIdParamsSchema, 'params'),
  ctrl.remove,
)
router.get(
  '/:id/stock-history',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(productIdParamsSchema, 'params'),
  ctrl.getStockHistory,
)
router.post(
  '/:id/adjust-stock',
  authorize(['ADMIN']),
  validate(productIdParamsSchema, 'params'),
  validate(adjustStockSchema),
  ctrl.adjustStock,
)

export default router
