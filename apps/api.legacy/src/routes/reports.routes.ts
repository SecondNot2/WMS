import { Router } from "express";
import {
  getInventoryReportQuerySchema,
  getReceiptIssueReportQuerySchema,
  getReportsStatsQuerySchema,
  getTopProductsReportQuerySchema,
  exportReportQuerySchema,
} from "@wms/validations";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/reports.controller";

const router = Router();

router.use(authenticate);

const allRoles = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] as const;

router.get(
  "/stats",
  authorize([...allRoles]),
  validate(getReportsStatsQuerySchema, "query"),
  ctrl.getStats,
);

router.get(
  "/export",
  authorize([...allRoles]),
  validate(exportReportQuerySchema, "query"),
  ctrl.exportExcel,
);

router.get(
  "/inventory",
  authorize([...allRoles]),
  validate(getInventoryReportQuerySchema, "query"),
  ctrl.getInventory,
);

router.get(
  "/receipt-issue",
  authorize([...allRoles]),
  validate(getReceiptIssueReportQuerySchema, "query"),
  ctrl.getReceiptIssue,
);

router.get(
  "/top-products",
  authorize([...allRoles]),
  validate(getTopProductsReportQuerySchema, "query"),
  ctrl.getTopProducts,
);

export default router;
