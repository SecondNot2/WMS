import { Router } from 'express'
import multer from 'multer'
import {
  categoryIdParamsSchema,
  createCategorySchema,
  getCategoriesQuerySchema,
  updateCategorySchema,
} from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/categories.controller'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.use(authenticate)

router.get(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(getCategoriesQuerySchema, 'query'),
  ctrl.getAll,
)
router.post(
  '/',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  validate(createCategorySchema),
  ctrl.create,
)
router.post(
  '/import',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  upload.single('file'),
  ctrl.importCategories,
)
router.get(
  '/:id',
  authorize(['ADMIN', 'WAREHOUSE_STAFF', 'ACCOUNTANT']),
  validate(categoryIdParamsSchema, 'params'),
  ctrl.getById,
)
router.patch(
  '/:id',
  authorize(['ADMIN', 'WAREHOUSE_STAFF']),
  validate(categoryIdParamsSchema, 'params'),
  validate(updateCategorySchema),
  ctrl.update,
)
router.delete(
  '/:id',
  authorize(['ADMIN']),
  validate(categoryIdParamsSchema, 'params'),
  ctrl.remove,
)

export default router
