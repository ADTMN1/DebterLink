import {
  createAssignment as createAssignmentService,
  getClassAssignments,
  submitAssignment as submitAssignmentService,
  getAssignmentSubmissions,
  gradeSubmission as gradeSubmissionService,
  getAssignmentById as getAssignmentByIdService,
  deleteAssignment as deleteAssignmentService,
  updateAssignment as updateAssignmentService,
  getStudentSubmissions as getStudentSubmissionsService,
} from "../../services/assigment/assigment.service.js";

// ----------------------
// TEACHER: Create Assignment
// ----------------------
export const createAssignment = async (req, res) => {
  const {
    class_id,
    subject_id,
    title,
    description,
    file_url,
    score,
    due_date,
    late_submission_penalty,
  } = req.body;

  if (!file_url)
    return res.status(400).json({ message: "file_url is required" });
  if (!title)
    return res.status(400).json({ message: "title is required" });
  if (!class_id)
    return res.status(400).json({ message: "class_id is required" });

  const teacher_user_id = req.user.user_id;

  try {
    const result = await createAssignmentService({
      teacher_user_id,
      class_id,
      subject_id,
      title,
      description,
      file_url,
      score,
      due_date,
      late_submission_penalty,
    });

    return res
      .status(201)
      .json({ message: "Assignment created", data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// STUDENT: Submit Assignment
// ----------------------
export const submitAssignment = async (req, res) => {
  const { assignment_id, file_url, remarks } = req.body;
  const student_user_id = req.user.user_id;

  if (!file_url)
    return res.status(400).json({ message: "file_url is required" });
  if (!assignment_id)
    return res.status(400).json({ message: "assignment_id is required" });

  try {
    const result = await submitAssignmentService({
      assignment_id,
      student_user_id,
      file_url,
      remarks,
    });

    return res
      .status(201)
      .json({ message: "Submission successful", data: result });
  } catch (err) {
    console.error(err);
    if (err.message === "Assignment already submitted") {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// SHARED: Get Assignment by ID
// ----------------------
export const getAssignmentById = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await getAssignmentByIdService(assignment_id);

    if (!result)
      return res.status(404).json({ message: "Assignment not found" });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// SHARED: Get Assignments by Class
// ----------------------
export const getAssignmentsByClass = async (req, res) => {
  const { class_id } = req.params;

  try {
    const result = await getClassAssignments(class_id);
    return res.json({ total: result.length, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// TEACHER: List Submissions
// ----------------------
export const listSubmissions = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await getAssignmentSubmissions(assignment_id);
    return res.json({ total: result.length, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// STUDENT: Get My Submissions
// ----------------------
export const getStudentSubmissions = async (req, res) => {
  const student_user_id = req.user.user_id;

  try {
    const result = await getStudentSubmissionsService(student_user_id);
    return res.json({ total: result.length, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// TEACHER: Grade Submission
// ----------------------
export const gradeSubmission = async (req, res) => {
  const { submission_id } = req.params;
  const { score, feedback } = req.body;

  if (score === undefined)
    return res.status(400).json({ message: "score is required" });
  if (score < 0)
    return res.status(400).json({ message: "score must be non-negative" });

  try {
    const result = await gradeSubmissionService({ submission_id, score, feedback });

    if (!result)
      return res.status(404).json({ message: "Submission not found" });

    return res.json({ message: "Submission graded", data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// TEACHER: Update Assignment
// ----------------------
export const updateAssignment = async (req, res) => {
  const { assignment_id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ message: "No fields to update" });

  try {
    const result = await updateAssignmentService({ assignment_id, updates });

    if (!result)
      return res.status(404).json({ message: "Assignment not found" });

    return res.json({ message: "Assignment updated", data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// ----------------------
// TEACHER: Delete Assignment
// ----------------------
export const deleteAssignment = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const result = await deleteAssignmentService(assignment_id);

    if (!result)
      return res.status(404).json({ message: "Assignment not found" });

    return res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
