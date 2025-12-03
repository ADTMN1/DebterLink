// src/services/attendance.service.js
import db from "../../../config/db.config.js";

export const checkAttendanceExists = async (
  student_id,
  class_id,
  date,
  shift
) => {
  const query = `
    SELECT attendance_id
    FROM student_attendance
    WHERE student_id = $1
      AND class_id = $2
      AND date = $3
      AND shift = $4
    LIMIT 1;
  `;
  const result = await db.query(query, [student_id, class_id, date, shift]);
  return result.rows.length > 0;
};

export const createAttendance = async ({
  student_id,
  class_id,
  date,
  record_by,
  shift,
  status,
}) => {
  const insertQuery = `
    INSERT INTO student_attendance (student_id, class_id, date, record_by, shift, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  try {
    const result = await db.query(insertQuery, [
      student_id,
      class_id,
      date,
      record_by,
      shift,
      status,
    ]);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      // UNIQUE VIOLATION
      throw {
        code: "ALREADY_MARKED",
        message:
          "Attendance already marked for this student on this date and shift.",
      };
    }
    throw error;
  }
};

export const markAttendance = async (data) => {
  const exists = await checkAttendanceExists(
    data.student_id,
    data.class_id,
    data.date,
    data.shift
  );
  if (exists) {
    throw {
      code: "ALREADY_MARKED",
      message:
        "Attendance already marked for this student on this date and shift.",
    };
  }
  return await createAttendance(data);
};

export default {
  markAttendance,
};
