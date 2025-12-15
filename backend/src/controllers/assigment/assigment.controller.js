import pool from "../../../config/db.config.js";

// ----------------------
// TEACHER: Create Assignment
// ----------------------
export const createAssignment = async (req, res) => {
  const {
    class_id,
    subject_id,
    title,
    description,
    file_url, // URL provided by teacher
    score,
    due_date,
    late_submission_penalty,
  } = req.body;

  if (!file_url)
    return res.status(400).json({ message: "file_url is required" });

  const teacher_id = req.user.teacher_id;

  try {
    const result = await pool.query(
      `INSERT INTO assignment
       (teacher_id, class_id, subject_id, title, description, file_url, score, due_date, late_submission_penalty)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        teacher_id,
        class_id,
        subject_id,
        title,
        description,
        file_url,
        score,
        due_date,
        late_submission_penalty,
      ]
    );

    return res
      .status(201)
      .json({ message: "Assignment created", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// STUDENT: Submit Assignment
// ----------------------
export const submitAssignment = async (req, res) => {
  const { assignment_id, file_url, remarks } = req.body;
  const student_id = req.user.student_id;

  if (!file_url)
    return res.status(400).json({ message: "file_url is required" });

  try {
    const check = await pool.query(
      `SELECT * FROM assignment_submission WHERE assignment_id=$1 AND student_id=$2`,
      [assignment_id, student_id]
    );

    if (check.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "You already submitted this assignment" });
    }

    const result = await pool.query(
      `INSERT INTO assignment_submission
       (assignment_id, student_id, file_url, remarks, submission_date)
       VALUES ($1,$2,$3,$4,NOW())
       RETURNING *`,
      [assignment_id, student_id, file_url, remarks]
    );

    return res
      .status(201)
      .json({ message: "Submission successful", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// SHARED: Get Assignment by ID
// ----------------------
export const getAssignmentById = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM assignment WHERE assignment_id = $1`,
      [assignment_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Assignment not found" });

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// SHARED: Get Assignments by Class
// ----------------------
export const getAssignmentsByClass = async (req, res) => {
  const { class_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM assignment WHERE class_id = $1 ORDER BY due_date DESC`,
      [class_id]
    );
    return res.json({ total: result.rows.length, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// TEACHER: List Submissions
// ----------------------
export const listSubmissions = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.student_id, u.full_name, sub.file_url, sub.remarks, sub.submission_date, sub.score
       FROM assignment_submission sub
       JOIN student s ON s.student_id = sub.student_id
       JOIN users u ON u.user_id = s.user_id
       WHERE sub.assignment_id = $1`,
      [assignment_id]
    );

    return res.json({ total: result.rows.length, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// STUDENT: Get My Submissions
// ----------------------
export const getStudentSubmissions = async (req, res) => {
  const student_id = req.user.student_id;

  try {
    const result = await pool.query(
      `SELECT a.title, a.due_date, sub.file_url, sub.remarks, sub.score
       FROM assignment_submission sub
       JOIN assignment a ON a.assignment_id = sub.assignment_id
       WHERE sub.student_id = $1`,
      [student_id]
    );

    return res.json({ total: result.rows.length, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// TEACHER: Grade Submission
// ----------------------
export const gradeSubmission = async (req, res) => {
  const { submission_id } = req.params;
  const { score, feedback } = req.body;

  try {
    const result = await pool.query(
      `UPDATE assignment_submission SET score=$1, feedback=$2 WHERE submission_id=$3 RETURNING *`,
      [score, feedback, submission_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Submission not found" });

    return res.json({ message: "Submission graded", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// TEACHER: Update Assignment
// ----------------------
export const updateAssignment = async (req, res) => {
  const { assignment_id } = req.params;
  const updates = req.body; // can include title, description, file_url, score, due_date, penalty

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setQuery = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE assignment SET ${setQuery} WHERE assignment_id=$${
        fields.length + 1
      } RETURNING *`,
      [...values, assignment_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Assignment not found" });

    return res.json({ message: "Assignment updated", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ----------------------
// TEACHER: Delete Assignment
// ----------------------
export const deleteAssignment = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM assignment WHERE assignment_id=$1 RETURNING *`,
      [assignment_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Assignment not found" });

    return res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
