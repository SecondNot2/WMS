import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import { createRoleSchema, updateRoleSchema } from '@wms/validations'
import * as ctrl from '../controllers/roles.controller'

const router = Router()

router.use(authenticate, authorize(['ADMIN']))

router.get('/', ctrl.getAll)
router.post('/', validate(createRoleSchema), ctrl.create)
router.get('/:id', ctrl.getById)
router.patch('/:id', validate(updateRoleSchema), ctrl.update)
router.delete('/:id', ctrl.remove)

export default router
