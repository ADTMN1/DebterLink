

import attendanceService from "../../services/attendanceService/attendance.service.js";

// ──────────────────────────────────────────────────────────────
// All handlers as proper async functions 
// ──────────────────────────────────────────────────────────────

export const markAttendance = async (req, res) => {
  try {
    const result = await attendanceService.createAttendance(req.body);
    return res.status(201).json({
      message: "Attendance marked successfully",
      data: result,
    });
  } catch (err) {
    if (err.message.includes("duplicate key")) {
      console.log("Request body:", req.body);
      return res.status(409).json({ message: "Attendance already exists" });
    }
    return res.status(500).json({ message: err.message || "Server error" });
  }
};




export const updateAttendance = async (req, res) => {
  try {
    const { attendance_id } = req.params;
    const updates = req.body;

    const result = await attendanceService.updateAttendance(
      attendance_id,
      updates
    );

    if (!result) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    return res.json({ message: "Attendance updated", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getOne = async (req, res) => {
  try {
    const { attendance_id } = req.params;
    const result = await attendanceService.getOne(attendance_id);

    if (!result) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getDailySummary = async (req, res) => {
  try {
    const { classId, date } = req.query;
    if (!classId || !date) {
      return res.status(400).json({ message: "classId and date are required" });
    }

    const result = await attendanceService.getDailySummary(classId, date);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const list = async (req, res) => {
  try {
    const result = await attendanceService.list(req.query);
    return res.json({ total: result.length, data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const bulkSync = async (req, res) => {
  try {
    const result = await attendanceService.bulkUpsert(req.body.records);
    return res.json({
      message: "Synced successfully",
      synced: result.length,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

