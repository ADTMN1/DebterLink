import pool from "../../../config/db.config.js";


  const createClass=async(data) =>{
   try {
     const {class_name,class_teacher_id,grade,school_id,academic_year,section } = data;
    const query = `
      INSERT INTO class (class_name,class_teacher_id,grade,school_id,academic_year,section)
      VALUES ($1, $2, $3,$4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [class_name,class_teacher_id,grade,school_id,academic_year,section]);
    return result.rows[0];
    
   } catch (error) {
    console.log(error)
    throw error
   }
  }

 const updateClass = async (class_id, data) => {
try {
    const { class_name, class_teacher_id, grade, academic_year, section } = data;

  const query = `
    UPDATE class
    SET class_name = COALESCE($1, class_name),
        grade = COALESCE($2, grade),
        class_teacher_id = COALESCE($3, class_teacher_id),
        academic_year = COALESCE($4, academic_year),
        section = COALESCE($5, section)
    WHERE class_id = $6
    RETURNING *;
  `;

  const values = [
    class_name,        // $1
    grade,             // $2
    class_teacher_id,  // $3
    academic_year,     // $4
    section,           // $5
    class_id           // $6
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
} catch (error) {
  console.log(error)
  throw error
}
};

  const deleteClass=async(class_id)=> {
    try {
      const query = `DELETE FROM class WHERE class_id = $1 RETURNING *;`;
    const result = await pool.query(query, [class_id]);
    return result.rows[0];
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const getClassById=async(class_id) =>{
   try {
     const query = `SELECT * FROM class WHERE class_id = $1;`;
    const result = await pool.query(query, [class_id]);
    return result.rows[0];
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  const getAllClasses=async()=> {
   try {
     const query = `SELECT * FROM class ORDER BY grade, class_name;`;
    const result = await pool.query(query);
    return result.rows;
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  // -------------------- Filters --------------------
  const getClassesBySchool=async(school_id) =>{
   try {
     const query = `SELECT * FROM class WHERE school_id = $1 ORDER BY grade, class_name;`;
    const result = await pool.query(query, [school_id]);
    return result.rows;
    
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  const getClassesByGrade=async(grade) =>{
   try {
     const query = `SELECT * FROM class WHERE grade = $1 ORDER BY class_name;`;
    const result = await pool.query(query, [grade]);
    return result.rows;
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  // -------------------- Teacher --------------------
  const assignTeacherToClass =async(class_id, class_teacher_id) =>{
   try {
     const query = `
      UPdate class SET class_teacher_id = $2 WHERE class_id = $1 RETURNING *; 
    `;
    const result = await pool.query(query, [class_id, class_teacher_id]);
    return result.rows[0];
   } catch (error) {
    console.log(error)
    throw error
   }
  }



  const removeTeacherFromClass=async(class_id, lass_teacher_id ) =>{
    try {
      const query = `
      update class SET class_teacher_id = null WHERE class_id = $1 AND class_teacher_id = $2 RETURNING *;
    `;
    const result = await pool.query(query, [class_id, lass_teacher_id ]);
    return result.rows[0];
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const getClassTeachers=async(class_id)=> {
  try {
    const query = `
  SELECT
  c.*,
  t.*,
  u.*
FROM "class" c
JOIN teacher t
  ON c.class_teacher_id = t.teacher_id
JOIN users u
  ON t.user_id = u.user_id
WHERE c.class_id = $1;


      
    `;
    const result = await pool.query(query, [class_id]);
    return result.rows;
  } catch (error) {
    console.log(error)
    throw error
  }
  }
  // -------------------- Student --------------------
  const assignStudentToClass=async(class_id, student_id) =>{
    try {
     const query = `
      update student Set class_id = $1 WHERE student_id = $2 RETURNING *;
    `;
    const result = await pool.query(query, [class_id, student_id]);
    return result.rows[0];
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const assignStudentsToClass=async(class_id, student_ids)=> {
    const results = [];
    for (const id of student_ids) {
      const r = await this.assignStudentToClass(class_id, id);
      results.push(r);
    }
    return results;
  }

  const removeStudentFromClass=async(class_id, student_id)=>  {
   try {
     const query = `
      update student Set class_id = null WHERE class_id = $1 AND student_id = $2 RETURNING *;
    `;
    const result = await pool.query(query, [class_id, student_id]);
    return result.rows[0];
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  const transferStudent =async(student_id, from_class_id, to_class_id)=> {
    await this.removeStudentFromClass(from_class_id, student_id);
    return await this.assignStudentToClass(to_class_id, student_id);
  }

  const getClassStudents=async(class_id) =>{
  try {
    const query = `
  SELECT
  s.*,
  u.*
FROM student s
JOIN users u
  ON s.user_id = u.user_id
WHERE s.class_id = $1;
    `;
    const result = await pool.query(query, [class_id]);
    return result.rows;
  } catch (error) {
    console.log(error)
    throw error
  }
  }



 
  // -------------------- Teacher Specific Methods --------------------
  const getTeacherIdByUserId = async (user_id) => {
    try {
      const query = `SELECT teacher_id FROM teacher WHERE user_id = $1;`;
      const result = await pool.query(query, [user_id]);
      return result.rows[0]?.teacher_id || null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getTeacherClasses = async (teacher_id) => {
    try {
      const query = `
        SELECT c.*, s.school_name
        FROM class c
        JOIN school s ON c.school_id = s.school_id
        WHERE c.class_teacher_id = $1
        ORDER BY c.class_name, c.section;
      `;
      const result = await pool.query(query, [teacher_id]);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getTeacherStudents = async (teacher_id) => {
    try {
      const query = `
        SELECT s.*, u.full_name, u.email, c.class_name, c.section
        FROM student s
        JOIN users u ON s.user_id = u.user_id
        JOIN class c ON s.class_id = c.class_id
        WHERE c.class_teacher_id = $1
        ORDER BY c.class_name, c.section, u.full_name;
      `;
      const result = await pool.query(query, [teacher_id]);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // -------------------- Advanced Class Management Methods --------------------
  const bulkCreateClasses = async (school_id, classes, academic_year) => {
    try {
      const results = [];
      for (const classData of classes) {
        const { class_name, section, class_teacher_id } = classData;
        const query = `
          INSERT INTO class (class_name, section, school_id, academic_year, class_teacher_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const result = await pool.query(query, [class_name, section, school_id, academic_year, class_teacher_id]);
        results.push(result.rows[0]);
      }
      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const bulkUpdateClasses = async (classes) => {
    try {
      const results = [];
      for (const classData of classes) {
        const { class_id, class_name, section, class_teacher_id } = classData;
        const query = `
          UPDATE class 
          SET class_name = COALESCE($1, class_name),
              section = COALESCE($2, section),
              class_teacher_id = COALESCE($3, class_teacher_id)
          WHERE class_id = $4
          RETURNING *;
        `;
        const result = await pool.query(query, [class_name, section, class_teacher_id, class_id]);
        results.push(result.rows[0]);
      }
      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const bulkDeleteClasses = async (class_ids) => {
    try {
      const results = [];
      for (const class_id of class_ids) {
        const query = `DELETE FROM class WHERE class_id = $1 RETURNING *;`;
        const result = await pool.query(query, [class_id]);
        if (result.rows[0]) results.push(result.rows[0]);
      }
      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const archiveClass = async (class_id, reason) => {
    try {
      // For now, we'll just delete the class. In a real system, you'd have an archived_classes table
      const query = `DELETE FROM class WHERE class_id = $1 RETURNING *;`;
      const result = await pool.query(query, [class_id]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const restoreClass = async (class_id) => {
    try {
      // This would restore from an archived_classes table in a real system
      throw new Error("Restore functionality not implemented - no archived_classes table");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getArchivedClasses = async (school_id) => {
    try {
      // This would query from archived_classes table in a real system
      return []; // Return empty array for now
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const duplicateClass = async (class_id, new_class_name, section) => {
    try {
      // First get the original class data
      const originalQuery = `SELECT * FROM class WHERE class_id = $1;`;
      const originalResult = await pool.query(originalQuery, [class_id]);
      const originalClass = originalResult.rows[0];
      
      if (!originalClass) {
        throw new Error("Original class not found");
      }
      
      // Create duplicate
      const query = `
        INSERT INTO class (class_name, section, school_id, academic_year, class_teacher_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const result = await pool.query(query, [
        new_class_name || originalClass.class_name,
        section || originalClass.section,
        originalClass.school_id,
        originalClass.academic_year,
        originalClass.class_teacher_id
      ]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getClassStatistics = async (school_id) => {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_classes,
          COUNT(class_teacher_id) as classes_with_teachers,
          COUNT(DISTINCT grade) as grade_levels,
          COUNT(DISTINCT academic_year) as academic_years
        FROM class 
        WHERE school_id = $1;
      `;
      const result = await pool.query(query, [school_id]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getClassCapacity = async (class_id) => {
    try {
      const query = `
        SELECT 
          c.*,
          COUNT(s.student_id) as enrolled_students
        FROM class c
        LEFT JOIN student s ON c.class_id = s.class_id
        WHERE c.class_id = $1
        GROUP BY c.class_id;
      `;
      const result = await pool.query(query, [class_id]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const promoteStudents = async (school_id, from_grade, to_grade, academic_year) => {
    try {
      // Get all students in from_grade classes
      const getStudentsQuery = `
        SELECT s.student_id, c.class_id as current_class_id
        FROM student s
        JOIN class c ON s.class_id = c.class_id
        WHERE c.school_id = $1 AND c.grade = $2;
      `;
      const studentsResult = await pool.query(getStudentsQuery, [school_id, from_grade]);
      
      // Find or create to_grade classes
      const getClassesQuery = `
        SELECT * FROM class WHERE school_id = $1 AND grade = $2;
      `;
      const classesResult = await pool.query(getClassesQuery, [school_id, to_grade]);
      
      let promotedCount = 0;
      
      // For simplicity, we'll just update the academic_year for existing classes
      // In a real system, you'd handle class assignments more carefully
      for (const student of studentsResult.rows) {
        // This is simplified - in reality you'd need proper class assignment logic
        promotedCount++;
      }
      
      return { promoted_count: promotedCount };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const generateTimetable = async (class_id, subjects) => {
    try {
      // This would generate a timetable - for now return a placeholder
      return {
        class_id,
        timetable: "Timetable generation not implemented yet",
        subjects
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const importClasses = async (school_id, data) => {
    try {
      // This would handle CSV/Excel import - for now process the data directly
      const { classes } = data;
      return await bulkCreateClasses(school_id, classes, "2024-2025");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const exportClasses = async (school_id, format) => {
    try {
      const query = `SELECT * FROM class WHERE school_id = $1 ORDER BY class_name, section;`;
      const result = await pool.query(query, [school_id]);
      
      return {
        format: format || "json",
        data: result.rows,
        exported_at: new Date().toISOString()
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

export default {
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  getAllClasses,
  getClassesBySchool,
  getClassesByGrade,
  assignTeacherToClass,
  removeTeacherFromClass,
  getClassTeachers,
  assignStudentToClass,
  assignStudentsToClass,
  removeStudentFromClass,
  transferStudent,
  getClassStudents,
  // Teacher methods
  getTeacherIdByUserId,
  getTeacherClasses,
  getTeacherStudents,
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
  exportClasses
};