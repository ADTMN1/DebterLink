import express from "express";
import { authMiddleware, verifyRole } from "../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { checkSchoolAccess, superAdminOnly } from "../middleware/schoolAccess.js";
import { checkTeacherClassAccess, checkTeacherStudentAccess } from "../middleware/teacherAccess.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import ClassController from "../controllers/school/class.controller.js";

const classRoutes = express.Router();

// Apply authentication to all routes
classRoutes.use(authMiddleware);
classRoutes.use(sanitizeInput);

// -------------------- CRUD --------------------
// School Admin (only their school) and Super Admin (any school) can create classes
classRoutes.post("/create_class", checkSchoolAccess, ClassController.createClass);

// School Admin (only their school) and Super Admin (any school) can update classes
classRoutes.patch("/update_class/:class_id", checkSchoolAccess, ClassController.updateClass);

// School Admin (only their school) and Super Admin (any school) can delete classes
classRoutes.delete("/delete_class/:class_id", checkSchoolAccess, ClassController.deleteClass);

// Super Admin only: Get all classes system-wide
classRoutes.get("/all_class", superAdminOnly, ClassController.getAllClasses);

// All authenticated users with school access: Get single class
classRoutes.get("/class/:class_id", checkSchoolAccess, ClassController.getClass);

// All authenticated users with school access: Get classes by school
classRoutes.get("/school/:school_id", checkSchoolAccess, ClassController.getClassesBySchool);

// -------------------- Advanced Class Management --------------------
// School Admin and Super Admin: Create multiple classes at once
classRoutes.post("/bulk_create", checkSchoolAccess, ClassController.bulkCreateClasses);

// School Admin and Super Admin: Update multiple classes at once
classRoutes.patch("/bulk_update", checkSchoolAccess, ClassController.bulkUpdateClasses);

// School Admin and Super Admin: Delete multiple classes at once
classRoutes.delete("/bulk_delete", checkSchoolAccess, ClassController.bulkDeleteClasses);

// School Admin and Super Admin: Archive classes (soft delete)
classRoutes.patch("/archive/:class_id", checkSchoolAccess, ClassController.archiveClass);

// School Admin and Super Admin: Restore archived classes
classRoutes.patch("/restore/:class_id", checkSchoolAccess, ClassController.restoreClass);

// School Admin and Super Admin: Get archived classes for their school
classRoutes.get("/archived/:school_id", checkSchoolAccess, ClassController.getArchivedClasses);

// School Admin and Super Admin: Duplicate a class with all settings
classRoutes.post("/duplicate/:class_id", checkSchoolAccess, ClassController.duplicateClass);

// School Admin and Super Admin: Get class statistics
classRoutes.get("/statistics/:school_id", checkSchoolAccess, ClassController.getClassStatistics);

// School Admin and Super Admin: Get class capacity and enrollment
classRoutes.get("/capacity/:class_id", checkSchoolAccess, ClassController.getClassCapacity);

// School Admin and Super Admin: Promote students to next grade
classRoutes.patch("/promote/:school_id", checkSchoolAccess, ClassController.promoteStudents);

// School Admin and Super Admin: Generate class timetable
classRoutes.post("/timetable/:class_id", checkSchoolAccess, ClassController.generateTimetable);

// School Admin and Super Admin: Import classes from CSV/Excel
classRoutes.post("/import/:school_id", checkSchoolAccess, ClassController.importClasses);

// School Admin and Super Admin: Export classes to CSV/Excel
classRoutes.get("/export/:school_id", checkSchoolAccess, ClassController.exportClasses);

// -------------------- Teacher --------------------
// School Admin and Super Admin: Assign teacher to class
classRoutes.patch("/teacher/assign", checkSchoolAccess, ClassController.assignTeacher);

// School Admin and Super Admin: Remove teacher from class
classRoutes.patch("/teacher/:class_id/:class_teacher_id", checkSchoolAccess, ClassController.removeTeacher);

// All authenticated users with school access: Get class teachers
classRoutes.get("/class/:class_id/teachers", checkSchoolAccess, ClassController.getClassTeachers);

// -------------------- Student --------------------
// School Admin and Super Admin: Assign student to class
classRoutes.patch("/student/assign", checkSchoolAccess, ClassController.assignStudent);

// School Admin and Super Admin: Remove student from class
classRoutes.patch("/student/:class_id/:student_id", checkSchoolAccess, ClassController.removeStudent);

// All authenticated users with school access: Get class students
classRoutes.get("/class/:class_id/students", checkSchoolAccess, ClassController.getClassStudents);




// -------------------- Teacher Specific Routes --------------------
// Teachers: View their assigned classes only
classRoutes.get("/teacher/my-classes", verifyRole(ROLES.TEACHER), ClassController.getTeacherClasses);

// Teachers: View students in their classes only
classRoutes.get("/teacher/my-students", verifyRole(ROLES.TEACHER), ClassController.getTeacherStudents);

export default classRoutes;
