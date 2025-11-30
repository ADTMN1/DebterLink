import express from "express";
import { registerController } from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { refreshController } from "../controllers/auth/refresh.controller.js";
import { authMiddleware } from "../middleware/auth.middlewares.js";

const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);

// Protected route
// i found it it's best to protect logout route with auth middleware
//interesting part will figure it out later
router.post("/logout", authMiddleware, logoutController);

export default router;
