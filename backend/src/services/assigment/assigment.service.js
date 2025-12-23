
import pool from "../../../config/db.config.js";

/**
 * Notes:
 * - We accept teacher_user_id (users.user_id). We resolve teacher.teacher_id.
 * - If teacher record not found, we throw an error.
 */
export const createAssignment = async ({
  teacher_user_id,
  class_id,
  subject_id,
  title,
  file_url,
  score,
  description,
  due_date,
  late_submission_penalty,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // resolve teacher_id from teacher table using user_id
    const tRes = await client.query(
      "SELECT teacher_id FROM teacher WHERE user_id = $1",
      [teacher_user_id]
    );
    if (tRes.rowCount === 0) {
      throw new Error("Teacher record not found for current user");
    }
    const teacher_id = tRes.rows[0].teacher_id;

    const insertSQL = `
      INSERT INTO assignment
        (assignment_id, teacher_id, class_id, subject_id, title, file_url, score, description, due_date, late_submission_penalty, created_at, updated_at)
      VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9, now(), now())
      RETURNING *;
    `;
    const params = [
      teacher_id,
      class_id,
      subject_id || null,
      title,
      file_url,
      score || null,
      description || null,
      due_date || null,
      late_submission_penalty || null,
    ];

    const res = await client.query(insertSQL, params);
    await client.query("COMMIT");
    return res.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getClassAssignments = async (class_id) => {
  const sql = `
    SELECT a.*,
      t.teacher_id,
      u.user_id as teacher_user_id,
      u.full_name as teacher_name
    FROM assignment a
    LEFT JOIN teacher t ON a.teacher_id = t.teacher_id
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE a.class_id = $1
    ORDER BY a.due_date ASC, a.created_at DESC
  `;
  const { rows } = await pool.query(sql, [class_id]);
  return rows;
};

export const getAssignmentById = async (assignment_id) => {
  const sql = `SELECT * FROM assignment WHERE assignment_id = $1`;
  const { rows } = await pool.query(sql, [assignment_id]);
  return rows[0];
};

export const submitAssignment = async ({
  assignment_id,
  student_user_id,
  file_url,
  remarks
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Resolve student_id from student table using user_id
    const studentRes = await client.query(
      "SELECT student_id FROM student WHERE user_id = $1",
      [student_user_id]
    );
    if (studentRes.rowCount === 0) {
      throw new Error("Student record not found for current user");
    }
    const student_id = studentRes.rows[0].student_id;

    // Check if already submitted
    const existingRes = await client.query(
      "SELECT submission_id FROM assignment_submission WHERE assignment_id = $1 AND student_id = $2",
      [assignment_id, student_id]
    );
    if (existingRes.rowCount > 0) {
      throw new Error("Assignment already submitted");
    }

    const insertSQL = `
      INSERT INTO assignment_submission
        (submission_id, assignment_id, student_id, file_url, remarks, submission_date, status)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), 'submitted')
      RETURNING *;
    `;
    const params = [assignment_id, student_id, file_url, remarks || null];

    const res = await client.query(insertSQL, params);
    await client.query("COMMIT");
    return res.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getAssignmentSubmissions = async (assignment_id) => {
  const sql = `
    SELECT 
      s.submission_id,
      s.file_url,
      s.remarks,
      s.submission_date,
      s.score,
      s.feedback,
      s.status,
      st.student_id,
      u.user_id as student_user_id,
      u.full_name as student_name
    FROM assignment_submission s
    JOIN student st ON s.student_id = st.student_id
    JOIN users u ON st.user_id = u.user_id
    WHERE s.assignment_id = $1
    ORDER BY s.submission_date DESC
  `;
  const { rows } = await pool.query(sql, [assignment_id]);
  return rows;
};

export const getStudentSubmissions = async (student_user_id) => {
  const sql = `
    SELECT 
      s.submission_id,
      s.file_url,
      s.remarks,
      s.submission_date,
      s.score,
      s.feedback,
      s.status,
      a.assignment_id,
      a.title,
      a.due_date,
      a.score as max_score,
      sub.subject_name
    FROM assignment_submission s
    JOIN assignment a ON s.assignment_id = a.assignment_id
    LEFT JOIN subject sub ON a.subject_id = sub.subject_id
    JOIN student st ON s.student_id = st.student_id
    WHERE st.user_id = $1
    ORDER BY s.submission_date DESC
  `;
  const { rows } = await pool.query(sql, [student_user_id]);
  return rows;
};

export const gradeSubmission = async ({ submission_id, score, feedback }) => {
  const sql = `
    UPDATE assignment_submission 
    SET score = $1, feedback = $2, status = 'graded'
    WHERE submission_id = $3
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [score, feedback, submission_id]);
  return rows[0];
};

export const updateAssignment = async ({ assignment_id, updates }) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  if (fields.length === 0) {
    throw new Error("No fields to update");
  }
  
  const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const sql = `
    UPDATE assignment 
    SET ${setQuery}, updated_at = NOW()
    WHERE assignment_id = $${fields.length + 1}
    RETURNING *
  `;
  
  const { rows } = await pool.query(sql, [...values, assignment_id]);
  return rows[0];
};

export const deleteAssignment = async (assignment_id) => {
  const sql = "DELETE FROM assignment WHERE assignment_id = $1 RETURNING *";
  const { rows } = await pool.query(sql, [assignment_id]);
  return rows[0];
};
