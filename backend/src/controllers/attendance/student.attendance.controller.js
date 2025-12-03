// attendance/student.attendance.controller.js
import attendanceService from "../../services/attendanceService/attendance.service.js";
import notificationService from "../../services/attendanceService/notification.service.js"; // optional (used later when we implement)

export default {
  /** Mark attendance */
  async markAttendance(req, res) {
    try {
      const data = req.body;

      const result = await attendanceService.createAttendance(data);

      // optional notification trigger
      // await notificationService.notifyParent(result.student_id, result.status);

      return res.status(201).json({
        message: "Attendance marked successfully",
        data: result,
      });
    } catch (err) {
      if (err.message.includes("duplicate key")) {
        return res.status(409).json({ message: "Attendance already exists" });
      }
      return res.status(500).json({ message: err.message });
    }
  },

  /** Update Attendance */
  async updateAttendance(req, res) {
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
      return res.status(500).json({ message: err.message });
    }
  },

  /** Get single attendance record */
  async getOne(req, res) {
    try {
      const { attendance_id } = req.params;

      const result = await attendanceService.getOne(attendance_id);

      if (!result) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      return res.json({ data: result });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  /** List by date/class/shift */
  async list(req, res) {
    try {
      const filters = req.query; // { date, class_id, shift, status }

      const result = await attendanceService.listByDate(filters);

      return res.json({ count: result.length, data: result });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  /** Offline sync for mobile apps */
  async bulkSync(req, res) {
    try {
      const records = req.body.records;

      const result = await attendanceService.bulkUpsert(records);

      return res.json({
        message: "Offline attendance synced",
        synced: result.length,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  /** Daily Summary */
  async summary(req, res) {
    try {
      const { date } = req.query;

      const result = await attendanceService.dailySummary(date);

      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
