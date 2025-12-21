
import express from 'express';
import { authMiddleware, verifyRole } from '../middleware/auth.middleware.js';
import { checkSchoolAccess } from '../middleware/schoolAccess.js';
import { sanitizeInput } from '../middleware/sanitize.js';
import { ROLES } from '../../constants/roles.js';
import StudentController from '../controllers/student/student.controller.js';
import examControllers from '../controllers/studentControllers/examControllers.js';

const studentRoutes = express.Router();

// Apply authentication and input sanitization to all routes
studentRoutes.use(authMiddleware);
studentRoutes.use(sanitizeInput);

// -------------------- CRUD --------------------
// Test route without school access check
studentRoutes.post("/test_create", StudentController.createStudent);

// School Admin (only their school) and Super Admin (any school) can create students
studentRoutes.post("/create_student", checkSchoolAccess, StudentController.createStudent);

// School Admin (only their school) and Super Admin (any school) can update students
studentRoutes.patch("/update_student/:student_id", checkSchoolAccess, StudentController.updateStudent);

// School Admin (only their school) and Super Admin (any school) can delete students
studentRoutes.delete("/delete_student/:student_id", checkSchoolAccess, StudentController.deleteStudent);

// Super Admin only: Get all students system-wide
studentRoutes.get("/all_students", verifyRole(ROLES.SUPER_ADMIN), StudentController.getAllStudents);

// All authenticated users with school access: Get single student
studentRoutes.get("/student/:student_id", checkSchoolAccess, StudentController.getStudent);

// -------------------- Filters --------------------
// All authenticated users with school access: Students by school
studentRoutes.get("/school/:school_id", checkSchoolAccess, StudentController.getStudentsBySchool);

// All authenticated users with school access: Students by class
studentRoutes.get("/class/:class_id", checkSchoolAccess, StudentController.getStudentsByClass);

// All authenticated users with school access: Students by status
studentRoutes.get("/status/:status", checkSchoolAccess, StudentController.getStudentsByStatus);

// -------------------- Advanced Student Management --------------------
// School Admin and Super Admin: Create multiple students at once
studentRoutes.post("/bulk_create", checkSchoolAccess, StudentController.bulkCreateStudents);

// School Admin and Super Admin: Update multiple students at once
studentRoutes.patch("/bulk_update", checkSchoolAccess, StudentController.bulkUpdateStudents);

// School Admin and Super Admin: Delete multiple students at once
studentRoutes.delete("/bulk_delete", checkSchoolAccess, StudentController.bulkDeleteStudents);

// School Admin and Super Admin: Get student statistics
studentRoutes.get("/statistics/:school_id", checkSchoolAccess, StudentController.getStudentStatistics);

// -------------------- Role Specific Routes --------------------
// Teachers: View their assigned students only
studentRoutes.get("/teacher/my-students", verifyRole(ROLES.TEACHER), StudentController.getTeacherStudents);

// Parents: View their children only
studentRoutes.get("/parent/my-children", verifyRole(ROLES.PARENT), StudentController.getParentStudents);

// -------------------- Exam Results (Existing) --------------------
// Keep existing exam result endpoint
studentRoutes.get('/exam-result/:student_id', examControllers.studentResult);

export default studentRoutes;