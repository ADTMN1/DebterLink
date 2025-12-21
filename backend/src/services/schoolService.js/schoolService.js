import pool from "../../../config/db.config.js";



  const  createSchool=async(data)=> {
   try {
     const { school_name, address, phone, email, website, director_id } = data;

    const query = `
      INSERT INTO school 
        (school_name, address, phone, email, website, director_id)
      VALUES 
        ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [school_name, address, phone , email , website || null, director_id||null];

    const result = await pool.query(query, values);
    return result.rows[0];
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  const  updateSchool=async(school_id, data)=> {
  try {
      const { school_name, address, phone, email, website, director_id } = data;

    const query = `
      UPDATE school
      SET 
        school_name = COALESCE($1, school_name),
        address = COALESCE($2, address),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        website = COALESCE($5, website),
        director_id = COALESCE($6, director_id)
      WHERE school_id = $7
      RETURNING *;
    `;

    const values = [school_name, address, phone, email, website, director_id, school_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.log(error)
    throw error
  }
  }

   const  getAllSchools=async() =>{
    try {
      //order by time 
          const query = `SELECT * FROM school ORDER BY school_name ASC;`;
         const result = await pool.query(query);
       return result.rows;
    } catch (error) {
      console.log(error)
      throw error
    }
  }


  const  deleteSchool=async(school_id)=> {
   try {
     const query = `DELETE FROM school WHERE school_id = $1 RETURNING *;`;
    const result = await pool.query(query, [school_id]);
    console.log(result)
    return result.rows[0];
    
   } catch (error) {
    console.log(error)
    throw error
   }
  }

  const  getSchoolById=async(school_id)=> {
    try {
      const query = `SELECT * FROM school WHERE school_id = $1;`;
    const result = await pool.query(query, [school_id]);
    return result.rows[0];
    } catch (error) {
      console.log(error)
      throw error
    }
  }

 
 const  schoolExists=async(school_id) =>{
    const query = `SELECT * FROM school WHERE school_name = $1;`;
    const result = await pool.query(query, [school_id]);
    return result.rowCount > 0;
  }


  ///CONETION WHITH SCHOOL AND TEACHER

  const  getSchoolClasses=async(school_id)=> {
    const query = `
      SELECT * FROM class
      WHERE school_id = $1
      ORDER BY class_name, section;
    `;
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }

  const  getSchoolTeachers=async(school_id)=> {
    const query = `
      SELECT t.*, u.full_name, u.email, u.phone_number
      FROM teacher t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.school_id = $1
      ORDER BY u.full_name;
    `;
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }

  const  getSchoolStudents=async(school_id)=> {
    const query = `
      SELECT s.* 
      FROM student s
      JOIN class c ON s.class_id = c.class_id
      WHERE c.school_id = $1;
    `;
    const result = await pool.query(query, [school_id]);
    return result.rows;
  }


 

export default {
  createSchool,
  updateSchool,
  deleteSchool,
  getAllSchools,
  getSchoolById,
  getSchoolById,
  getSchoolClasses,
  getSchoolTeachers,
  getSchoolTeachers,
  getSchoolStudents,
  schoolExists
}