import express from "express";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "../src/routes/student.attendance.routes.js";
import { authMiddleware, verifyRole } from "./middleware/auth.middleware.js";
import assignmentRoutes from "../src/routes/assigment.route.js";
import examROutes from "./routes/examRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import appealRoutes from "./routes/appealRoutes.js";
import parentRoutes from "./routes/parent.routes.js";
import notification_router from "./routes/notification.routes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import classROutes from "./routes/classRoutes.js";
const router = express.Router();

// Public/auth routes
router.use("/auth", authRoutes);

// // Role-based routes
// router.use("/super-admin", authMiddleware, verifyRole(), (req, res) =>
//   res.send("SUPER ADMIN route")
// );
// router.use("/director", authMiddleware, verifyRole(1), (req, res) =>
//   res.send("DIRECTOR route")
// );
// router.use("/admin", authMiddleware, verifyRole(5), (req, res) =>
//   res.send("admin route")
// );
// router.use("/parent", authMiddleware, verifyRole(3), (req, res) =>
//   res.send("parent route")
// );
// router.use("/teacher", authMiddleware, verifyRole(2), (req, res) =>
//   res.send("teacher route")
// );
// router.use("/student", authMiddleware, verifyRole(3), (req, res) =>
//   res.send("student route")
// );

// // Attendance – Teacher only
// router.use("/attendance", authMiddleware, verifyRole(2), attendanceRoutes);

// Assignment Module Routes
// router.use("/class", authMiddleware, verifyRole(4), classROutes);
router.use("/class", classROutes);
router.use("/assignment", assignmentRoutes); 
router.use("/super-admin",    authMiddleware,  verifyRole(6),schoolRoutes);
//// router.use("/super-admin",    schoolRoutes);
router.use("/director",  authMiddleware,  verifyRole(1) , (req, res) => res.send("DIRECTOR route"));
router.use("/admin",  authMiddleware,  verifyRole(5) , (req, res) => res.send("admin route"));
router.use("/parent",  authMiddleware,  verifyRole(3) , parentRoutes);
// router.use("/parent",   parentRoutes);
router.use("/teacher",  authMiddleware,  verifyRole(2) , examROutes);
// router.use("/teacher",    examROutes);
router.use("/student",  authMiddleware,  verifyRole(4) , studentRoutes);
router.use("/appeal", appealRoutes);
router.use(notification_router)

export default router;
