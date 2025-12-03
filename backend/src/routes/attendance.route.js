// src/routes/attendance.routes.js
import express from "express";
import { markAttendanceController } from "../controllers/attendance/attendance.controller.js";

const router = express.Router();

// POST /attendance/mark
router.post("/mark", markAttendanceController);

// Future endpoints: update, sync, summary

export default router;
