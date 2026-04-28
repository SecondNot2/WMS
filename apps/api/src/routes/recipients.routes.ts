import { Router } from "express";
import {
  createRecipientSchema,
  getRecipientsQuerySchema,
  recipientIdParamsSchema,
  updateRecipientSchema,
} from "@wms/validations";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/recipients.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(getRecipientsQuerySchema, "query"),
  ctrl.getAll,
);
router.post(
  "/",
  authorize(["ADMIN", "WAREHOUSE_STAFF"]),
  validate(createRecipientSchema),
  ctrl.create,
);
router.get(
  "/:id",
  authorize(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
  validate(recipientIdParamsSchema, "params"),
  ctrl.getById,
);
router.patch(
  "/:id",
  authorize(["ADMIN", "WAREHOUSE_STAFF"]),
  validate(recipientIdParamsSchema, "params"),
  validate(updateRecipientSchema),
  ctrl.update,
);
router.delete(
  "/:id",
  authorize(["ADMIN"]),
  validate(recipientIdParamsSchema, "params"),
  ctrl.remove,
);

export default router;
