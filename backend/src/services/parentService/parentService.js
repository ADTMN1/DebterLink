
import pool from '../../../config/db.config.js'

const getResults = async (student_id ,parent_id) => {

    try {
        const sql = `SELECT * FROM student WHERE student_id = $1`;
        const params = [student_id];
        const student = await pool.query(sql, params);
        console.log(student)
       const studentData = student.rows[0];

            if (studentData.parent_id !== parent_id){
                return false
            }
           
   
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
        const sql = `SELECT * FROM student WHERE student_id = $1`;
        const params = [student_id];
        const student = await pool.query(sql, params);
        console.log(student)
       const studentData = student.rows[0];

            if (studentData.parent_id !== parent_id){
                return false
            }
      return studentData;      
    } catch (error) {
     console.log(error)   
        throw error;
    }
}


export default {getResults, getyourStudentProfile}