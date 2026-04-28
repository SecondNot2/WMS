import { Router } from "express";
import { getStatisticsQuerySchema } from "@wms/validations";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/statistics.controller";

const router = Router();

router.use(authenticate);

const allRoles = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] as const;

router.get(
  "/efficiency",
  authorize([...allRoles]),
  validate(getStatisticsQuerySchema, "query"),
  ctrl.getEfficiency,
);

router.get(
  "/export",
  authorize([...allRoles]),
  validate(getStatisticsQuerySchema, "query"),
  ctrl.exportExcel,
);

router.get(
  "/performance",
  authorize([...allRoles]),
  validate(getStatisticsQuerySchema, "query"),
  ctrl.getPerformance,
);

export default router;
