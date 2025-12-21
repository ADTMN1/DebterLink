import pool from "../../config/db.config.js";

export const checkSchoolAccess = async (req, res, next) => {
  try {
    const { school_id } = req.params;
    const { school_id: bodySchoolId } = req.body || {};
    const user = req.user;
    
    console.log('School Access Check - User:', user);
    console.log('School Access Check - Params school_id:', school_id);
    console.log('School Access Check - Body school_id:', bodySchoolId);
    
    if (!user || !user.role_id) {
      return res.status(401).json({
        status: false,
        msg: "Authentication required"
      });
    }

    // Use school_id from params, body, or get it from user's assigned school
    const targetSchoolId = school_id || bodySchoolId;
    
    console.log('School Access Check - Target School ID:', targetSchoolId);
    console.log('School Access Check - Role ID:', user.role_id);
    
    let hasAccess = false;
    let userSchoolId = null;

    // Check access based on role
    switch (user.role_id) {
      case 1: // Super Admin - can access any school but must validate it exists
        if (targetSchoolId) {
          // Validate school exists
          const schoolCheck = await pool.query(
            'SELECT school_id FROM school WHERE school_id = $1',
            [targetSchoolId]
          );
          if (schoolCheck.rows.length === 0) {
            return res.status(404).json({
              status: false,
              msg: "School not found"
            });
          }
          req.user.school_id = targetSchoolId;
        } else {
          // For bulk operations, Super Admin can proceed without specific school
          hasAccess = true;
        }
        hasAccess = true;
        break;

      case 2: // School Admin - can only access their assigned school
        console.log('Checking admin record for user_id:', user.user_id);
        const adminQuery = `
          SELECT school_id 
          FROM admin 
          WHERE user_id = $1
        `;
        const adminResult = await pool.query(adminQuery, [user.user_id]);
        console.log('Admin query result:', adminResult.rows);
        if (adminResult.rows.length > 0) {
          userSchoolId = adminResult.rows[0].school_id;
          hasAccess = !targetSchoolId || userSchoolId === targetSchoolId;
          if (!targetSchoolId) {
            // For bulk operations, use their assigned school
            req.user.school_id = userSchoolId;
          }
        } else {
          console.log('No admin record found for user_id:', user.user_id);
          // School Admins MUST have an admin record to access school resources
          return res.status(403).json({
            status: false,
            msg: "School Admin must be assigned to a school. Please contact Super Admin."
          });
        }
        break;

      case 4: // Teacher - can only access their assigned school
        const teacherQuery = `
          SELECT school_id 
          FROM teacher 
          WHERE user_id = $1
        `;
        const teacherResult = await pool.query(teacherQuery, [user.user_id]);
        if (teacherResult.rows.length > 0) {
          userSchoolId = teacherResult.rows[0].school_id;
          hasAccess = !targetSchoolId || userSchoolId === targetSchoolId;
        }
        break;

      case 5: // Student - can only access their school via class
        const studentQuery = `
          SELECT c.school_id 
          FROM student s
          JOIN class c ON s.class_id = c.class_id
          WHERE s.user_id = $1
        `;
        const studentResult = await pool.query(studentQuery, [user.user_id]);
        if (studentResult.rows.length > 0) {
          userSchoolId = studentResult.rows[0].school_id;
          hasAccess = !targetSchoolId || userSchoolId === targetSchoolId;
        }
        break;

      case 6: // Parent - can only access their children's school
        const parentQuery = `
          SELECT c.school_id 
          FROM student s
          JOIN class c ON s.class_id = c.class_id
          JOIN parent p ON p.student_id = s.student_id
          WHERE p.user_id = $1
        `;
        const parentResult = await pool.query(parentQuery, [user.user_id]);
        if (parentResult.rows.length > 0) {
          userSchoolId = parentResult.rows[0].school_id;
          hasAccess = !targetSchoolId || userSchoolId === targetSchoolId;
        }
        break;

      default:
        return res.status(403).json({
          status: false,
          msg: "Invalid role"
        });
    }

    if (!hasAccess) {
      return res.status(403).json({
        status: false,
        msg: "Access denied: You don't have permission to access this school"
      });
    }

    // Set the school_id in user context for use in controllers
    req.user.school_id = userSchoolId || targetSchoolId;
    next();
  } catch (error) {
    console.error('Error checking school access:', error);
    return res.status(500).json({
      status: false,
      msg: "Internal server error"
    });
  }
};

/**
 * Middleware to allow only Super Admins
 */
export const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      status: false,
      msg: "Access denied: Super Admin access required"
    });
  }
  next();
};
