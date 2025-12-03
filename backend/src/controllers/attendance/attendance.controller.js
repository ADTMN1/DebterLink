// src/controllers/attendance/attendance.controller.js
import { validateAttendanceInput } from "../../Utils/attendance.validation.js";
import * as attendanceService from "../../services/attendanceService/attendance.query.js";
import { notifyParent } from "../../Utils/attendance.notification.js";

export async function markAttendanceController(req, res) {
  const validationError = validateAttendanceInput(req.body);
  if (validationError)
    return res.status(400).json({ message: validationError });

  try {
    const newRecord = await attendanceService.markAttendance(req.body);

    if (["absent", "late"].includes(req.body.status.toLowerCase())) {
      await notifyParent(req.body.student_id, newRecord);
    }

    return res.status(201).json(newRecord);
  } catch (error) {
    if (error.code === "ALREADY_MARKED")
      return res.status(409).json({ message: error.message });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
