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
import { ROLES } from "../../constants/roles.js";

const router = Router();

// ===============================
//  TEACHER-ONLY ROUTES
// ===============================
router.post("/create", authMiddleware, verifyRole(ROLES.TEACHER), createAssignment);
router.get(
  "/submissions/:assignment_id",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  listSubmissions
);
router.post(
  "/grade/:submission_id",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  gradeSubmission
);
router.put(
  "/update/:assignment_id",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  updateAssignment
);
router.delete(
  "/delete/:assignment_id",
  authMiddleware,
  verifyRole(ROLES.TEACHER),
  deleteAssignment
);

// ===============================
//  STUDENT-ONLY ROUTES
// ===============================
router.post("/submit", authMiddleware, verifyRole(ROLES.STUDENT), submitAssignment);
router.get(
  "/my/submissions",
  authMiddleware,
  verifyRole(ROLES.STUDENT),
  getStudentSubmissions
);

// ===============================
//  SHARED — Teacher + Student
// ===============================
router.get("/class/:class_id", authMiddleware, getAssignmentsByClass);
router.get("/:assignment_id", authMiddleware, getAssignmentById);

export default router;
