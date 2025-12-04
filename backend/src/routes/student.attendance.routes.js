// src/routes/attendance/student.attendance.routes.js
// (or wherever you keep it – just make sure the import path below is correct)

import { Router } from "express";
const router = Router();

// ── IMPORT ALL SCHEMAS (this was missing or wrong path) ─────────────────────
import {
  markAttendanceSchema,
  updateAttendanceSchema,
  bulkSyncSchema,
  summarySchema,
  listAttendanceSchema,
} from "../Utils/student.attendance.validator.js"; // ← double-check this path!

// ── IMPORT ALL CONTROLLERS (named exports – this is the correct way) ───────
import {
  markAttendance,
  updateAttendance,
  getOne,
  getDailySummary,
  list,
  bulkSync,
} from "../controllers/attendance/student.attendance.controller.js";

// ── VALIDATION MIDDLEWARE ───────────────────────────────────────────────────
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

    // put cleaned data back
    if (source === "body") req.body = value;
    if (source === "query") req.query = value;

    next();
  };

// ── PARAM VALIDATOR FOR :attendance_id ─────────────────────────────────────
const validateAttendanceId = (req, res, next) => {
  const { error, value } = Joi.string()
    .trim()
    .guid({ version: "uuidv4" })
    .required()
    .validate(req.params.attendance_id);

  if (error) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid attendance_id – must be a valid UUID",
      });
  }
  req.params.attendance_id = value;
  next();
};

// ── ROUTES ──────────────────────────────────────────────────────────────────
router.post("/mark", validate(markAttendanceSchema), markAttendance);

router.patch(
  "/update/:attendance_id",
  validateAttendanceId,
  validate(updateAttendanceSchema),
  updateAttendance
);

router.get("/summary", validate(summarySchema, "query"), getDailySummary);

router.get("/list", validate(listAttendanceSchema, "query"), list);

router.get("/:attendance_id", validateAttendanceId, getOne);

router.post("/sync", validate(bulkSyncSchema), bulkSync);

// Optional health check
router.get("/health", (req, res) =>
  res.json({ status: "OK", time: new Date().toISOString() })
);

export default router;
