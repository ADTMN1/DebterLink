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

};