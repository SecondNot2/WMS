import { Router } from "express";
import {
  createInboundSchema,
  getInboundsQuerySchema,
  inboundIdParamsSchema,
  rejectInboundSchema,
  updateInboundSchema,
} from "@wms/validations";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/inbound.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(getInboundsQuerySchema, "query"),
  ctrl.getAll,
);
router.get(
  "/stats",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  ctrl.getStats,
);
router.get(
  "/export",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(getInboundsQuerySchema, "query"),
  ctrl.exportExcel,
);
router.post(
  "/",
  authorize(["ADMIN", "WAREHOUSE_STAFF"]),
  validate(createInboundSchema),
  ctrl.create,
);
router.get(
  "/:id",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(inboundIdParamsSchema, "params"),
  ctrl.getById,
);
router.patch(
  "/:id",
  authorize(["ADMIN", "WAREHOUSE_STAFF"]),
  validate(inboundIdParamsSchema, "params"),
  validate(updateInboundSchema),
  ctrl.update,
);
router.delete(
  "/:id",
  authorize(["ADMIN"]),
  validate(inboundIdParamsSchema, "params"),
  ctrl.remove,
);
router.post(
  "/:id/approve",
  authorize(["ADMIN"]),
  validate(inboundIdParamsSchema, "params"),
  ctrl.approve,
);
router.post(
  "/:id/reject",
  authorize(["ADMIN"]),
  validate(inboundIdParamsSchema, "params"),
  validate(rejectInboundSchema),
  ctrl.reject,
);

export default router;
