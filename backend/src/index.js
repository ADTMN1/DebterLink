import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware, verifyRole } from "./middleware/auth.middleware.js";
import examROutes from "./routes/examRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import appealRoutes from "./routes/appealRoutes.js";
import parentRoutes from "./routes/parent.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);


router.use("/super-admin",    authMiddleware,  verifyRole(6) , (req, res) => res.send("SUPER ADMIN route"));
router.use("/director",  authMiddleware,  verifyRole(1) , (req, res) => res.send("DIRECTOR route"));
router.use("/admin",  authMiddleware,  verifyRole(5) , (req, res) => res.send("admin route"));
router.use("/parent",  authMiddleware,  verifyRole(3) , parentRoutes);
// router.use("/parent",   parentRoutes);
router.use("/teacher",  authMiddleware,  verifyRole(2) , examROutes);
// router.use("/teacher",    examROutes);
router.use("/student",  authMiddleware,  verifyRole(4) , studentRoutes);
router.use("/appeal", appealRoutes);


export default router;
