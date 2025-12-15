import express from "express";
import { registerController } from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.Controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { authMiddleware, verifyRole } from "../middleware/auth.middleware.js";
import { refreshController } from "../controllers/auth/refresh.Controller.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.controller.js";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import { loginValidationRules, validate } from "../middleware/validate.js";
import { loginLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes
router.post(
  "/login",
  loginLimiter,
  sanitizeInput,
  loginValidationRules,
  validate,
  loginController
);

router.post("/refresh", refreshController);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  sanitizeInput,
  forgotPasswordController
);

router.post(
  "/reset-password",
  sanitizeInput,
  resetPasswordController
);

// Protected routes
router.post(
  "/register",
  authMiddleware,
  verifyRole(5), // only admin can register new users
  sanitizeInput,
  registerController
);

router.post("/logout", authMiddleware, logoutController);

export default router;
