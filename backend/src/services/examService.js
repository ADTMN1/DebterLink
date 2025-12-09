import e from "express";
import pool from "../../config/db.config.js"
import eventBus from "../../events/event.bus.js";

const submitExamService =async(payload)=>{
try {
    
  const exam_date= new  Date()
    const sql = `
  INSERT INTO exam (
    subject_id,
    class_id,
    teacher_id,
    exam_type_id,
    student_id,
    total_marks,
    exam_date
  ) VALUES ($1, $2, $3, $4, $5,$6,$7)
  RETURNING *;
`;
// console.log(exam_date)
const values = [
  payload.subject_id,
  payload.class_id,
  payload.teacher_id,
  payload.exam_type_id,
  payload.student_id,
  payload.total_marks,
  exam_date,
]

const result = await pool.query(sql, values);

// console.log(result.rows[0])
if (result.rows[0]) {
  eventBus.emit("examSubmitted", {
    student_id: result.rows[0].student_id,
    total_marks: result.rows[0].total_marksc,
    exam_type_id: result.rows[0].exam_type_id,
    subject_id: result.rows[0].subject_id,
    teacher_id: result.rows[0].teacher_id
  });
  console.log("sent to emmitter")
}


return result.rows[0]

} catch (error) {
    console.log(error)
    throw error
}
}

const updateExamService =async(payload)=>{
    try {

     const sql = `
  UPDATE exam
  SET total_marks = COALESCE($1, total_marks)
  WHERE subject_id   = COALESCE($2, subject_id)
    AND class_id     = COALESCE($3, class_id)
    AND teacher_id   = COALESCE($4, teacher_id)
    AND exam_type_id = COALESCE($5, exam_type_id)
    AND student_id   = $6
  RETURNING *;
`;


  
  const values = [
    payload.total_marks,
    payload.subject_id,
    payload.class_id,
    payload.teacher_id,
    payload.exam_type_id,
    payload.student_id,
  ]

  const result = await pool.query(sql, values);

  // console.log(result.rows[0])
  return result.rows[0]
    } catch (error) {
        console.log(error)
        throw error
    }}

const getAllExamService =async(teacher_id)=>{
    try {
 
  
       const sql = `SELECT * FROM exam WHERE teacher_id=$1`;
       const values =[teacher_id]
       const result = await pool.query(sql,values);

      //  console.log(result)
       return result.rows
      

    } catch (error) {
       console.log(error) 
       throw error
    }
}


const totalExamService =async(student_id)=>{

try {
const sqlSum = `
SELECT
    student_id,
    SUM(total_marks) AS total_marks_all_exams
FROM
    exam
WHERE student_id = $1
GROUP BY
    student_id
`;

const totalResult = await pool.query(sqlSum, [student_id]);
console.log(totalResult.rows);
return totalResult.rows;
  
} catch (error) {
  console.log(error);
  throw error
}

}


    export default {submitExamService,updateExamService,getAllExamService, totalExamService}