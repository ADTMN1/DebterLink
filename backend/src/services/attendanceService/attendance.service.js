// src/services/attendance.service.js
import db from "../../../config/db.config.js";
import notificationService from "./notification.service.js";

const COLUMNS_PER_ROW = 6; // ✅ define this constant

export const createAttendance = async ({
  records,
  classId,
  date,
  shift,
  recordedByUserId,
}) => {
  if (!Array.isArray(records) || records.length === 0) return [];

  let values = [];
  let placeholders = [];

  records.forEach((record, index) => {
    const baseIndex = index * COLUMNS_PER_ROW;
    values.push(
      record.student_id,
      classId,
      date,
      shift,
      record.status,
      recordedByUserId
    );
    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
        baseIndex + 4
      }, $${baseIndex + 5}, $${baseIndex + 6})`
    );
  });

  const upsertQuery = `
    INSERT INTO student_attendance (
        student_id, class_id, date, shift, status, record_by
    )
    VALUES 
        ${placeholders.join(", ")}
    ON CONFLICT (student_id, class_id, date, shift)
    DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = NOW()
    RETURNING *;
  `;

  try {
    const result = await db.query(upsertQuery, values);

    const studentsToNotify = records.filter((r) =>
      ["Absent", "Late"].includes(r.status)
    );

    if (studentsToNotify.length > 0) {
      notificationService
        .triggerParentNotifications(studentsToNotify, classId, date, shift)
        .catch((err) => console.error("Notification Error:", err));
    }

    return result.rows;
  } catch (error) {
    throw new Error(`DB Error during batch UPSERT: ${error.message}`);
  }
};

export default {
  createAttendance,
};
