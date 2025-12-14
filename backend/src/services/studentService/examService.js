
import pool from "../../../config/db.config.js";

const getYourExamService =async(student_id)=>{
    try {
       const sql =`SELECT * FROM exam where student_id = $1`;
       const params =[student_id];
       const result = await pool.query(sql,params);

       return result.rows[0];
    } catch (error) {   
        console.log(error)
        throw error;
    }
    }


export default {getYourExamService}