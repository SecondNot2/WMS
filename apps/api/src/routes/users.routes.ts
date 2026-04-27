import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import {
  createUserSchema,
  getUsersQuerySchema,
  toggleUserActiveSchema,
  updateUserSchema,
} from '@wms/validations'
import * as ctrl from '../controllers/users.controller'

const router = Router()

router.use(authenticate, authorize(['ADMIN']))

router.get('/', validate(getUsersQuerySchema, 'query'), ctrl.getAll)
router.post('/', validate(createUserSchema), ctrl.create)
router.get('/:id', ctrl.getById)
router.patch('/:id', validate(updateUserSchema), ctrl.update)
router.patch(
  '/:id/toggle-active',
  validate(toggleUserActiveSchema),
  ctrl.toggleActive,
)
router.delete('/:id', ctrl.remove)

export default router
