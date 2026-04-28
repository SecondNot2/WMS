import { Router } from "express";
import {
  createOutboundSchema,
  getOutboundsQuerySchema,
  outboundIdParamsSchema,
  rejectOutboundSchema,
  updateOutboundSchema,
} from "@wms/validations";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/outbound.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(getOutboundsQuerySchema, "query"),
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
  validate(getOutboundsQuerySchema, "query"),
  ctrl.exportExcel,
);
router.post(
  "/",
  authorize(["ADMIN", "WAREHOUSE_STAFF"]),
  validate(createOutboundSchema),
  ctrl.create,
);
router.get(
  "/:id",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(outboundIdParamsSchema, "params"),
  ctrl.getById,
);
router.patch(
  "/:id",
  authorize(["ADMIN", "WAREHOUSE_STAFF"]),
  validate(outboundIdParamsSchema, "params"),
  validate(updateOutboundSchema),
  ctrl.update,
);
router.delete(
  "/:id",
  authorize(["ADMIN"]),
  validate(outboundIdParamsSchema, "params"),
  ctrl.remove,
);
router.post(
  "/:id/approve",
  authorize(["ADMIN"]),
  validate(outboundIdParamsSchema, "params"),
  ctrl.approve,
);
router.post(
  "/:id/reject",
  authorize(["ADMIN"]),
  validate(outboundIdParamsSchema, "params"),
  validate(rejectOutboundSchema),
  ctrl.reject,
);

export default router;
