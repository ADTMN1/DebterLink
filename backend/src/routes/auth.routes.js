import express from "express";
import { registerController } from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.Controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { refreshController } from "../controllers/auth/refresh.Controller.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.controller.js";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import { loginLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";
import { loginValidationRules, registerValidation, validate } from "../middleware/validate.js";

const router = express.Router();

/* =====================
   Public routes
===================== */

// Login
router.post(
  "/login",
  loginLimiter,
  sanitizeInput,
  loginValidationRules,
  validate,
  loginController
);

// Refresh token
router.post("/refresh", refreshController);

// Forgot password
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  sanitizeInput,
  forgotPasswordController
);

// Reset password
router.post(
  "/reset-password",
  sanitizeInput,
  resetPasswordController
);

/* =====================
   Protected routes
===================== */

// ONE register route
router.post(
  "/register",
    authMiddleware,        
  sanitizeInput,
  registerValidation,    // input validation
  registerController     // role logic inside controller
);



// Logout
router.post("/logout", authMiddleware, logoutController);

export default router;
