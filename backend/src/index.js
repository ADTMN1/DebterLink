// backend/src/index.js
import express from "express";
import { authMiddleware, verifyRole } from "./middleware/auth.middleware.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "./routes/student.attendance.routes.js";
import assignmentRoutes from "./routes/assigment.route.js";
import examRoutes from "./routes/examRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import appealRoutes from "./routes/appealRoutes.js";
import parentRoutes from "./routes/parent.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import classRoutes from "./routes/classRoutes.js";
// import directorRoutes from "./routes/"; 
import adminRoutes from "./routes/admin.routes.js";

const router = express.Router();

// ----------------------
// Public routes
// ----------------------
router.use("/auth", authRoutes);

// ----------------------
// Role-based routes
// ----------------------

// Super Admin routes (role_id = 6)
router.use(
  "/super-admin",
  authMiddleware,
  verifyRole(6),
  schoolRoutes
);

// Admin routes (role_id = 5)
router.use(
  "/admin",
//   authMiddleware,
//   verifyRole(5),
  adminRoutes
);

// Director routes (role_id = 1)
// router.use(
//   "/director",
//   authMiddleware,
//   verifyRole(1),
//   directorRoutes
// );

// Teacher routes (role_id = 2)
router.use(
  "/teacher",
  authMiddleware,
  verifyRole(2),
  examRoutes
);
router.use(
  "/attendance",
  authMiddleware,
  verifyRole(2),
  attendanceRoutes
);
router.use(
  "/assignment",
  authMiddleware,
  verifyRole(2),
  assignmentRoutes
);

// Assignment Module Routes
// router.use("/class", authMiddleware, verifyRole(4), classROutes);
router.use("/class", classROutes);
router.use("/assignment", assignmentRoutes); 
router.use("/super-admin",    authMiddleware,  verifyRole(6),schoolRoutes);
//// router.use("/super-admin",    schoolRoutes);
router.use("/director",  authMiddleware,  verifyRole(1) , (req, res) => res.send("DIRECTOR route"));
router.use("/admin",  authMiddleware,  verifyRole(5) , (req, res) => res.send("admin route"));
router.use("/parent",  authMiddleware,  verifyRole(3) , parentRoutes);
// router.use("/parent",   parentRoutes)
router.use("/teacher",  authMiddleware,  verifyRole(2) , examROutes);
// router.use("/teacher",    examROutes);
router.use("/student",  authMiddleware,  verifyRole(4) , studentRoutes);
router.use("/appeal", appealRoutes);
router.use(notification_router)

export default router;
