import express from "express";
import SchoolController from "../controllers/school/school.controller.js";

const schoolRoutes = express.Router();

schoolRoutes.post("/create-school", SchoolController.createSchool);       // Create school
schoolRoutes.patch("/edit_school/:school_id", SchoolController.updateSchool); // Update school
schoolRoutes.get("/get_schools", SchoolController.getAllSchools);      // Get all schools
schoolRoutes.get("/get_school/:school_id", SchoolController.getSchool); // Get single school
schoolRoutes.delete("/delete_school/:school_id", SchoolController.deleteSchool); // Delete school

schoolRoutes.get("/:school_id/classes", SchoolController.getSchoolClasses); 
schoolRoutes.get("/:school_id/teachers", SchoolController.getSchoolTeachers);
schoolRoutes.get("/:school_id/students", SchoolController.getSchoolStudents); 
export default schoolRoutes;
