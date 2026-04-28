import { Router } from 'express'
import { getActivityLogsQuerySchema } from '@wms/validations'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import * as ctrl from '../controllers/activityLog.controller'

const router = Router()

router.use(authenticate, authorize(['ADMIN']))

router.get('/', validate(getActivityLogsQuerySchema, 'query'), ctrl.getAll)

export default router
