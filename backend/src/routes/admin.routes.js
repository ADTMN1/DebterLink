import express from "express";
import { authMiddleware, verifyRole } from "../middleware/auth.middleware.js";
import { getAllUsers, deleteUser } from "../controllers/auth/admin.controller.js";

const router = express.Router();

// Apply authentication & admin role check to all admin routes
router.use(authMiddleware, verifyRole(5)); // 5 = admin role_id

// Example routes
router.get("/users", getAllUsers);              // GET /admin/users
router.delete("/user/:id", deleteUser);        // DELETE /admin/user/:id

export default router; // ✅ default export
