import express from "express";
import { authMiddleware, authorize } from "./middleware/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

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
import adminRoutes from "./routes/admin.routes.js";

const router = express.Router();

/* ======================
   Public routes
====================== */
router.use("/auth", authRoutes);

/* ======================
   Super Admin routes
====================== */
router.use(
  "/super-admin",
  authMiddleware,
  verifyRole(ROLES.SUPER_ADMIN),
  schoolRoutes
);

/* ======================
   Admin routes
====================== */
router.use(
  "/admin",
  authMiddleware,
  verifyRole(ROLES.ADMIN),
  adminRoutes
);

/* ======================
   Director routes
====================== */
router.use(
  "/director",
  authMiddleware,
  verifyRole(ROLES.DIRECTOR),
  (req, res) => res.send("Director route")
);

/* ======================
   Teacher routes
====================== */
router.use(
  "/teacher",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  examRoutes
);

router.use(
  "/attendance",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  attendanceRoutes
);

router.use(
  "/assignment",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  assignmentRoutes
);

/* ======================
   Parent routes
====================== */
router.use(
  "/parent",
  authMiddleware,
  verifyRole(ROLES.PARENT),
  parentRoutes
);

/* ======================
   Student routes
====================== */
router.use(
  "/student",
  authMiddleware,
  verifyRole(ROLES.STUDENT),
  studentRoutes
);

/* ======================
   Shared / misc routes
====================== */
router.use("/class", authMiddleware, classRoutes);
router.use("/appeal", authMiddleware, appealRoutes);
router.use("/notification", authMiddleware, notificationRoutes);

export default router;
