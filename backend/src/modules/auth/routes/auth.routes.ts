import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema
} from "../validators/auth.validator.js";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), (req, res, next) =>
  controller.register(req, res, next)
);

router.post("/login", validate(loginSchema), (req, res, next) =>
  controller.login(req, res, next)
);

router.post("/google", (req, res, next) =>
  controller.googleAuth(req, res, next)
);

router.post("/verify-email", validate(verifyEmailSchema), (req, res, next) =>
  controller.verifyEmail(req, res, next)
);

router.post("/resend-verification", validate(resendVerificationSchema), (req, res, next) =>
  controller.resendVerification(req, res, next)
);

router.post("/refresh", (req, res, next) =>
  controller.refresh(req, res, next)
);

router.post("/logout", protect, (req, res, next) =>
  controller.logout(req, res, next)
);

router.get("/me", protect, (req, res, next) =>
  controller.me(req, res, next)
);

export default router;
export { router as authRoutes };
