
import pool from '../../../config/db.config.js'

const getResults = async (student_id ,parent_id) => {

    try {
        // Check parent-child relationship using parent table (not student.parent_id)
        const relationshipSql = `
            SELECT p.child_student_id 
            FROM parent p 
            WHERE p.user_id = $1 AND p.child_student_id = $2
        `;
        const relationshipResult = await pool.query(relationshipSql, [parent_id, student_id]);
        
        if (relationshipResult.rows.length === 0) {
            return null;
        }
           
        // Get exam results for the student
        const sqlResults = `SELECT * FROM exam WHERE student_id = $1`;
        const resultsParams = [student_id];
        const results = await pool.query(sqlResults, resultsParams);
        return results.rows[0];   
    } catch (error) {
    console.log(error)
    throw error;    
    }
}
const getyourStudentProfile=async(parent_id,student_id)=>{
    try {
        // Check parent-child relationship using parent table (not student.parent_id)
        const relationshipSql = `
            SELECT p.child_student_id 
            FROM parent p 
            WHERE p.user_id = $1 AND p.child_student_id = $2
        `;
        const relationshipResult = await pool.query(relationshipSql, [parent_id, student_id]);
        
        if (relationshipResult.rows.length === 0) {
            return null;
        }

        // Get student profile
        const sql = `SELECT * FROM student WHERE student_id = $1`;
        const params = [student_id];
        const student = await pool.query(sql, params);
        console.log(student)
       const studentData = student.rows[0];

       if (!studentData) {
           return null;
       }

      return studentData;      
    } catch (error) {
     console.log(error)   
        throw error;
    }
}


export default {getResults, getyourStudentProfile, getStudentInfo: getyourStudentProfile}