import express from "express";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "../src/routes/student.attendance.routes.js";
import { authMiddleware, verifyRole } from "./middleware/auth.middleware.js";
import assignmentRoutes from "../src/routes/assigment.route.js";

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
router.use("/student", authMiddleware, verifyRole(3), (req, res) =>
  res.send("student route")
);

// Attendance – Teacher only
router.use("/attendance", authMiddleware, verifyRole(2), attendanceRoutes);

// Assignment Module Routes
router.use("/assignment", assignmentRoutes); 

export default router;
