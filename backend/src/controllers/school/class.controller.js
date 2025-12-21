import { StatusCodes } from "http-status-codes";
import ClassService from "../../services/schoolService.js/classService.js";


const createClass = async (req, res) => {
  try {
    const { class_name, class_teacher_id, grade, school_id, academic_year, section } = req.body;
    
    // Get school_id from user context if not provided in body
    const final_school_id = school_id || req.user?.school_id;
    
    if (!class_name || !grade || !final_school_id || !academic_year || !section) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Missing required fields: class_name, grade, school_id, academic_year, section"
      });
    }

    const schoolClass = await ClassService.createClass({
      class_name, 
      class_teacher_id, 
      grade, 
      school_id: final_school_id,
      academic_year, 
      section
    });
    
    if (!schoolClass) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        status: false,
        msg: "Failed to create class" 
      });
    }
    
    return res.status(StatusCodes.CREATED).json({
       status: true, 
       msg: "Class created successfully",
       data: schoolClass
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    if(!class_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing class_id" }); 

    }
    if(Object.keys(req.body).length === 0){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "No data to update" });
    }
    const updated = await ClassService.updateClass(class_id, req.body);
    if(!updated) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to update class" })
    return res.status(StatusCodes.OK).json({ 
      status: true,
      msg: "Class updated successfully",
      data: updated
     });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false, 
      msg: "Internal server Error." });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    if(!class_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing class_id" });
    } 
    const deleted = await ClassService.deleteClass(class_id);
    if(!deleted) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to delete class" })
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Class deleted successfully",
     }); 
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal server Error." });
  }
};

const getClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    if(!class_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing class_id" });
    }
    const schoolClass = await ClassService.getClassById(class_id);
    if(!schoolClass) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to fetch class" })
    return res.status(StatusCodes.OK).json({ 
      status: true, 
      msg: "Class fetched successfully",
      data:  schoolClass });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false,
       msg: "Internal Server error" });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassService.getAllClasses();
    if(!classes) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
       status: false,
        msg: "Failed to fetch classes" });

    return res.status(StatusCodes.OK).json({ 
      status: true, 
      msg: "Classes fetched successfully",
      data: classes
      });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, 
      msg: "Internal Server Error" });
  }
};

// -------------------- Filters --------------------
const getClassesBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    if(!school_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing school_id" });
    }
    const classes = await ClassService.getClassesBySchool(school_id);
    if(!classes) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to fetch classes" });
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Classes fetched successfully",
      data: classes
      }); 
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false ,
      msg: "Internal Server Error"
    });
  }
};

const getClassesByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    const classes = await ClassService.getClassesByGrade(grade);
    return res.status(StatusCodes.OK).json({ status: true, classes });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false });
  }
};

// -------------------- Teacher --------------------
const assignTeacher = async (req, res) => {
  try {
    const { class_id, class_teacher_id } = req.body;
    console.log(class_id, class_teacher_id )
    if(!class_id || !class_teacher_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing required fields" });
    }
    const assigned = await ClassService.assignTeacherToClass(class_id, class_teacher_id);
    if(!assigned) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to assign teacher" });

    return res.status(StatusCodes.OK).json({ 
      status: true,
      msg: "Teacher assigned successfully",
      data: assigned
     });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
       status: false,
      msg: "Internal Server Error"
     });
  }
};



const removeTeacher = async (req, res) => {
  try {
    const { class_id, class_teacher_id } = req.params;
    if(!class_id || !class_teacher_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing required fields" });
    }
    const removed = await ClassService.removeTeacherFromClass(class_id, class_teacher_id);
    if(!removed) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to remove teacher" });

    return res.status(StatusCodes.OK).json({ 
      status: true, 
      msg: "Teacher removed successfully",
      data: removed });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false, 
      msg: "Internal Server Error"
    });
  }
};

const getClassTeachers = async (req, res) => {
  try {
    const { class_id } = req.params;
    if(!class_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing class_id" });
    } 
    const teachers = await ClassService.getClassTeachers(class_id);
    if(!teachers) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to fetch teachers" });
    return res.status(StatusCodes.OK).json({
       status: true,
       msg: "Teachers fetched successfully",
       data: teachers 
      });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
      msg: "Internal Server Error"
     });
  }
};

// -------------------- Student --------------------
const assignStudent = async (req, res) => {
  try {
    const { class_id, student_id } = req.body;
    if(!class_id || !student_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing required fields" });
    }
    const assigned = await ClassService.assignStudentToClass(class_id, student_id);
    if(!assigned) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to assign student" });
    return res.status(StatusCodes.OK).json({ status: true,
       msg: "Student assigned successfully",
       data:  assigned });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
     }); 
  }
};


const removeStudent = async (req, res) => {
  try {
    const { class_id, student_id } = req.params;
    if(!class_id || !student_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing required fields" });
    }
    const removed = await ClassService.removeStudentFromClass(class_id, student_id);
    if(!removed) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to remove student" });
    return res.status(StatusCodes.OK).json({ 
      
      status: true,
      msg: "Student removed successfully",
      data: removed });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
     }); 
  }
};



const getClassStudents = async (req, res) => {
  try {
    const { class_id } = req.params;
    if(!class_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
         msg: "Missing class_id" });
    }
    const students = await ClassService.getClassStudents(class_id);
    if(!students) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
       msg: "Failed to fetch students" });
    return res.status(StatusCodes.OK).json({ 
      status: true,
      msg: "Students fetched successfully",
      data:students });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
     }); 
  }
};




// -------------------- Advanced Class Management Methods --------------------
const bulkCreateClasses = async (req, res) => {
  try {
    const { classes, academic_year } = req.body;
    // Get school_id from the user's assigned school (from checkSchoolAccess middleware)
    const school_id = req.user.school_id || req.body.school_id;
    
    if (!school_id || !classes || !Array.isArray(classes)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "School ID and classes array are required"
      });
    }
    
    const results = await ClassService.bulkCreateClasses(school_id, classes, academic_year);
    return res.status(StatusCodes.CREATED).json({
      status: true,
      msg: `${results.length} classes created successfully`,
      data: results
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const bulkUpdateClasses = async (req, res) => {
  try {
    const { classes } = req.body;
    if (!classes || !Array.isArray(classes)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Classes array is required"
      });
    }
    
    const results = await ClassService.bulkUpdateClasses(classes);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: `${results.length} classes updated successfully`,
      data: results
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const bulkDeleteClasses = async (req, res) => {
  try {
    const { class_ids } = req.body;
    if (!class_ids || !Array.isArray(class_ids)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Class IDs array is required"
      });
    }
    
    const results = await ClassService.bulkDeleteClasses(class_ids);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: `${results.length} classes deleted successfully`,
      data: results
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const archiveClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { reason } = req.body;
    
    const result = await ClassService.archiveClass(class_id, reason);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Class archived successfully",
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const restoreClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    
    const result = await ClassService.restoreClass(class_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Class restored successfully",
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const getArchivedClasses = async (req, res) => {
  try {
    const { school_id } = req.params;
    
    const classes = await ClassService.getArchivedClasses(school_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Archived classes fetched successfully",
      data: classes
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const duplicateClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { new_class_name, section } = req.body;
    
    const result = await ClassService.duplicateClass(class_id, new_class_name, section);
    return res.status(StatusCodes.CREATED).json({
      status: true,
      msg: "Class duplicated successfully",
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const getClassStatistics = async (req, res) => {
  try {
    const { school_id } = req.params;
    
    const stats = await ClassService.getClassStatistics(school_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Class statistics fetched successfully",
      data: stats
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const getClassCapacity = async (req, res) => {
  try {
    const { class_id } = req.params;
    
    const capacity = await ClassService.getClassCapacity(class_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Class capacity fetched successfully",
      data: capacity
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const promoteStudents = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { from_grade, to_grade, academic_year } = req.body;
    
    const result = await ClassService.promoteStudents(school_id, from_grade, to_grade, academic_year);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: `${result.promoted_count} students promoted successfully`,
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const generateTimetable = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { subjects } = req.body;
    
    const timetable = await ClassService.generateTimetable(class_id, subjects);
    return res.status(StatusCodes.CREATED).json({
      status: true,
      msg: "Timetable generated successfully",
      data: timetable
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const importClasses = async (req, res) => {
  try {
    const { school_id } = req.params;
    // Handle file upload or CSV data
    const result = await ClassService.importClasses(school_id, req.body);
    return res.status(StatusCodes.CREATED).json({
      status: true,
      msg: `${result.imported_count} classes imported successfully`,
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const exportClasses = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { format } = req.query; // csv or excel
    
    const exportData = await ClassService.exportClasses(school_id, format);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Classes exported successfully",
      data: exportData
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

// -------------------- Teacher Specific Methods --------------------
const getTeacherClasses = async (req, res) => {
  try {
    const teacher_id = await ClassService.getTeacherIdByUserId(req.user.user_id);
    if (!teacher_id) {
      return res.status(404).json({
        status: false,
        msg: "Teacher not found"
      });
    }
    
    const classes = await ClassService.getTeacherClasses(teacher_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Teacher classes fetched successfully",
      data: classes
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    const teacher_id = await ClassService.getTeacherIdByUserId(req.user.user_id);
    if (!teacher_id) {
      return res.status(404).json({
        status: false,
        msg: "Teacher not found"
      });
    }
    
    const students = await ClassService.getTeacherStudents(teacher_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Teacher students fetched successfully",
      data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

export default {
  createClass,
  updateClass,
  deleteClass,
  getClass,
  getAllClasses,
  getClassesBySchool,
  getClassesByGrade,
  assignTeacher,
  removeTeacher,
  getClassTeachers,
  assignStudent,
  removeStudent,
  getClassStudents,
  // Advanced methods
  bulkCreateClasses,
  bulkUpdateClasses,
  bulkDeleteClasses,
  archiveClass,
  restoreClass,
  getArchivedClasses,
  duplicateClass,
  getClassStatistics,
  getClassCapacity,
  promoteStudents,
  generateTimetable,
  importClasses,
  exportClasses,
  // Teacher methods
  getTeacherClasses,
  getTeacherStudents
};
