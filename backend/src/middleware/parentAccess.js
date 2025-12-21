import pool from "../../config/db.config.js";

export const checkParentStudentAccess = async (req, res, next) => {
  try {
    const { student_id } = req.params;
    const user = req.user;

    // Get parent_id from authenticated user (JWT token)
    const parent_id = user.user_id;

    // Verify parent-student relationship exists
    const query = `
      SELECT p.child_student_id as student_id, s.user_id as student_user_id
      FROM parent p
      JOIN student s ON p.child_student_id = s.student_id
      WHERE p.user_id = $1 AND p.child_student_id = $2
    `;
    
    const result = await pool.query(query, [parent_id, student_id]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({
        status: false,
        msg: "Access denied: This student is not your child"
      });
    }

    // Attach student info to request for use in controllers
    req.studentInfo = result.rows[0];
    next();
  } catch (error) {
    console.error('Error checking parent student access:', error);
    return res.status(500).json({
      status: false,
      msg: "Internal server error"
    });
  }
};
