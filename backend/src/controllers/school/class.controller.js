import { StatusCodes } from "http-status-codes";
import ClassService from "../../services/schoolService.js/classService.js";


const createClass = async (req, res) => {
  try {
const { class_name,class_teacher_id ,grade, school_id,academic_year,section } = req.body;
if (!class_name   || !grade || !school_id ||!academic_year  ||! section) {
  return res.status(StatusCodes.BAD_REQUEST).json({
     status: false,
      msg: "Missing required fields" });
}

    const schoolClass = await ClassService.createClass({class_name,class_teacher_id,grade,school_id,academic_year,section});
    if(!schoolClass) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Failed to create class" 
      })
    return res.status(StatusCodes.CREATED).json({
       status: true, 
       msg:"class is created Successfully",
       school_class : schoolClass
      });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error." });
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
  
  getClassStudents
};
