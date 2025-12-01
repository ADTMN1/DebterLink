import express from "express";
import registerController from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.Controller.js"; 
import { logoutController } from "../controllers/auth/logout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; 
import { refreshController } from "../controllers/auth/refresh.Controller.js";


const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);  
// Protected route
router.post("/logout", authMiddleware, logoutController);

export default router;
