import express from "express";
import ClassController from "../controllers/school/class.controller.js";

const classROutes = express.Router();

// -------------------- CRUD --------------------
classROutes.post("/create_class", ClassController.createClass);        // Create class
classROutes.patch("/update_class/:class_id", ClassController.updateClass); // Update class
classROutes.delete("/delete_class/:class_id", ClassController.deleteClass); // Delete class
classROutes.get("/all_class", ClassController.getAllClasses);      // Get all classes
classROutes.get("/:class_id", ClassController.getClass);  // Get single class

// -------------------- Filters --------------------
classROutes.get("/school/:school_id", ClassController.getClassesBySchool); // Classes by school
classROutes.get("/grade/:grade", ClassController.getClassesByGrade);       // Classes by grade

// -------------------- Teacher --------------------
classROutes.patch("/teacher/assign", ClassController.assignTeacher);         // Assign single teacher
classROutes.patch("/teacher/:class_id/:class_teacher_id", ClassController.removeTeacher);  // Remove teacher
classROutes.get("/:class_id/teachers", ClassController.getClassTeachers);             // Get class teachers

// -------------------- Student --------------------
classROutes.patch("/student/assign", ClassController.assignStudent);         // Assign single student
classROutes.patch("/student/:class_id/:student_id", ClassController.removeStudent);  // Remove student
classROutes.get("/:class_id/students", ClassController.getClassStudents);               // Get class 




export default classROutes;
