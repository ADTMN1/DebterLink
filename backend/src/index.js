import express from "express";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoute from "../src/routes/student.attendance.route.js"; 
import { authMiddleware, verifyRole } from "./middleware/auth.middleware.js";

const router = express.Router();

// Public/auth routes
router.use("/auth", authRoutes);

// Role-based routes
router.use("/super-admin", authMiddleware, verifyRole(), (req, res) =>
  res.send("SUPER ADMIN route")
);
router.use("/director", authMiddleware, verifyRole(1), (req, res) =>
  res.send("DIRECTOR route")
);
router.use("/admin", authMiddleware, verifyRole(5), (req, res) =>
  res.send("admin route")
);
router.use("/parent", authMiddleware, verifyRole(3), (req, res) =>
  res.send("parent route")
);
router.use("/teacher", authMiddleware, verifyRole(2), (req, res) =>
  res.send("teacher route")
);
router.use("/student", authMiddleware, verifyRole(4), (req, res) =>
  res.send("student route")
);

// Attendance routes
 
router.use("/attendance/student", attendanceRoute);


export default router;
