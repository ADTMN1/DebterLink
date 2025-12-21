import express from "express";
import { authMiddleware, verifyRole } from "../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { checkSchoolAccess, superAdminOnly } from "../middleware/schoolAccess.js";
import SchoolController from "../controllers/school/school.controller.js";

const schoolRoutes = express.Router();

// Apply authentication to all routes
schoolRoutes.use(authMiddleware);

// Super Admin only: Get all schools (system-wide view)
schoolRoutes.get("/get_schools", superAdminOnly, SchoolController.getAllSchools);

// Super Admin only: Delete any school
schoolRoutes.delete("/delete_school/:school_id", superAdminOnly, SchoolController.deleteSchool);

// School Admin and Super Admin: Update school info
schoolRoutes.patch("/edit_school/:school_id", checkSchoolAccess, SchoolController.updateSchool);

// All authenticated users with school access: Get single school
schoolRoutes.get("/get_school/:school_id", checkSchoolAccess, SchoolController.getSchool);

// All authenticated users with school access: Get school relationships
schoolRoutes.get("/:school_id/classes", checkSchoolAccess, SchoolController.getSchoolClasses);
schoolRoutes.get("/:school_id/teachers", checkSchoolAccess, SchoolController.getSchoolTeachers);
schoolRoutes.get("/:school_id/students", checkSchoolAccess, SchoolController.getSchoolStudents); 
export default schoolRoutes;
