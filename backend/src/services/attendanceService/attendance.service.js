
import db from "../../../config/db.config.js";

const COLUMNS_PER_ROW = 6;

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
    if (!record || !record.student_id || !record.status) {
      throw new Error(`Invalid record at index ${index}`);
    }

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
    return result.rows;
  } catch (error) {
    throw new Error(`DB Error during batch UPSERT: ${error.message}`);
  }
};

/**
 * Update a single attendance record by attendance_id
 */
export const updateAttendance = async (attendanceId, updateFields) => {
  try {
    const allowedFields = ["status", "shift", "date", "record_by", "class_id"];
    const keys = Object.keys(updateFields).filter((key) =>
      allowedFields.includes(key)
    );

    if (keys.length === 0)
      throw new Error("No valid fields provided to update.");

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = keys.map((key) => updateFields[key]);
    values.push(attendanceId);

    const query = `
      UPDATE student_attendance
      SET ${setClause}, updated_at = NOW()
      WHERE attendance_id = $${values.length}
      RETURNING *;
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0)
      throw new Error("Attendance record not found");

    return result.rows[0];
  } catch (error) {
    throw new Error(`DB Error during attendance update: ${error.message}`);
  }
};

/**
 * Get aggregated daily summary for a class
 */
export const getDailySummary = async (classId, date) => {
  const summaryQuery = `
    SELECT status, COUNT(attendance_id) as count
    FROM student_attendance
    WHERE class_id = $1 AND date = $2
    GROUP BY status
  `;

  try {
    const result = await db.query(summaryQuery, [classId, date]);

    // Transform rows into key-value and normalize status
    const summary = result.rows.reduce((acc, row) => {
      // Capitalize first letter
      const normalizedStatus =
        row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase();
      acc[normalizedStatus] = parseInt(row.count, 10);
      return acc;
    }, {});

    // Ensure all statuses exist even if 0
    ["Present", "Absent", "Late", "Excused"].forEach((status) => {
      if (!(status in summary)) summary[status] = 0;
    });

    return summary;
  } catch (error) {
    throw new Error(`DB Error during daily summary: ${error.message}`);
  }
};

/**
 * Get one attendance record by ID
 */
export const getOne = async (attendanceId) => {
  try {
    const query = `
      SELECT *
      FROM student_attendance
      WHERE attendance_id = $1
    `;
    const result = await db.query(query, [attendanceId]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`DB Error fetching attendance: ${error.message}`);
  }
 
};
/**
 * List attendance records with optional filters
 */
export const list = async ({ classId, date, shift, studentId }) => {
  try {
    let conditions = [];
    let values = [];

    if (classId) {
      values.push(classId);
      conditions.push(`class_id = $${values.length}`);
    }
    if (date) {
      values.push(date);
      conditions.push(`date = $${values.length}`);
    }
    if (shift) {
      values.push(shift);
      conditions.push(`shift = $${values.length}`);
    }
    if (studentId) {
      values.push(studentId);
      conditions.push(`student_id = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT *
      FROM student_attendance
      ${whereClause}
      ORDER BY date DESC, attendance_id DESC
    `;

    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error(`DB Error during attendance listing: ${error.message}`);
  }
};
/**
 * Bulk insert / update for offline sync (from mobile)
 */
export const bulkUpsert = async (records = []) => {
  if (!Array.isArray(records) || records.length === 0) return [];

  const values = [];
  const placeholders = [];

  records.forEach((r, i) => {
    const index = i * COLUMNS_PER_ROW;
    values.push(r.student_id, r.class_id, r.date, r.shift, r.status, r.record_by);
    placeholders.push(
      `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5}, $${index + 6})`
    );
  });

  const query = `
    INSERT INTO student_attendance (student_id, class_id, date, shift, status, record_by)
    VALUES ${placeholders.join(",")}
    ON CONFLICT (student_id, class_id, date, shift)
    DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
    RETURNING *;
  `;

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    throw new Error(`DB bulk upsert failed: ${err.message}`);
  }
};


 /**
 * Validate that all student IDs exist in the database
 */
export const validateStudents = async (studentIds) => {
  try {
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return { allExist: false, missing: [] };
    }

    const query = `
      SELECT student_id 
      FROM student 
      WHERE student_id = ANY($1)
    `;
    
    const result = await db.query(query, [studentIds]);
    const existingIds = result.rows.map(row => row.student_id);
    const missingIds = studentIds.filter(id => !existingIds.includes(id));
    
    return {
      allExist: missingIds.length === 0,
      missing: missingIds
    };
  } catch (error) {
    throw new Error(`DB Error during student validation: ${error.message}`);
  }
};

 export default {
   createAttendance,
   updateAttendance,
   getDailySummary,
   getOne,
   list,
   bulkUpsert,
   validateStudents,
 };
