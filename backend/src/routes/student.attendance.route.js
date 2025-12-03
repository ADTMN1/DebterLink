// src/routes/attendance/student.attendance.routes.js
import { Router } from "express";
import controller from "../controllers/attendance/student.attendance.controller.js";

import {
  markAttendanceSchema,
  updateAttendanceSchema,
  bulkSyncSchema,
  summarySchema,
} from "../Utils/student.attendance.validator.js";

// Middleware for Joi validation
const validate =
  (schema, type = "body") =>
  (req, res, next) => {
    const data = type === "body" ? req.body : req.query;
    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

const router = Router();

/** ================= STUDENT ATTENDANCE ROUTES ================= **/

// Mark attendance
router.post("/mark", validate(markAttendanceSchema), controller.markAttendance);

// Update attendance
router.patch(
  "/update/:attendance_id",
  validate(updateAttendanceSchema),
  controller.updateAttendance
);

// Get single attendance record
router.get("/:attendance_id", controller.getOne);

// List attendance records
router.get(
  "/list",
  validate(summarySchema, "query"), // using same schema for date
  controller.list
);

// Bulk sync (offline)
router.post("/sync", validate(bulkSyncSchema), controller.bulkSync);

// Daily summary
router.get("/summary", validate(summarySchema, "query"), controller.summary);

export default router;
