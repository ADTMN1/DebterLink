import { Router } from "express";
import {
  createAssignment,
  getAssignmentsByClass,
  submitAssignment,
  listSubmissions,
  gradeSubmission,
  getAssignmentById,
  deleteAssignment,
  updateAssignment,
  getStudentSubmissions,
} from "../controllers/assigment/assigment.controller.js";

// Auth + Role Enforcement
import { authMiddleware, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// ===============================
//  TEACHER-ONLY ROUTES
// ===============================
router.post("/create", authMiddleware, verifyRole(2), createAssignment);
router.get(
  "/submissions/:assignment_id",
  authMiddleware,
  verifyRole(2),
  listSubmissions
);
router.post(
  "/grade/:submission_id",
  authMiddleware,
  verifyRole(2),
  gradeSubmission
);
router.put(
  "/update/:assignment_id",
  authMiddleware,
  verifyRole(2),
  updateAssignment
);
router.delete(
  "/delete/:assignment_id",
  authMiddleware,
  verifyRole(2),
  deleteAssignment
);

// ===============================
//  STUDENT-ONLY ROUTES
// ===============================
router.post("/submit", authMiddleware, verifyRole(3), submitAssignment);
router.get(
  "/my/submissions",
  authMiddleware,
  verifyRole(3),
  getStudentSubmissions
);

// ===============================
//  SHARED — Teacher + Student
// ===============================
router.get("/class/:class_id", authMiddleware, getAssignmentsByClass);
router.get("/:assignment_id", authMiddleware, getAssignmentById);

export default router;
