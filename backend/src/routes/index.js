import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.get("/parent", (req, res) => res.send("parent route"));
router.get("/admin", (req, res) => res.send("admin route"));
router.get("/teacher", (req, res) => res.send("teacher route"));
router.get("/student", (req, res) => res.send("student route"));

export default router;
