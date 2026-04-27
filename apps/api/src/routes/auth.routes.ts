import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from "@wms/validations";
import * as ctrl from "../controllers/auth.controller";

const router = Router();

router.post("/login", validate(loginSchema), ctrl.login);
router.post("/refresh", validate(refreshTokenSchema), ctrl.refresh);
router.post("/logout", authenticate, ctrl.logout);
router.get("/me", authenticate, ctrl.me);
router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  ctrl.changePassword,
);
router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  ctrl.updateProfile,
);

export default router;
