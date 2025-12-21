import pool from "../../config/db.config.js";
import { ROLES } from "../../constants/roles.js";

export const checkTeacherClassAccess = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const user = req.user;
    
    if (!user || !user.role_id) {
      return res.status(401).json({
        status: false,
        msg: "Authentication required"
      });
    }

    // Only teachers can use this middleware
    if (user.role_id !== ROLES.TEACHER) { // 4 = Teacher role
      return res.status(403).json({
        status: false,
        msg: "Access denied: Teacher access required"
      });
    }

    if (!class_id) {
      return res.status(400).json({
        status: false,
        msg: "Class ID is required"
      });
    }

    // Check if teacher is assigned to this class as class teacher
    const query = `
      SELECT c.class_id, c.class_name, c.school_id
      FROM class c
      WHERE c.class_id = $1 AND c.class_teacher_id = (
        SELECT teacher_id 
        FROM teacher 
        WHERE user_id = $2
      );
    `;
    
    const result = await pool.query(query, [class_id, user.user_id]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({
        status: false,
        msg: "Access denied: You are not assigned as class teacher for this class"
      });
    }

    // Attach class info to request for potential use
    req.classInfo = result.rows[0];
    next();
  } catch (error) {
    console.error('Error checking teacher class access:', error);
    return res.status(500).json({
      status: false,
      msg: "Internal server error"
    });
  }
};

/**
 * Middleware to check if teacher can access students in their class
 */
export const checkTeacherStudentAccess = async (req, res, next) => {
  try {
    const { class_id, student_id } = req.params;
    const user = req.user;
    
    if (!user || user.role_id !== ROLES.TEACHER) {
      return res.status(403).json({
        status: false,
        msg: "Teacher access required"
      });
    }

    // Check if student belongs to teacher's class
    const query = `
      SELECT s.student_id, s.class_id
      FROM student s
      JOIN class c ON s.class_id = c.class_id
      WHERE s.student_id = $1 
        AND c.class_id = $2 
        AND c.class_teacher_id = (
          SELECT teacher_id 
          FROM teacher 
          WHERE user_id = $3
        );
    `;
    
    const result = await pool.query(query, [student_id, class_id, user.user_id]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({
        status: false,
        msg: "Access denied: Student is not in your class"
      });
    }

    next();
  } catch (error) {
    console.error('Error checking teacher student access:', error);
    return res.status(500).json({
      status: false,
      msg: "Internal server error"
    });
  }
};
