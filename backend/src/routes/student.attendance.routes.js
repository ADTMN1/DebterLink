// src/routes/attendance/student.attendance.routes.js

import { Router } from "express";
const router = Router();
import { authMiddleware, verifyRole } from "../middleware/auth.middleware.js";

// ── IMPORT ALL SCHEMAS ───────────────────────────────────────────────
import {
  markAttendanceSchema,
  updateAttendanceSchema,
  bulkSyncSchema,
  summarySchema,
  listAttendanceSchema,
} from "../Utils/student.attendance.validator.js";

// ── IMPORT ALL CONTROLLERS ───────────────────────────────────────────
import {
  markAttendance,
  updateAttendance,
  getOne,
  getDailySummary,
  list,
  bulkSync,
} from "../controllers/attendance/student.attendance.controller.js";

// ── VALIDATION MIDDLEWARE ────────────────────────────────────────────
import Joi from "joi";

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const data = source === "body" ? req.body : req.query;

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details
        .map((d) => d.message.replace(/"/g, "'"))
        .join(", ");
      return res.status(400).json({ success: false, message: messages });
    }

    if (source === "body") req.body = value;
    if (source === "query") req.query = value;

    next();
  };

// ── PARAM VALIDATOR FOR :attendance_id ───────────────────────────────
const validateAttendanceId = (req, res, next) => {
  const { error, value } = Joi.string()
    .trim()
    .guid({ version: "uuidv4" })
    .required()
    .validate(req.params.attendance_id);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid attendance_id – must be a valid UUID",
    });
  }
  req.params.attendance_id = value;
  next();
};

// ── ROUTES ──────────────────────────────────────────────────────────
// Teacher-only routes
router.post(
  "/mark",
  authMiddleware,
  verifyRole(2), //  Teacher role
  validate(markAttendanceSchema),
  markAttendance
);

router.patch(
  "/update/:attendance_id",
  authMiddleware,
  verifyRole(2), // Teacher role
  validateAttendanceId,
  validate(updateAttendanceSchema),
  updateAttendance
);

// Public/student accessible routes
router.get("/summary", validate(summarySchema, "query"), getDailySummary);
router.get("/list", validate(listAttendanceSchema, "query"), list);
router.get("/:attendance_id", validateAttendanceId, getOne);

// Bulk sync (teacher-only)
router.post(
  "/sync",
  authMiddleware,
  verifyRole(2), //  Teacher role
  validate(bulkSyncSchema),
  bulkSync
);

// Optional health check
router.get("/health", (req, res) =>
  res.json({ status: "OK", time: new Date().toISOString() })
);

export default router;
