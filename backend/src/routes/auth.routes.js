import express from "express";
import { registerController } from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.Controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { refreshController } from "../controllers/auth/refresh.Controller.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.controller.js";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller.js";
import { setPasswordController } from "../controllers/auth/setPassword.controller.js";
import { registerUserController } from "../controllers/auth/registerUser.controller.js";
import { setupPassword, validateSetupToken } from "../controllers/auth/setupPassword.controller.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import { loginLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";
import { loginValidationRules, registerValidation, validate } from "../middleware/validate.js";
import { body } from "express-validator";

const router = express.Router();


/* =====================
   Public routes
===================== */

// Login
router.post(
  "/login",
  // loginLimiter,
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

// Setup password (for new users)
router.post(
  "/setup-password",
  sanitizeInput,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('user_id').isUUID().withMessage('Valid user ID is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    validate
  ],
  setupPassword
);

// Validate setup token (optional pre-validation)
router.post(
  "/validate-setup-token",
  sanitizeInput,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('user_id').isUUID().withMessage('Valid user ID is required'),
    validate
  ],
  validateSetupToken
);

/* =====================
   Protected routes
===================== */

// Register route - NO auth limiter for testing
router.post(
  "/register",
  authMiddleware,        // must be logged in
  sanitizeInput,
  registerValidation,    // input validation
  registerController     // role logic inside controller
);



// Logout
router.post("/logout", authMiddleware, logoutController);

// Set password (admin only)
router.post(
  "/set-password",
  authMiddleware,
  sanitizeInput,
  setPasswordController
);

// Register user (school admin only)
router.post(
  "/register-user",
  authMiddleware,
  sanitizeInput,
  registerUserController
);

export default router;
