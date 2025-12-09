
import pool from "../../config/db.config.js";

/**
 * submitAssignment:
 * - resolves student.student_id from users.user_id
 * - checks assignment existence and due_date
 * - creates submission (throws ALREADY_EXISTS if (assignment,student) exists)
 */
export const submitAssignment = async ({
  assignment_id,
  student_user_id,
  file_url,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // find student_id by user_id
    const stRes = await client.query(
      "SELECT student_id FROM student WHERE user_id = $1",
      [student_user_id]
    );
    if (stRes.rowCount === 0) {
      const err = new Error("Student record not found for the current user");
      err.code = "STUDENT_NOT_FOUND";
      throw err;
    }
    const student_id = stRes.rows[0].student_id;

    // check assignment exists and fetch due_date
    const asgRes = await client.query(
      "SELECT due_date FROM assignment WHERE assignment_id = $1",
      [assignment_id]
    );
    if (asgRes.rowCount === 0) {
      const err = new Error("Assignment not found");
      throw err;
    }
    const due_date = asgRes.rows[0].due_date; // DATE or null

    // check existing submission
    const exist = await client.query(
      `SELECT submission_id FROM submissions WHERE assignment_id = $1 AND student_id = $2`,
      [assignment_id, student_id]
    );
    if (exist.rowCount > 0) {
      const err = new Error(
        "Submission already exists for this student and assignment. Use update endpoint to resubmit."
      );
      err.code = "ALREADY_EXISTS";
      throw err;
    }

    const submitted_at = new Date();
    let late_flag = false;
    if (due_date) {
      // compare date-only (server local time)
      const submittedDateOnly = submitted_at.toISOString().slice(0, 10);
      const dueDateOnly = new Date(due_date).toISOString().slice(0, 10);
      late_flag = submittedDateOnly > dueDateOnly;
    }

    const insertSQL = `
      INSERT INTO submissions
        (submission_id, assignment_id, student_id, file_url, submitted_at, late_flag, status, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'pending', now(), now())
      RETURNING *;
    `;
    const params = [
      assignment_id,
      student_id,
      file_url,
      submitted_at,
      late_flag,
    ];
    const insRes = await client.query(insertSQL, params);

    await client.query("COMMIT");
    return insRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Update (resubmit) an existing submission
 * Accepts: { assignment_id, student_user_id, file_url }
 */
export const updateSubmission = async ({
  assignment_id,
  student_user_id,
  file_url,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const stRes = await client.query(
      "SELECT student_id FROM student WHERE user_id = $1",
      [student_user_id]
    );
    if (stRes.rowCount === 0) {
      const err = new Error("Student record not found for the current user");
      err.code = "STUDENT_NOT_FOUND";
      throw err;
    }
    const student_id = stRes.rows[0].student_id;

    const asgRes = await client.query(
      "SELECT due_date FROM assignment WHERE assignment_id = $1",
      [assignment_id]
    );
    if (asgRes.rowCount === 0) throw new Error("Assignment not found");

    const due_date = asgRes.rows[0].due_date;
    const submitted_at = new Date();
    let late_flag = false;
    if (due_date) {
      const submittedDateOnly = submitted_at.toISOString().slice(0, 10);
      const dueDateOnly = new Date(due_date).toISOString().slice(0, 10);
      late_flag = submittedDateOnly > dueDateOnly;
    }

    const sql = `
      UPDATE submissions
      SET file_url = $1, submitted_at = $2, late_flag = $3, status = 'pending', updated_at = now()
      WHERE assignment_id = $4 AND student_id = $5
      RETURNING *;
    `;
    const params = [
      file_url,
      submitted_at,
      late_flag,
      assignment_id,
      student_id,
    ];
    const { rows } = await client.query(sql, params);
    if (rows.length === 0) throw new Error("Submission not found to update");

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Grade a submission (teacher)
 * input: { submission_id, score, feedback } - submission_id can be from params
 */
export const gradeSubmission = async ({ submission_id, score, feedback }) => {
  const sql = `
    UPDATE submissions
    SET score = $1, teacher_feedback = $2, status = 'graded', updated_at = now()
    WHERE submission_id = $3
    RETURNING *;
  `;
  const params = [score || null, feedback || null, submission_id];
  const { rows } = await pool.query(sql, params);
  if (rows.length === 0) throw new Error("Submission not found for grading");
  return rows[0];
};

/**
 * Get submissions for an assignment (teacher view)
 */
export const getAssignmentSubmissions = async (assignment_id) => {
  const sql = `
    SELECT s.*,
           st.student_id,
           u.user_id as student_user_id,
           u.full_name as student_name,
           u.email as student_email
    FROM submissions s
    JOIN student st ON s.student_id = st.student_id
    JOIN users u ON st.user_id = u.user_id
    WHERE s.assignment_id = $1
    ORDER BY s.submitted_at ASC;
  `;
  const { rows } = await pool.query(sql, [assignment_id]);
  return rows;
};
