
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
