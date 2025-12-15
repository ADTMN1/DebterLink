import express from "express";
import {registerController} from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.Controller.js"; 
import { logoutController } from "../controllers/auth/logout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; 
import { verifyRole } from "../middleware/auth.middleware.js";
import { refreshController } from "../controllers/auth/refresh.Controller.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.controller.js";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller.js";

const router = express.Router();

// Public routes

router.post("/login", loginController);
router.post("/refresh", refreshController);  
// Protected route
router.post("/register",registerController);
router.post("/logout", authMiddleware, logoutController);
// Password reset routes
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
